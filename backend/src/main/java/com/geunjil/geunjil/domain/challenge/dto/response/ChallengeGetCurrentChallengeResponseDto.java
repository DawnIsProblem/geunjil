package com.geunjil.geunjil.domain.challenge.dto.response;

import lombok.Getter;
import lombok.Builder;

import java.time.LocalTime;

@Getter
@Builder
public class ChallengeGetCurrentChallengeResponseDto {

    private Long id;
    private String title;
    private LocalTime startTime;
    private LocalTime endTime;
    private String location;
    private int progressPercent;

}
