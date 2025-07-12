package com.geunjil.geunjil.domain.challenge.dto.response;

import com.geunjil.geunjil.domain.challenge.enums.Status;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
public class ChallengeCreateChallengeResponseDto {

    private Long challengeId;
    private String title;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate day;
    private String location;
    private double lat;
    private double lng;
    private int radius;
    private int warningCount;
    private Status status;
    private LocalDateTime createAt;
    private LocalDateTime updatedAt;

}
