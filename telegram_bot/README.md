# 텔레그램 자동 메시지 봇

NLJMCOIN 그룹의 Airdrop Application 토픽에 자동으로 메시지를 전송하는 봇입니다.

## 🚀 주요 기능

- ✅ 24시간 1분 쿨타임으로 중복 전송 방지
- ✅ 주말(토요일, 일요일) 자동 휴식
- ✅ 자동 로그인 및 세션 관리
- ✅ 상세한 로그 기록
- ✅ 에러 처리 및 복구
- ✅ Windows 작업 스케줄러 연동

## 📁 파일 구조

```
telegram_bot/
├── userbot_sender.py              # 기존 봇 (기본)
├── userbot_sender_improved.py     # 개선된 봇 (권장)
├── run_telegram_bot.bat           # 기존 실행 파일
├── run_telegram_bot_improved.bat  # 개선된 실행 파일
├── run_telegram_bot.vbs           # VBS 실행 파일
├── run_telegram_bot.ps1           # PowerShell 실행 파일
├── setup_scheduler.bat            # 스케줄러 설정
├── my_account.session             # 텔레그램 세션 파일
├── last_run.txt                   # 마지막 실행 시간 기록
├── logs/                          # 로그 파일 저장소
└── README.md                      # 이 파일
```

## 🛠️ 설치 및 설정

### 1. Python 환경 확인
```bash
python --version
```

### 2. 필요한 패키지 설치
```bash
pip install telethon
```

### 3. 첫 실행 및 로그인
```bash
python userbot_sender_improved.py
```

첫 실행 시 다음 정보를 입력해야 합니다:
- 📞 전화번호 (예: +821093706570)
- 📲 텔레그램 인증 코드
- 🔐 2단계 인증 비밀번호 (있는 경우)

## 🚀 실행 방법

### 수동 실행
```bash
# 개선된 봇 실행 (권장)
python userbot_sender_improved.py

# 또는 배치 파일 사용
run_telegram_bot_improved.bat
```

### 자동 실행 설정

#### 방법 1: Windows 작업 스케줄러 (권장)
1. `setup_scheduler.bat`를 **관리자 권한**으로 실행
2. 시스템 시작 시 자동 실행됨

#### 방법 2: 시작 프로그램 폴더
1. `run_telegram_bot_improved.bat`의 바로가기를 생성
2. `Win + R` → `shell:startup` 입력
3. 바로가기를 시작 프로그램 폴더에 복사

## ⚙️ 설정 변경

`userbot_sender_improved.py` 파일에서 다음 설정을 변경할 수 있습니다:

```python
# 보낼 대상 및 조건 설정
GROUP_NAME = 'NLJMCOIN'                    # 그룹 이름
TOPIC_NAME = 'Airdrop Application'         # 토픽 이름
MESSAGE_TO_SEND = '/airdrop 0x5a9fa46435ddfc2f1b047da343689a91c68fd3bb'  # 전송할 메시지
COOLDOWN_MINUTES = 24 * 60 + 1             # 쿨타임 (분)
```

## 📊 로그 확인

로그 파일은 `logs/` 폴더에 날짜별로 저장됩니다:
```
logs/
├── telegram_bot_20250804.log
├── telegram_bot_20250805.log
└── ...
```

## 🔧 문제 해결

### VBS 스크립트 오류
- **증상**: "파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다"
- **해결**: `run_telegram_bot_improved.bat` 사용

### 로그인 실패
- **증상**: "새로운 계정으로 로그인이 필요합니다"
- **해결**: 전화번호, 인증코드, 비밀번호를 정확히 입력

### 토픽을 찾을 수 없음
- **증상**: "토픽 'Airdrop Application'을(를) 찾을 수 없습니다"
- **해결**: 그룹 이름과 토픽 이름을 확인하고 수정

### Python 오류
- **증상**: "python은 내부 또는 외부 명령이 아닙니다"
- **해결**: Python을 설치하고 PATH에 추가

## 📋 작업 스케줄러 관리

### 작업 확인
```bash
schtasks /query /tn "TelegramAutoMessageBot"
```

### 작업 삭제
```bash
schtasks /delete /tn "TelegramAutoMessageBot" /f
```

### 작업 수정
```bash
# 기존 작업 삭제 후 다시 등록
setup_scheduler.bat
```

## 🔒 보안 주의사항

- `my_account.session` 파일은 개인 인증 정보를 포함하므로 안전하게 보관
- API 키와 해시는 공개하지 마세요
- 정기적으로 세션 파일을 백업하세요

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. 로그 파일 확인 (`logs/` 폴더)
2. Python 및 telethon 패키지 버전 확인
3. 인터넷 연결 상태 확인
4. 텔레그램 계정 상태 확인

---

**⚠️ 주의**: 이 봇은 개인적인 용도로만 사용하시고, 텔레그램의 이용약관을 준수해주세요. 