package com.geunjil.geunjil.domain.user.controller;

import com.geunjil.geunjil.common.model.CommonResponse;
import com.geunjil.geunjil.domain.user.dto.response.UserSocialLoginResponseDto;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.enums.SocialLoginType;
import com.geunjil.geunjil.domain.user.jwt.JwtProvider;
import com.geunjil.geunjil.domain.user.service.OauthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Social Login API", description = "소셜 로그인 인증을 및 콜백 처리 관련 API")
public class OauthController {

    private final OauthService oauthService;
    private final JwtProvider jwtProvider;

    @GetMapping("/{socialLoginType}")
    @Operation(
            summary = "[소셜 로그인 1단계] 소셜 로그인 프로세스 시작",
            description = "사용자를 소셜 로그인 페이지로 리다이렉트하여 인증 절차를 시작합니다.")
    public ResponseEntity<String> socialLoginType(
            @PathVariable(name = "socialLoginType")SocialLoginType socialLoginType
    ){
      log.info("✅사용자로부터 소셜 로그인 요청을 받음(플랫폼 = {}) ", socialLoginType);
      String redirectURL = oauthService.request(socialLoginType);
      return ResponseEntity.ok(redirectURL);
    }

    @GetMapping("/{socialLoginType}/callback")
    @Operation(
            summary = "[소셜 로그인 2단계] 소셜 로그인 콜백 처리(프론트에서 사용)",
            description = "사용자가 소셜 로그인 후 리다이렉트 URL로 받은 코드를 통해 엑세스 토큰을 요청합니다.")
    public ResponseEntity<?> redirect (
            @PathVariable(name = "socialLoginType") SocialLoginType socialLoginType,
            @RequestParam(name = "code") String code,
            HttpSession session
    ){
        log.info("✅소셜 로그인 API 서버로부터 받은 code = {}", code);

        User user = oauthService.requestAccessTokenAndSaveUser(socialLoginType, code);

        if(user != null) {
            log.info("✅사용자 정보를 데이터 베이스에 저장했습니다. :: {}", user.getName());

            String accessToken = jwtProvider.createToken(user.getLoginId(), "ROLE_USER");

            session.setAttribute("loginUser", user);

            return ResponseEntity.ok(new UserSocialLoginResponseDto(user.getName(), accessToken, user.getProvider(), user.getEmail()));
        } else {
            log.error("❌사용자 정보 저장 실패");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사용자 정보 저장 실패");
        }
    }

    @PostMapping("/logout")
    @Operation(
            summary = "로그아웃 API",
            description = "세션에 저장된 사용자 정보를 제거하여 로그아웃합니다."
    )
    public ResponseEntity<CommonResponse<String>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(CommonResponse.success("로그아웃 성공!", null));
    }

    @GetMapping("/me")
    @Operation(
            summary = "세션에 저장된 로그인 사용자 확인 API",
            description = "현재 로그인 세션에 저장된 사용자 정보를 반환합니다."
    )
    public ResponseEntity<?> getLoginSession(HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return ResponseEntity.ok(CommonResponse.failure("❌로그인이 되어있지 않습니다."));
        } else {
            return ResponseEntity.ok(CommonResponse.success("✅로그인이 정상적으로 되어있습니다.", user));
        }
    }


    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> body) {
        String accessToken = body.get("accessToken");
        // 서비스 계층에서 실제 인증 및 유저 저장/조회, JWT 발급 처리
        User user = oauthService.loginWithKakaoAccessToken(accessToken);
        String jwt = jwtProvider.createToken(user.getLoginId(), "ROLE_USER");
        return ResponseEntity.ok(Map.of(
                "accessToken", jwt,
                "user", user
        ));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");
        // idToken을 검증하고, 사용자 정보 DB 저장/조회, JWT 발급 처리
        User user = oauthService.loginWithGoogleIdToken(idToken);
        String jwt = jwtProvider.createToken(user.getLoginId(), "ROLE_USER");
        return ResponseEntity.ok(Map.of(
                "accessToken", jwt,
                "user", user
        ));
    }


}
