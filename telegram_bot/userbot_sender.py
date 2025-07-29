import asyncio
import os
from datetime import datetime, timedelta
from telethon import TelegramClient
from telethon.tl.functions.channels import GetForumTopicsRequest

# --- 설정 (수정할 필요 없음) ---
API_ID = 26610847
API_HASH = 'a98c5c2b5432c93c1d1e605fb11d629a'
SESSION_NAME = 'my_account'

# --- 스크립트 자신의 위치를 기준으로 경로 설정 ---
script_dir = os.path.dirname(os.path.abspath(__file__))
session_path = os.path.join(script_dir, SESSION_NAME)
last_run_file = os.path.join(script_dir, 'last_run.txt')

# --- 보낼 대상 및 조건 설정 ---
GROUP_NAME = 'NLJMCOIN'
TOPIC_NAME = 'Airdrop Application'
MESSAGE_TO_SEND = '/airdrop 0x5a9fa46435ddfc2f1b047da343689a91c68fd3bb'
COOLDOWN_MINUTES = 24 * 60 + 1 # 24시간 1분

# --- 코드 ---
client = TelegramClient(session_path, API_ID, API_HASH)

def get_last_run_time():
    """마지막 실행 시간을 파일에서 읽어옵니다."""
    try:
        with open(last_run_file, 'r') as f:
            return datetime.fromisoformat(f.read().strip())
    except FileNotFoundError:
        return None

def set_last_run_time():
    """현재 시간을 마지막 실행 시간으로 파일에 기록합니다."""
    with open(last_run_file, 'w') as f:
        f.write(datetime.now().isoformat())
    print(f"✅ 실행 시간 기록 완료: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def get_weekday_name(weekday):
    """요일 번호를 한글 요일명으로 변환합니다."""
    days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
    return days[weekday]

async def main():
    """메인 로직을 실행합니다."""
    print(f"🤖 텔레그램 자동 메시지 봇 시작")
    print(f"📅 현재 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ({get_weekday_name(datetime.now().weekday())})")
    print("-" * 50)
    
    # 요일 확인 (월요일=0, 토요일=5, 일요일=6)
    today_weekday = datetime.now().weekday()
    if today_weekday >= 5: # 토요일(5) 또는 일요일(6)인 경우
        print(f"🏖️  오늘은 {get_weekday_name(today_weekday)}이므로 작업을 건너뜁니다.")
        print("평일에 다시 만나요! 👋")
        return

    last_run = get_last_run_time()
    
    if last_run is None:
        print("📝 마지막 실행 기록이 없습니다. 첫 실행을 시작합니다!")
    else:
        time_passed = datetime.now() - last_run
        hours_passed = time_passed.total_seconds() / 3600
        print(f"⏰ 마지막 실행: {last_run.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"⌛ 경과 시간: {hours_passed:.1f}시간")
        
        if time_passed < timedelta(minutes=COOLDOWN_MINUTES):
            remaining_time = timedelta(minutes=COOLDOWN_MINUTES) - time_passed
            remaining_hours = remaining_time.total_seconds() / 3600
            print(f"⏳ 아직 쿨타임이 지나지 않았습니다. ({remaining_hours:.1f}시간 남음)")
            print("다음에 PC를 켜실 때 다시 확인하겠습니다. 😊")
            return

    print("✅ 쿨타임 통과! 텔레그램에 연결합니다...")
    await client.connect()
    if not await client.is_user_authorized():
        print("❌ 새로운 계정으로 로그인이 필요합니다.")
        print("📱 전화번호, 인증코드, 비밀번호를 차례로 입력해주세요.")
        
        # 대화형 로그인 시작
        await client.start(
            phone=lambda: input('📞 전화번호를 입력하세요 (예: +821093706570): '),
            code_callback=lambda: input('📲 텔레그램으로 받은 코드를 입력하세요: '),
            password=lambda: input('🔐 2단계 인증 비밀번호를 입력하세요 (없으면 엔터): ') or None
        )
        print("✅ 로그인 성공!")
        
    try:
        print("🔍 메시지를 보낼 그룹과 토픽을 찾습니다...")
        group_entity = await client.get_entity(GROUP_NAME)
        
        result = await client(GetForumTopicsRequest(channel=group_entity, offset_date=None, offset_id=0, offset_topic=0, limit=100))
        topic_id = next((t.id for t in result.topics if t.title == TOPIC_NAME), None)
        
        if not topic_id:
            print(f"❌ 오류: 토픽 '{TOPIC_NAME}'을(를) 찾을 수 없습니다.")
            return

        print(f"📤 토픽 '{TOPIC_NAME}' 확인. 메시지를 전송합니다...")
        await client.send_message(group_entity, message=MESSAGE_TO_SEND, reply_to=topic_id)
        
        print("🎉 메시지 전송 완료!")
        set_last_run_time()
        print("다음 실행은 24시간 1분 후에 가능합니다.")

    except Exception as e:
        print(f"❌ 오류 발생: {e}")
    finally:
        if client.is_connected():
            await client.disconnect()
        print("🔌 클라이언트 연결 해제.")
        print("=" * 50)

if __name__ == "__main__":
    asyncio.run(main()) 