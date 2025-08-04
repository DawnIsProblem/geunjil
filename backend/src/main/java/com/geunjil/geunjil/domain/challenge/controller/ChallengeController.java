package com.geunjil.geunjil.domain.challenge.controller;

import com.geunjil.geunjil.common.model.CommonResponse;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeCreateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeLocationRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeUpdateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.response.*;
import com.geunjil.geunjil.domain.challenge.service.ChallengeService;
import com.geunjil.geunjil.domain.challenge.service.ChallengeUserLocationRedisService;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challenge")
@RequiredArgsConstructor
@Tag(name = "Challenge API", description = "챌린지 관련 API")
public class ChallengeController {

    private final UserRepository userRepository;
    private final ChallengeService challengeService;
    private final ChallengeUserLocationRedisService userLocationRedisService;

    @PostMapping
    @Operation(summary = "챌린지 생성 API", description = "도전할 챌린지를 생성합니다.")
    public ResponseEntity<CommonResponse<ChallengeCreateChallengeResponseDto>> create(
            Authentication authentication,
            @RequestBody ChallengeCreateChallengeRequestDto request
    ) {
        String loginId = authentication.getName();
        ChallengeCreateChallengeResponseDto response = challengeService.createChallenge(loginId, request);
        return ResponseEntity.ok(CommonResponse.success("챌린지 생성 성공!", response));
    }

    @PatchMapping("/{challengeId}")
    @Operation(summary = "챌린지 수정 API", description = "도전 할  챌린지의 정보를 수정합니다.")
    public ResponseEntity<CommonResponse<ChallengeUpdateChallengeResponseDto>> update(
            @PathVariable Long challengeId,
            Authentication authentication,
            @RequestBody ChallengeUpdateChallengeRequestDto request
    ) {
        String loginId = authentication.getName();
        ChallengeUpdateChallengeResponseDto response = challengeService.update(challengeId, loginId, request);
        return ResponseEntity.ok(CommonResponse.success("챌린지 정보 수정 성공!", response));
    }

    @DeleteMapping("/{challengeId}")
    @Operation(summary = "챌린지 삭제 API", description = "도전할 챌린지를 삭제합니다.")
    public ResponseEntity<CommonResponse<ChallengeDeleteChallengeResponseDto>> delete(
            @PathVariable Long challengeId,
            Authentication authentication
    ) {
        String loginId = authentication.getName();
        ChallengeDeleteChallengeResponseDto response = challengeService.delete(challengeId, loginId);
        return ResponseEntity.ok(CommonResponse.success("챌린지 삭제 성공!", response));
    }

    @GetMapping("/{challengeId}")
    @Operation(summary = "챌린지 정보 호출 API", description = "생성한 챌린지의 정보를 호출합니다.")
    public ResponseEntity<CommonResponse<ChallengeGetChallengeInfoResponseDto>> getInfo(
            @PathVariable Long challengeId,
            Authentication authentication
    ) {
        String loginId = authentication.getName();
        ChallengeGetChallengeInfoResponseDto response = challengeService.getInfo(challengeId, loginId);
        return ResponseEntity.ok(CommonResponse.success("챌린지 정보 불러오기 성공!", response));
    }

    @PatchMapping("/stop")
    @Operation(summary = "챌린지 중단 API", description = "도전중인 챌린지가 실패 요건이 부합할 때 챌린지를 중단시킵니다.")
    public ResponseEntity<CommonResponse<ChallengeStopChallengeResponseDto>> stopChallenge(
            Authentication authentication,
            @RequestParam("challengeId") Long challengeId
    ) {
        String loginId = authentication.getName();
        ChallengeStopChallengeResponseDto response = challengeService.stopChallenge(challengeId, loginId);
        return ResponseEntity.ok(CommonResponse.success("챌린지 중단 성공!", response));
    }

    @PostMapping("/{challengeId}/location")
    public ResponseEntity<Void> uploadLocation(
            @PathVariable Long challengeId,
            @RequestBody ChallengeLocationRequestDto locationDto,
            Authentication authentication
    ) {
        String loginId = authentication.getName();
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));
        userLocationRedisService.saveLocation(challengeId, user.getId(), locationDto.getLat(), locationDto.getLng());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending")
    @Operation(summary = "대기 챌린지 조회 API", description = "로그인 유저의 PENDING 상태 챌린지 목록을 반환합니다.")
    public ResponseEntity<CommonResponse<List<ChallengeGetNextChallengeInfoResponseDto>>> getPending(
            Authentication authentication
    ) {
        String loginId = authentication.getName();
        List<ChallengeGetNextChallengeInfoResponseDto> list = challengeService.getPendingChallenges(loginId);
        return ResponseEntity.ok(CommonResponse.success("PENDING 챌린지 리스느 조회 성공", list));
    }

}
