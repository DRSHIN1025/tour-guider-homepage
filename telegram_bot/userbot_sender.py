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
last_run_file = os.path.join(script_dir, 'last_run.txt') # 파일 이름 변경

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
    print(f"실행 시간 기록 완료: {datetime.now()}")

async def main():
    """메인 로직을 실행합니다."""
    print(f"--- {datetime.now()} | 스크립트 실행 ---")
    
    # 요일 확인 (월요일=0, 토요일=5, 일요일=6)
    today_weekday = datetime.now().weekday()
    if today_weekday >= 5: # 토요일(5) 또는 일요일(6)인 경우
        print(f"오늘은 주말이므로 작업을 건너뜁니다. (요일 인덱스: {today_weekday})")
        return

    last_run = get_last_run_time()
    
    if last_run and (datetime.now() - last_run) < timedelta(minutes=COOLDOWN_MINUTES):
        print(f"아직 쿨타임이 지나지 않았습니다. (마지막 실행: {last_run})")
        print("작업을 실행하지 않고 종료합니다.")
        return

    print("쿨타임 통과. 텔레그램에 연결합니다...")
    await client.connect()
    if not await client.is_user_authorized():
        print("오류: 로그인이 필요합니다. run_telegram_bot.bat를 수동으로 실행하여 다시 로그인해주세요.")
        await client.disconnect()
        return
        
    try:
        print("메시지를 보낼 그룹과 토픽을 찾습니다...")
        group_entity = await client.get_entity(GROUP_NAME)
        
        # telethon.tl.functions.channels.GetForumTopicsRequest 대신,
        # 더 간단하고 안정적인 get_dialogs()를 사용하여 토픽을 찾을 수 있습니다.
        # 하지만 현재 로직이 작동하므로 유지합니다.
        result = await client(GetForumTopicsRequest(channel=group_entity, offset_date=None, offset_id=0, offset_topic=0, limit=100))
        topic_id = next((t.id for t in result.topics if t.title == TOPIC_NAME), None)
        
        if not topic_id:
            print(f"오류: 토픽 '{TOPIC_NAME}'을(를) 찾을 수 없습니다.")
            return

        print(f"토픽 '{TOPIC_NAME}' (ID: {topic_id}) 확인. 메시지를 전송합니다...")
        await client.send_message(group_entity, message=MESSAGE_TO_SEND, reply_to=topic_id)
        
        print("메시지 전송 완료. 상대방 응답과 관계없이 성공으로 간주합니다.")
        set_last_run_time() # 메시지를 보내자마자 성공으로 기록

    except Exception as e:
        print(f"오류 발생: {e}")
    finally:
        if client.is_connected():
            await client.disconnect()
            print("클라이언트 연결 해제.")
        print(f"--- 스크립트 종료 ---")

if __name__ == "__main__":
    asyncio.run(main()) 