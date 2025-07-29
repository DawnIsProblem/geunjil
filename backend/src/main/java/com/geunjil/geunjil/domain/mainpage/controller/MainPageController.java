package com.geunjil.geunjil.domain.mainpage.controller;

import com.geunjil.geunjil.common.model.CommonResponse;
import com.geunjil.geunjil.domain.mainpage.dto.response.MainPageInfoResponseDto;
import com.geunjil.geunjil.domain.mainpage.service.MainPageService;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/main")
@RequiredArgsConstructor
@Tag(name ="MainPage API", description = "메인 페이지 관련 API")
public class MainPageController {

    private final MainPageService mainPageService;

    @GetMapping("/info")
    @Operation(summary = "메인페이지 통합 정보 API", description = "홈화면에서 필요한 챌린지, 다음 챌린지, 성과 정보를 반환합니다.")
    public ResponseEntity<CommonResponse<MainPageInfoResponseDto>> getMainPageInfo(Authentication authentication) {
        String loginId = authentication.getName();
        MainPageInfoResponseDto response = mainPageService.getMainPageInfo(loginId);
        return ResponseEntity.ok(CommonResponse.success("메인페이지 정보 조회 성공", response));
    }

}
