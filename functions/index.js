import functions from 'firebase-functions'
import admin from 'firebase-admin'
import fetch from 'node-fetch'
import 'dotenv/config'

admin.initializeApp()
const db = admin.firestore()

// Kakao/Naver OAuth → Firebase Custom Token (데모용 간단 구현)
export const createCustomToken = functions.https.onCall(async (data, context) => {
  const { provider, providerUid, profile } = data
  if (!provider || !providerUid) {
    throw new functions.https.HttpsError('invalid-argument', 'provider/providerUid required')
  }

  const uid = `${provider}:${providerUid}`
  // 사용자 커스텀 클레임/레코드 보장
  await admin.auth().getUser(uid).catch(async () => {
    await admin.auth().createUser({ uid, displayName: profile?.name || provider, photoURL: profile?.photoURL })
  })

  // Firestore 사용자 문서 보장
  const userRef = db.doc(`users/${uid}`)
  const snap = await userRef.get()
  if (!snap.exists) {
    await userRef.set({
      uid,
      email: profile?.email || '',
      displayName: profile?.name || provider,
      photoURL: profile?.photoURL || '',
      role: 'user',
      referralCode: (Math.random().toString(36).slice(2, 10)).toUpperCase(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }

  const token = await admin.auth().createCustomToken(uid)
  return { customToken: token }
})

// Toss Webhook 검증/처리(간단)
export const tossWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const payload = req.body || {}
    functions.logger.info('tossWebhook', payload)

    if (payload.status === 'DONE' || payload.status === 'SUCCESS') {
      const booking = {
        userId: payload.metadata?.userId || '',
        quoteRequestId: payload.metadata?.quoteRequestId || '',
        amount: payload.totalAmount || payload.amount || 0,
        method: payload.method || 'TOSS',
        status: 'paid',
        paymentKey: payload.paymentKey || '',
        orderId: payload.orderId || '',
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }
      const bookingRef = await db.collection('bookings').add(booking)

      // 레퍼럴 이벤트 기록(있다면)
      if (payload.metadata?.referralUid) {
        await db.collection('referralEvents').add({
          type: 'booking_paid',
          bookingId: bookingRef.id,
          referralUid: payload.metadata.referralUid,
          sessionId: payload.sessionId || '',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })
      }
    }
    res.json({ ok: true })
  } catch (e) {
    functions.logger.error(e)
    res.status(500).json({ ok: false })
  }
})

// Kakao OAuth code -> Custom Token
export const kakaoOAuth = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).send('')
  try {
    const code = req.method === 'POST' ? req.body.code : req.query.code
    const redirectUri = req.method === 'POST' ? req.body.redirectUri : req.query.redirectUri
    const clientId = process.env.KAKAO_REST_API_KEY || process.env.KAKAO_CLIENT_ID || functions.config().kakao?.rest_api_key || req.body?.clientId || req.query?.clientId
    const clientSecret = process.env.KAKAO_CLIENT_SECRET || functions.config().kakao?.client_secret || req.body?.clientSecret || req.query?.clientSecret
    if (!code || !redirectUri || !clientId) {
      return res.status(400).json({ error: 'missing params' })
    }
    // get access token
    const tokenResp = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code: String(code),
        ...(clientSecret ? { client_secret: clientSecret } : {}),
      }),
    })
    const tokenData = await tokenResp.json()
    if (!tokenResp.ok) return res.status(400).json({ error: 'token_fail', detail: tokenData })
    // get user info
    const userResp = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const userInfo = await userResp.json()
    if (!userResp.ok) return res.status(400).json({ error: 'user_fail', detail: userInfo })
    const kakaoId = userInfo.id
    const profile = {
      email: userInfo.kakao_account?.email || '',
      name: userInfo.kakao_account?.profile?.nickname || 'Kakao User',
      photoURL: userInfo.kakao_account?.profile?.profile_image_url,
    }
    const uid = `kakao:${kakaoId}`
    await admin
      .auth()
      .getUser(uid)
      .catch(async () => {
        await admin.auth().createUser({ uid, displayName: profile.name, photoURL: profile.photoURL })
      })

    // Ensure Firestore user document exists
    const userRef = db.doc(`users/${uid}`)
    const snap = await userRef.get()
    if (!snap.exists) {
      await userRef.set({
        uid,
        email: profile.email || '',
        displayName: profile.name || 'Kakao User',
        photoURL: profile.photoURL || '',
        role: 'user',
        referralCode: (Math.random().toString(36).slice(2, 10)).toUpperCase(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    }

    const token = await admin.auth().createCustomToken(uid)
    res.json({ customToken: token, profile })
  } catch (e) {
    functions.logger.error(e)
    res.status(500).json({ error: 'internal' })
  }
})

// Naver OAuth code -> Custom Token
export const naverOAuth = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).send('')
  try {
    const code = req.method === 'POST' ? req.body.code : req.query.code
    const state = req.method === 'POST' ? req.body.state : req.query.state
    const redirectUri = req.method === 'POST' ? req.body.redirectUri : req.query.redirectUri
    const clientId = process.env.NAVER_CLIENT_ID || functions.config().naver?.client_id || req.body?.clientId || req.query?.clientId
    const clientSecret = process.env.NAVER_CLIENT_SECRET || functions.config().naver?.client_secret || req.body?.clientSecret || req.query?.clientSecret
    if (!code || !state || !redirectUri || !clientId || !clientSecret) {
      return res.status(400).json({ error: 'missing params' })
    }
    // token
    const tokenResp = await fetch(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`,
      { method: 'GET' }
    )
    const tokenData = await tokenResp.json()
    if (!tokenResp.ok) return res.status(400).json({ error: 'token_fail', detail: tokenData })
    // user
    const userResp = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const userJson = await userResp.json()
    if (!userResp.ok || userJson.resultcode !== '00') return res.status(400).json({ error: 'user_fail', detail: userJson })
    const u = userJson.response
    const uid = `naver:${u.id}`
    const profile = { email: u.email, name: u.name || u.nickname || 'Naver User', photoURL: u.profile_image }
    await admin
      .auth()
      .getUser(uid)
      .catch(async () => {
        await admin.auth().createUser({ uid, displayName: profile.name, photoURL: profile.photoURL })
      })

    // Ensure Firestore user document exists
    const userRef = db.doc(`users/${uid}`)
    const snap = await userRef.get()
    if (!snap.exists) {
      await userRef.set({
        uid,
        email: profile.email || '',
        displayName: profile.name || 'Naver User',
        photoURL: profile.photoURL || '',
        role: 'user',
        referralCode: (Math.random().toString(36).slice(2, 10)).toUpperCase(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    }

    const token = await admin.auth().createCustomToken(uid)
    res.json({ customToken: token, profile })
  } catch (e) {
    functions.logger.error(e)
    res.status(500).json({ error: 'internal' })
  }
})

// booking.paid → 1·2차 보상 생성(간단 규칙)
export const onBookingPaid = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data()
    if (booking?.status !== 'paid') return

    // settings의 커미션 규칙이 있다면 불러오기(없으면 기본값)
    let firstPct = 0.05
    let secondPct = 0.02
    try {
      const s = await db.doc('settings/global').get()
      if (s.exists) {
        const cfg = s.data()
        firstPct = cfg?.commission?.firstTierPct ?? firstPct
        secondPct = cfg?.commission?.secondTierPct ?? secondPct
      }
    } catch {}

    // booking.userId의 추천자/추천자의 추천자 조회
    const userSnap = await db.doc(`users/${booking.userId}`).get()
    const user = userSnap.data() || {}
    const ref1Code = user.referredBy
    if (!ref1Code) return

    // 1차 추천자 uid
    const ref1Query = await db.collection('users').where('referralCode', '==', ref1Code).limit(1).get()
    const ref1Uid = ref1Query.empty ? null : ref1Query.docs[0].id
    if (!ref1Uid) return

    // 2차 추천자 코드
    const ref1Doc = await db.doc(`users/${ref1Uid}`).get()
    const ref2Code = ref1Doc.exists ? (ref1Doc.data() || {}).referredBy : null
    let ref2Uid = null
    if (ref2Code) {
      const ref2Query = await db.collection('users').where('referralCode', '==', ref2Code).limit(1).get()
      ref2Uid = ref2Query.empty ? null : ref2Query.docs[0].id
    }

    const firstAmount = Math.floor((booking.amount || 0) * firstPct)
    const secondAmount = ref2Uid ? Math.floor((booking.amount || 0) * secondPct) : 0

    const batch = db.batch()
    // 1차 보상
    if (firstAmount > 0) {
      const r1 = db.collection('referralRewards').doc()
      batch.set(r1, {
        userId: ref1Uid,
        amount: firstAmount,
        source: 'referral',
        status: 'pending',
        description: '1차 추천 보상',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    }
    // 2차 보상
    if (secondAmount > 0 && ref2Uid) {
      const r2 = db.collection('referralRewards').doc()
      batch.set(r2, {
        userId: ref2Uid,
        amount: secondAmount,
        source: 'referral',
        status: 'pending',
        description: '2차 추천 보상',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    }
    await batch.commit()
  })


