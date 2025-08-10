package com.geunjil.geunjil.domain.user.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import com.geunjil.geunjil.domain.user.dto.response.GoogleInfoResponseDto;
import com.geunjil.geunjil.domain.user.dto.response.KakaoUserInfoResponseDto;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.enums.SocialLoginType;
import com.geunjil.geunjil.domain.user.oauth.SocialOauth;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class OauthService {

    private final MyPageRepository mypageRepository;
    private final UserRepository userRepository;
    private final List<SocialOauth> socialOauthList;
    private static final Logger logger = LoggerFactory.getLogger(OauthService.class);

    // 소셜 로그인 요청 URL을 반환하는 메서드
    public String request(SocialLoginType socialLoginType) {
        SocialOauth socialOauth = this.findSocialOauthByType(socialLoginType);
        return socialOauth.getOauthRedirectURL();
    }

    // 인증 코드로 엑세스 토큰을 요청하는 메서드
    public String requestAccessToken(SocialLoginType socialLoginType, String code) {
        SocialOauth socialOauth = this.findSocialOauthByType(socialLoginType);
        return socialOauth.requestAccessToken(code);
    }

    // JSON에서 엑세스 토큰만 추출하는 메서드
    private String extractAccessTokenFromJson(String accessTokenJson) {
        // JSON을 파싱하여 엑세스 토큰만 추출
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(accessTokenJson);
            // 여기에서 필요한 토큰만 반환
            return jsonNode.get("access_token") != null ? jsonNode.get("access_token").asText() : null;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    // 엑세스 토큰을 사용하여 사용자 정보를 가져오고, 시용자 정보가있으면 저장하는 메서드
    public User requestAccessTokenAndSaveUser(SocialLoginType socialLoginType, String code) {
        // 1. 엑세스 토큰을 포함한 JSON 응답을 요청
        String accessTokenJson = this.requestAccessToken(socialLoginType, code);

        // 2. JSON에서 엑세스 토큰만 추출
        String accessToken = extractAccessTokenFromJson(accessTokenJson);

        if (accessToken == null) { // 엑세스 토큰이 없을 시 예외처리
            throw new RuntimeException("엑세스 토큰 추출 실패!");
        }

        // 3. 엑세스 토큰을 사용해 사용자 정보 요청
        String userInfo = getUserInfo(socialLoginType, accessToken);

        // 4. 사용자 정보를 파싱하여 USER 객체 생성
        User user = parseUserInfo(userInfo, socialLoginType, accessToken);

        // 5. 기존 사용자 확인 후 처리
        Optional<User> existingUser = userRepository.findBySocialId(user.getSocialId());

        if (existingUser.isPresent()) { // 이미 존재하는 사용자라면 로그인 처리
            User existing = existingUser.get();
            existing.setUpdatedAt(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
            return userRepository.save(existing);
        } else { // 처음 로그인 하는 사용자라면
            user.setCreateAt(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
            User saved = userRepository.save(user);

            mypageRepository.save(Mypage.builder()
                    .user(saved)
                    .totalChallenge(0)
                    .successChallenge(0)
                    .stopedChallenge(0)
                    .failChallenge(0)
                    .achievement(0f)
                    .build());

            return saved;
        }
    }

    // 실제 소셜 로그인 API에서 사용자 정보를 받아오는 메서드 (GOOGLE, KAKAO)
    private String getUserInfo(SocialLoginType socialLoginType, String accessToken) {
        return switch (socialLoginType) {
            case GOOGLE -> googleApiCall(accessToken);
            case KAKAO -> kakaoApiCall(accessToken);
            default -> throw new IllegalArgumentException("지원되지 않는 소셜 로그인 타입입니다.");
        };
    }

    // 구글 API 호출 시 응답 상태 코드와 메시지 출력
    public String googleApiCall(String accessToken) {
        try {
            // accessToken을 URL 인코딩
            String encodedAccessToken = URLEncoder.encode(accessToken, "UTF-8");
            logger.debug("Encoded access token: {}", encodedAccessToken);

            String url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + encodedAccessToken;
            logger.debug("Google API URL: {}", url);

            URL obj = new URL(url);

            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");

            int responseCode = con.getResponseCode();
            logger.info("Google API response code: {}", responseCode);

            if (responseCode == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                StringBuffer response = new StringBuffer();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                logger.info("Successfully received response from Google API.");
                return response.toString();
            } else {
                // 실패 시 에러 메시지와 상태 코드 출력
                BufferedReader in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
                String inputLine;
                StringBuffer errorResponse = new StringBuffer();
                while ((inputLine = in.readLine()) != null) {
                    errorResponse.append(inputLine);
                }
                in.close();
                logger.error("Google API call failed with response code: {}, error: {}", responseCode, errorResponse.toString());
                throw new RuntimeException("Google API에서 사용자 정보를 가져오는 데 실패했습니다. 응답 코드: " + responseCode + ", 에러 메시지: " + errorResponse.toString());
            }
        } catch (IOException e) {
            logger.error("Google API 호출 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("Google API 호출 중 오류 발생", e);
        }
    }

    // 카카오 API 호출 시 응답 상태 코드와 메시지 출력
    private String kakaoApiCall(String accessToken) {
        try {
            String url = "https://kapi.kakao.com/v2/user/me";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("GET");
            // Kakao의 경우 Authorization 헤더에 "Bearer" 토큰을 설정해야 합니다.
            con.setRequestProperty("Authorization", "Bearer " + accessToken);

            int responseCode = con.getResponseCode();
            if (responseCode == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                StringBuffer response = new StringBuffer();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                return response.toString();
            } else {
                throw new RuntimeException("Kakao API에서 사용자 정보를 가져오는 데 실패했습니다. 응답 코드: " + responseCode); // 오류 메시지 한국어로 수정
            }
        } catch (IOException e) {
            throw new RuntimeException("Kakao API 호출 중 오류 발생", e); // 오류 메시지 한국어로 수정
        }
    }

    // 사용자 정보를 파싱하여 User 객체 생성
    private User parseUserInfo(String userInfo, SocialLoginType socialLoginType, String accessToken) {
        JsonObject jsonObject = JsonParser.parseString(userInfo).getAsJsonObject();

        // socialId와 name을 소셜 로그인 타입별로 분리
        String socialId = "";
        String name = "";
        String email = "";

        if (socialLoginType == SocialLoginType.GOOGLE) {
            socialId = jsonObject.get("sub").getAsString();
            name = jsonObject.get("name").getAsString();
            email = jsonObject.get("email").getAsString();  // Google email
        } else if (socialLoginType == SocialLoginType.KAKAO) {
            socialId = jsonObject.get("id").getAsString();
            name = jsonObject.getAsJsonObject("properties").get("nickname").getAsString();
            email = jsonObject.getAsJsonObject("kakao_account").get("email").getAsString();
        }

        // User 객체에 정보 세팅
        User user = new User();
        user.setSocialId(socialId); // 소셜 ID 설정
        user.setName(name); // 사용자의 이름 설정
        user.setEmail(email);
        user.setProvider(socialLoginType); // 로그인 제공자 설정
        return user;
    }

    // 소셜 로그인 타입에 맞는 OAuth 객체를 찾는 메서드
    private SocialOauth findSocialOauthByType(SocialLoginType socialLoginType) {
        return socialOauthList.stream()
                .filter(x -> x.type() == socialLoginType)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("알 수 없는 SocialLoginType 입니다."));
    }

    public User loginWithKakaoAccessToken(String kakaoAccessToken) {
        KakaoUserInfoResponseDto kakaoUserInfo = getKakaoUserInfo(kakaoAccessToken);

        // 2. DB에 해당 socialId로 유저 존재 여부 확인
        Optional<User> userOpt = userRepository.findBySocialId(kakaoUserInfo.getId());
        User user;
        if (userOpt.isPresent()) {
            // 이미 있으면 업데이트 (필요하다면)
            user = userOpt.get();
            user.setName(kakaoUserInfo.getNickname());
            user.setEmail(kakaoUserInfo.getEmail());
            userRepository.save(user);

            // ✅ 이미 회원이라면 Mypage가 있는지 체크 후, 없으면 생성
            if (mypageRepository.findByUser(user) == null) {
                mypageRepository.save(Mypage.builder()
                        .user(user)
                        .totalChallenge(0)
                        .successChallenge(0)
                        .stopedChallenge(0)
                        .failChallenge(0)
                        .achievement(0f)
                        .build());
            }
        } else {
            // 처음이면 새로 생성
            user = new User();
            user.setSocialId(kakaoUserInfo.getId());
            user.setName(kakaoUserInfo.getNickname());
            user.setEmail(kakaoUserInfo.getEmail());
            user.setLoginId(kakaoUserInfo.getEmail());
            user.setProvider(SocialLoginType.KAKAO);
            userRepository.save(user);

            // ✅ 신규 회원이면 무조건 Mypage 생성
            mypageRepository.save(Mypage.builder()
                    .user(user)
                    .totalChallenge(0)
                    .successChallenge(0)
                    .stopedChallenge(0)
                    .failChallenge(0)
                    .achievement(0f)
                    .build());
        }

        return user;
    }

    // 카카오 API 호출 함수
    private KakaoUserInfoResponseDto getKakaoUserInfo(String kakaoAccessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + kakaoAccessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me", HttpMethod.GET, entity, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode json = objectMapper.readTree(response.getBody());

            String id = json.get("id").asText("");
            String nickname = "";
            String email = "";

            if (json.has("properties")) {
                nickname = json.get("properties").get("nickname").asText("");
            }
            if (json.has("kakao_account")) {
                email = json.get("kakao_account").get("email").asText("");
            }

            return KakaoUserInfoResponseDto.builder()
                    .id(id)
                    .nickname(nickname)
                    .email(email)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("카카오 사용자 정보 파싱 오류", e);
        }
    }

    public User loginWithGoogleIdToken(String idToken) {
        // 1. idToken 검증 및 사용자 정보 파싱
        GoogleInfoResponseDto googleUser = verifyAndGetGoogleUser(idToken);

        // 2. DB에 해당 socialId(구글은 sub == id)로 유저 존재 여부 확인
        Optional<User> userOpt = userRepository.findBySocialId(googleUser.getId());
        User user;
        if (userOpt.isPresent()) {
            // 이미 있으면 정보 업데이트
            user = userOpt.get();
            user.setName(googleUser.getName());
            user.setEmail(googleUser.getEmail());
            userRepository.save(user);

            // 마이페이지 없으면 생성
            if (mypageRepository.findByUser(user) == null) {
                mypageRepository.save(Mypage.builder()
                        .user(user)
                        .totalChallenge(0)
                        .successChallenge(0)
                        .stopedChallenge(0)
                        .failChallenge(0)
                        .achievement(0f)
                        .build());
            }
        } else {
            // 처음이면 새로 생성
            user = new User();
            user.setSocialId(googleUser.getId());
            user.setName(googleUser.getName());
            user.setEmail(googleUser.getEmail());
            user.setLoginId(googleUser.getEmail());
            user.setProvider(SocialLoginType.GOOGLE);
            userRepository.save(user);

            mypageRepository.save(Mypage.builder()
                    .user(user)
                    .totalChallenge(0)
                    .successChallenge(0)
                    .stopedChallenge(0)
                    .failChallenge(0)
                    .achievement(0f)
                    .build());
        }
        return user;
    }

    // idToken을 검증하고, 사용자 정보 파싱 (구글 공식 API 이용)
    private GoogleInfoResponseDto verifyAndGetGoogleUser(String idToken) {
        try {
            // Google 공식 라이브러리 이용 (com.google.api-client:google-api-client, com.google.oauth-client:google-oauth-client)
            com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier verifier =
                    new com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier.Builder(
                            new com.google.api.client.http.javanet.NetHttpTransport(),
                            com.google.api.client.json.jackson2.JacksonFactory.getDefaultInstance())
                            .setAudience(java.util.Collections.singletonList("1011161288421-uodlll5cmsbns461csjjue7gi945e7e6.apps.googleusercontent.com")) // 예: "1011161288421-xxxxxxx.apps.googleusercontent.com"
                            .build();

            com.google.api.client.googleapis.auth.oauth2.GoogleIdToken idTokenObj =
                    verifier.verify(idToken);

            if (idTokenObj != null) {
                com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = idTokenObj.getPayload();

                String userId = payload.getSubject();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                return GoogleInfoResponseDto.builder()
                        .id(userId)
                        .email(email)
                        .name(name)
                        .build();
            } else {
                throw new RuntimeException("구글 idToken 검증 실패");
            }
        } catch (Exception e) {
            throw new RuntimeException("구글 idToken 검증 중 오류", e);
        }
    }
}
