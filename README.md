# 코잉(Coing): 실시간 코인 데이터 분석 및 북마크 대시보드 서비스

2025 프로그래머스 백엔드 데브코스 4기 5회차 9팀 시고르백구의 [프로젝트](https://github.com/prgrms-be-devcourse/NBE4-5-3-Team09)입니다.

## 👥 Team Introduction

| Name   | GitHub                                    | Role                                                                                          |
| ------ | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| 이화영 | [2hwayoung](https://github.com/2hwayoung) | 팀 리딩, 프로젝트 관리, Upbit WebSocket 연동, 호가 정보 조회, 환경변수 관리, GitHub Action CI |
| 김하연 | [xaxeon](https://github.com/xaxeon)       | 글로벌 예외 처리, 마켓 목록 조회 및 코인 대시보드, 북마크 추가/삭제, 소셜 로그인              |
| 이승민 | [min429](https://github.com/min429)       | 웹소켓 클라이언트(프론트), 현재가 조회, 푸시 알림, Swagger 커스텀, GitHub Action CD           |
| 장무영 | [wkdan](https://github.com/wkdan)         | 사용자 인증, 캔들 차트 조회, 채팅 기능, 관련 뉴스 기능, 관리자 권한 및 Security 설정          |

## 📊 Project Overview

### 프로젝트 이름: **코잉(Coing)**

_💡 실시간 코인 데이터 분석 및 북마크 대시보드 서비스_

### 운영 사이트: https://coing-ashen.vercel.app

이 프로젝트의 목표는 실시간 코인 데이터를 기반으로, 개인화된 투자 인사이트를 제공하는 웹 서비스 코잉(Coing)을 구축하는 것입니다.
업비트 OpenAPI 및 WebSocket을 활용해 다양한 암호화폐 관련 데이터를 실시간으로 수집하고,
사용자가 관심 있는 코인을 북마크하여 개인화된 대시보드를 구성할 수 있도록 하여 투자자들의 편의성과 효율적인 의사결정을 돕는 것이 목적입니다.

단순한 시세 제공이 아닌, 호가, 체결, 캔들, 기술적 지표 등의 다양한 데이터를 수집하여 투자 인사이트를 제공합니다.
기존의 CryptoQuant, CoinMarketCap, Coin360 등 다양한 서비스를 벤치마킹했으며, 시각화 + 개인화 + 실시간성에 중점을 두었습니다.

<img width="1566" alt="image" src="https://github.com/user-attachments/assets/69fbc43f-aaa6-4eaf-b051-b89396ecd3bc" />

---

## 최소 요구사항 (1차 MVP)

프로젝트의 기본 기능은 다음과 같습니다:

1. **사용자 인증**
   - 이메일 인증 기반 회원가입, 로그인/로그아웃
2. **코인 대시보드**
   - 전체 코인 목록 조회
   - 종목/마켓 단위 시세, 체결, 호가, 다양한 캔들 차트(초/분/일/주/월/년 단위)
   - 기술적 지표 추가(Spread, Imbalance, Liquidity Depth 등)
3. **북마크 기능**
   - 관심 있는 코인 북마크 등록/삭제
   - 북마크한 종목/마켓 단위 현재가, 체결가 및 호가 정보 조회
4. **실시간 데이터 처리**
   - WebSocket 기반 시세/체결/호가 실시간 업데이트
   - REST API 기반 캔들 데이터 제공(최소 1초 간격 Polling)

## 추가 기능 및 Java -> Kotlin 전환 (2차 MVP)

2차 MVP에서는 기존 Java 기반 백엔드 코드를 전면적으로 Kotlin으로 마이그레이션하여 유지보수성과 생산성을 향상시켰습니다.

- Kotlin DSL 기반 Gradle 빌드 환경 구성
- data class, sealed class, extension, coroutines 등 Kotlin 특화 문법 도입
- Mockito 대신 mockito-kotlin을 활용한 Kotlin 친화 테스트 환경 구축
- WebSocket/REST API 흐름, 서비스/도메인 계층을 Kotlin스럽게 리팩토링

추가적으로 구현된 기능들은 다음과 같습니다:

- **인증/관리 기능**
  - 소셜 로그인 (카카오 연동)
  - 관리자 기능: 채팅 신고 관리
- **투자 인사이트 기능**
  - 특정 조건(예: 가격 급등락, 거래량 급증 등) 설정 시 푸시 알림 전송
  - Naver 검색 API 기반 실시간 뉴스 연동 (코인 키워드 기반)
- **커뮤니티 기능**
  - WebSocket 기반 종목 단위 실시간 채팅 기능

---

#### 📎 관련 문서

- [코잉(Coing) 기획서](<https://github.com/2hwayoung/coing/wiki/01-%EC%BD%94%EC%9E%89(Coing)-%EA%B8%B0%ED%9A%8D%EC%84%9C>)
- [1차 MVP 기획서](<https://github.com/2hwayoung/coing/wiki/02-1%EC%B0%A8-MVP-%EA%B8%B0%ED%9A%8D%EC%84%9C(Java)>)
- [2차 MVP 기획서](<https://github.com/2hwayoung/coing/wiki/03-2%EC%B0%A8-MVP-%EA%B8%B0%ED%9A%8D%EC%84%9C(Kotlin)>)
- [와이어 프레임](docs/wireframes/) ([Creatie Link](https://creatie.ai/goto/IDpBmt9v?page_id=M&file=153513435570624))

## 🛠️ Technology Stack

#### 🎨 Frontend

<div align=""> 
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
</div>

#### 🛠 Backend

<div align=""> 
  <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white"/>
  <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Apache%20Tomcat-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=white"/>
</div>

#### 🗄 Database

<div align=""> 
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
</div>

#### 🚀 Deployment & Infra

<div align=""> 
  <img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black"/>
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"/>
</div>

## 🚀 System Architecture & Deployment

### Overview

![image](https://github.com/user-attachments/assets/1e110bb0-93fe-4577-ba1a-febb5f0355d1)

> 전체 요청 흐름 및 배포 자동화 파이프라인을 도식화한 구성도입니다.

### Deployment Structure

서비스는 프론트엔드(Next.js)와 백엔드(Spring Boot with Kotlin)로 구성되며,
각각 Vercel과 AWS EC2 + Docker 기반으로 배포됩니다.

- Frontend: Vercel을 통해 자동 배포

- Backend: GitHub Actions → Docker 이미지 생성 → ECR 업로드 → EC2에서 Pull 및 실행

- Database: Amazon RDS (MySQL)

- Infra Tooling: Doppler(환경 변수), Nginx(Proxy), Docker Compose, GitHub Actions

### CI/CD Process (GitHub Actions 기반 자동화)

1. GitHub Push

- main 브랜치에 푸시 시 자동으로 워크플로우 실행

2. 환경 변수 관리

- Doppler CLI로 .env 파일 자동 다운로드

3. 프론트엔드

- schema 변환, 타입 생성 → Vercel에 자동 배포

4. 백엔드

- 테스트 → Docker 이미지 빌드 → ECR에 Push → EC2에서 Pull 후 컨테이너 실행

> 🔗 자세한 자동화 및 배포 프로세스는 아래 GitHub Wiki에서 확인할 수 있습니다
> 👉 [배포 및 자동화 문서 바로가기](https://github.com/2hwayoung/coing/wiki/12-%EB%B0%B0%ED%8F%AC-%EB%B0%8F-%EC%9E%90%EB%8F%99%ED%99%94)

## 🛠️ 개발 환경 설정 (Development Setup)

**1️⃣ Clone the Repository**

```bash
git clone https://github.com/2hwayoung/coing.git
```

**2️⃣ Environment Variables (.env) Setup**
✅ Using Doppler (Recommended)

> Doppler는 .env 환경 변수 파일을 안전하게 관리해주는 도구입니다.

```bash
# Install Doppler CLI
brew install dopplerhq/cli/doppler

# Login & Setup
doppler login
doppler setup

# Run with environment loaded
npm run doppler
```

**3️⃣ Run Database (MySQL via Docker Compose)**

```bash
# Start MySQL container with Docker Compose
docker-compose up -d

# Monitor logs (logs are mapped locally)
tail -f ./mysql_logs/general.log

# Stop Containers
docker-compose down

```

**4️⃣ Run Backend (Spring Boot + Kotlin)**

```bash
cd backend

./gradlew bootRun
```

- Port: 8080

- Swagger Docs: http://localhost:8080/swagger-ui/index.html

**5️⃣ Run Frontend (Next.js)**

```bash
cd frontend

npm install  # Install dependencies (only needed once)
npm run dev  # Start development server

# Use OpenAPI to generate TypeScript types for the backend API
npm run codegen # Generate openapi typeScript definitions
npm run codegen:watch # Watch for API changes and regenerate types automatically

```

- Access: http://localhost:3000

## 📄 Related Docs

자세한 시스템 아키텍처, API 명세서, ERD 및 프로젝트 구조 등은 [위키](https://github.com/2hwayoung/coing/wiki)를 참고해주시기 바랍니다.

- [📃 API∙Websocket 명세서](https://github.com/2hwayoung/coing/wiki/08-API%E2%88%99Websocket-%EB%AA%85%EC%84%B8)
- [📘 ERD 문서](https://github.com/2hwayoung/coing/wiki/07-ERD)
- [🛠️기술 스택 문서](https://github.com/2hwayoung/coing/wiki/06-%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D)
- [🛠️ TroubleShootings](https://github.com/2hwayoung/coing/wiki/15-TroubleShootings)
- [📑 ADR](<https://github.com/2hwayoung/coing/wiki/09-%EC%9D%98%EC%82%AC%EA%B2%B0%EC%A0%95%EB%AC%B8%EC%84%9C(ADR)>)

---
