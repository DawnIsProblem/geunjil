package com.geunjil.geunjil.domain.challenge.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChallengeGetResultResponseDto {

    private int success;
    private int stoped;
    private int fail;

}
