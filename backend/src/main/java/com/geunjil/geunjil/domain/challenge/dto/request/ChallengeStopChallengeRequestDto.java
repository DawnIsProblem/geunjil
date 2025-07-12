package com.geunjil.geunjil.domain.challenge.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class ChallengeStopChallengeRequestDto {

    @Schema(description = "챌린지 아이디", example = "1")
    private Long ChallengeId;


}
