package com.geunjil.geunjil.domain.challenge.controller;

import com.geunjil.geunjil.common.model.CommonResponse;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeCreateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeStopChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeUpdateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.response.*;
import com.geunjil.geunjil.domain.challenge.service.ChallengeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/challenge")
@RequiredArgsConstructor
@Tag(name = "Challenge API", description = "챌린지 관련 API")
public class ChallengeController {

    private final ChallengeService challengeService;

    @PostMapping("/{userId}")
    @Operation(
            summary = "챌린지 생성 API",
            description = "사용자가 챌린지를 생성합니다"
    )
    public ResponseEntity<CommonResponse<ChallengeCreateChallengeResponseDto>> create(
            @PathVariable Long userId,
            @RequestBody ChallengeCreateChallengeRequestDto request
    ) {
        ChallengeCreateChallengeResponseDto response = challengeService.createChallenge(userId, request);
        return ResponseEntity.ok(CommonResponse.success("챌린지 생성 성공!", response));
    }

    @PatchMapping("/{challengeId}")
    @Operation(
            summary = "챌린지 수정 API",
            description = "사용자가 챌린지의 정보를 수정합니다."
    )
    public ResponseEntity<CommonResponse<ChallengeUpdateChallengeResponseDto>> update(
            @PathVariable Long challengeId,
            @RequestBody ChallengeUpdateChallengeRequestDto request
    ){
        ChallengeUpdateChallengeResponseDto response = challengeService.update(challengeId, request);
        return ResponseEntity.ok(CommonResponse.success("챌린지 정보 수정 성공!", response));
    }

    @DeleteMapping("/{challengeId}")
    @Operation(
            summary = "챌린지 삭제 API",
            description = "사용자가 도전 하지 않은 챌린지를 삭제합니다."
    )
    public ResponseEntity<CommonResponse<ChallengeDeleteChallengeResponseDto>> delete(
            @PathVariable Long challengeId
    ) {
        ChallengeDeleteChallengeResponseDto response = challengeService.delete(challengeId);
        return ResponseEntity.ok(CommonResponse.success("챌린지 삭제 성공!", response));
    }

    @GetMapping("/{challengeId}")
    @Operation(
            summary = "챌린지 정보 추출 API",
            description = "챌린지 아이디를 이용해서 챌린지의 정보를 추출합니다."

    )
    public ResponseEntity<CommonResponse<ChallengeGetChallengeInfoResponseDto>> getInfo(
            @PathVariable Long challengeId
    ){
        ChallengeGetChallengeInfoResponseDto response = challengeService.getInfo(challengeId);
        return ResponseEntity.ok(CommonResponse.success("챌린지 정보 불러오기 성공!", response));
    }

    @PatchMapping("/stop")
    @Operation(
            summary = "챌린지 중단 API",
            description = "도전중 중단사유 발생시 진행중인 챌린지를 중단합니다."
    )
    public ResponseEntity<CommonResponse<ChallengeStopChallengeResponseDto>> stopChallenge(
            @RequestBody ChallengeStopChallengeRequestDto request
    ){
        ChallengeStopChallengeResponseDto response = challengeService.stopChallenge(request);
        return ResponseEntity.ok(CommonResponse.success("챌린지 중단 처리", response));
    }


}
