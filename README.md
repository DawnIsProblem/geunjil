<p align="center">
  <img width="250" height="250" alt="GeunJilGeunJil_NO_Background" src="https://github.com/user-attachments/assets/bb8e25de-e668-41b9-b5ee-591ffeaa1575" />
</p>

## 서비스 소개
근질근질 앱은 위치 & 시간 기반 개인화 운동 챌린지 서비스입니다.
계획적인 운동을 위해 운동할 장소, 운동 시간, 범위를 설정하고 실시간 위치 추적으로 검증하여 챌린지 성공 여부를 판단해줍니다. 누적된 챌린지의 성공률을 기반으로 사용자의 운동 의지에 동기부여를 돕습니다.

## 선정 이유
최근 가볍게라도 운동을 시작하려는 사람들이 늘어나면서, **“작게라도 꾸준히” 운동하는 것이 하나의 트렌드**가 되고 있습니다.
    
그러나 많은 사용자들이 스스로 세운 목표를 끝까지 지키지 못하고 **중도에 포기**하는 경우가 많습니다.

이에 사용자가 **직접 선택한 시간과 장소에서 목표를 수행하고**, 앱이 이를 자동으로 인증해줌으로써, **꾸준히 실천한 기록을 명확히 남기고 성취감을 느낄 수 있도록 돕고자** 본 서비스를 기획하게 되었습니다.

## 주요 기능

- 자체 회원가입 및 로그인

![자체 회원가입 및 로그인 x4](https://github.com/user-attachments/assets/a6008dca-ac12-487d-84e0-f1e37920f216)

- 카카오 소셜 로그인

![카카오 소셜 로그인 x4](https://github.com/user-attachments/assets/9c7fd4b1-a63d-4606-a73e-9c5b20654f31)

- 챌린지 생성

![챌린지 생성 x4](https://github.com/user-attachments/assets/5d1f87b8-8966-48ec-85a1-094b909ba120)

- 실시간 추적 현황

![실시간 챌린지 추적 화면 x4](https://github.com/user-attachments/assets/8a9ff18a-9be0-441c-a0d6-4775385ea615)

- 챌린지 10분, 5분 전 알림
<img width="436" height="786" alt="스크린샷 2025-08-09 오후 8 50 07" src="https://github.com/user-attachments/assets/8570290c-5120-4e3b-9557-666aceac2554" />


## 기술 스택
### 백엔드 (Spring Boot)
| 구분               | 기술                                       |
| ---------------- | ---------------------------------------- |
| **언어 & 프레임워크**   | Java 21, Spring Boot 3.5.3               |
| **빌드 & 의존성 관리**  | Gradle                                   |
| **보안 / 인증**      | Spring Security, JWT   |
| **데이터베이스**       | MySQL 8.0, Redis, Spring Data JPA        |
| **API 문서화**      | Springdoc OpenAPI (Swagger UI)           |
| **푸시 알림**        | Firebase Admin SDK                       |
| **유틸리티**         | Lombok                                   |
| **테스트**          | JUnit 5, Spring Boot Test, Mockito       |


### 프론트엔드 (React Native)
| 구분              | 기술                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------- |
| **언어 & 프레임워크**  | React Native 0.80.2, React 19, TypeScript                                                    |
| **상태 관리**       | Zustand                                                                                      |
| **네비게이션**       | React Navigation (native, stack)                                                             |
| **네트워킹**        | Axios                                                                                        |
| **지도 & 위치 서비스** | react-native-maps, react-native-geolocation-service                                          |
| **소셜 로그인**      | @react-native-google-signin/google-signin, @react-native-seoul/kakao-login                   |
| **푸시 알림**       | @react-native-firebase/app, @react-native-firebase/messaging                                 |
| **UI & 스타일링**   | styled-components, react-native-linear-gradient, react-native-vector-icons, react-native-svg |
| **차트 / 시각화**    | react-native-chart-kit, react-native-circular-progress                                       |
| **기기 기능**       | react-native-image-picker, react-native-webview, react-native-datetimepicker                 |
| **환경 변수 관리**    | react-native-dotenv                                                                          |
| **안전 영역 처리**    | react-native-safe-area-context                                                               |
| **제스처 처리**      | react-native-gesture-handler, react-native-screens                                           |
| **개발 편의성**      | ESLint, Prettier, Babel, Jest, patch-package                                                 |

## 회고
웹 중심의 개발과 학습을 주로 해왔지만, 이번에는 앱 개발에도 도전해보고자 했습니다.
KDT 과정에서 어깨너머로 배웠던 디자인과 워크플로우부터 백엔드, 프론트엔드 개발까지 직접 시도해 보았습니다.
간단하다고 생각했던 서비스를 정의하고 구현했지만, 그 과정에서 제 지식과 실력이 여전히 부족하다는 것을 깨달았습니다.

특히 소셜 로그인만 해도 리다이렉트 방식과 SDK 방식이 어떤 상황에서 필요한지를 새롭게 배웠고,
프론트엔드와 백엔드 간의 의존성, 버전 충돌, 그리고 소통 방식에서 많은 트러블을 경험했습니다.
이를 통해 개발은 혼자 하는 것이 아니라 협업이 핵심이며, 원활한 소통과 피드백이 얼마나 중요한지 실감했습니다.

지도 관련 API도 웹 개발 때는 Kakao Map이나 Naver Map을 주로 사용했지만, 앱 개발에서는 여러 제한 사항이 있었기에
Google에서 제공하는 기능들을 적극적으로 활용했습니다.
이 경험은 향후 웹과 앱 중 어떤 방향으로 개발을 진행할지 결정할 때 유용한 참고 자료가 될 것입니다.

아쉽게도 이번에는 구글 소셜 로그인과 카메라 기능 허용 및 워터마크 합성 기능 구현에 실패했지만,
추후 다시 도전하여 반영할 계획입니다.
다음 프로젝트에서는 더 재미있고 완성도 높은 개발에 도전하고자 합니다.
