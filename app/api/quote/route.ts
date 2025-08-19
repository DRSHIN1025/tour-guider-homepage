import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // TODO: 유효성 검사/저장/이메일 발송 등 비즈니스 로직
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
  }
}

