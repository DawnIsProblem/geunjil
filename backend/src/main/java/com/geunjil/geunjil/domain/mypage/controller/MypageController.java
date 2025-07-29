package com.geunjil.geunjil.domain.mypage.controller;

import com.geunjil.geunjil.common.model.CommonResponse;
import com.geunjil.geunjil.domain.mypage.dto.response.MypageInfoResponseDto;
import com.geunjil.geunjil.domain.mypage.dto.response.MypageRecent3ChallengeResponseDto;
import com.geunjil.geunjil.domain.mypage.service.MypageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage")
@Tag(name = "Mypage API", description = "마이페이지 관련 API")
public class MypageController {

    private final MypageService mypageService;

    @GetMapping("/me")
    @Operation(
            summary = "마이페이지 정보 출력 API",
            description = "로그인한 계정의 마이페이지 정보를 출력합니다."
    )
    public ResponseEntity<CommonResponse<MypageInfoResponseDto>> getMyMypageInfo(Authentication authentication) {
        System.out.println("컨트롤러 도착, authentication = " + authentication);
        String loginId = authentication.getName();
        MypageInfoResponseDto response = mypageService.getMypageInfoByLoginId(loginId);
        return ResponseEntity.ok(CommonResponse.success("마이페이지 정보 호출 성공!", response));
    }

    // 최근 3개 챌린지
    @GetMapping("/me/ch_top3")
    @Operation(
            summary = "최근 챌린지 정보 호출 API",
            description = "최근 3개의 챌린지의 간단 정보를 호출합니다."
    )
    public ResponseEntity<CommonResponse<List<MypageRecent3ChallengeResponseDto>>> getTop3Challenge(Authentication authentication) {
        String loginId = authentication.getName();
        List<MypageRecent3ChallengeResponseDto> response = mypageService.getRecentChallengesByLoginId(loginId);
        return ResponseEntity.ok(CommonResponse.success("최근 3개의 챌린지 정보 호출 성공!", response));
    }

    // 회원 탈퇴
    @DeleteMapping("/me")
    @Operation(
            summary = "회원 탈퇴 API",
            description = "로그인한 계정을 서비스에서 탈퇴합니다."
    )
    public ResponseEntity<CommonResponse<String>> deleteUser(Authentication authentication) {
        String loginId = authentication.getName();
        mypageService.deleteUserByLoginId(loginId);
        return ResponseEntity.ok(CommonResponse.success("회원 탈퇴 성공!", null));
    }
}
