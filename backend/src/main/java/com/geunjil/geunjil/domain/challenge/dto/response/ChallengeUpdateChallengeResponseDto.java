package com.geunjil.geunjil.domain.challenge.dto.response;

import com.geunjil.geunjil.domain.challenge.enums.Status;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
public class ChallengeUpdateChallengeResponseDto {

    private Long challengeId;
    private String title;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate day;
    private String location;
    private double lat;
    private double lng;
    private int radius;
    private Status status;

}
