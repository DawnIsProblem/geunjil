package com.geunjil.geunjil.domain.challenge.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class ChallengeCreateChallengeRequestDto {

    @Schema(description = "타이틀", example = "1시간 공원 러닝")
    private String title;

    @Schema(description = "시작 시간", example = "18:00:00")
    private LocalTime startTime;

    @Schema(description = "종료 시간", example = "19:00:00")
    private LocalTime endTime;

    @Schema(description = "날짜", example = "2025-09-09")
    private LocalDate day;

    @Schema(description = "장소", example = "서율대공원")
    private String location;

    @Schema(description = "위도", example = "38.1234")
    private double lat;

    @Schema(description = "경도", example = "123.4244")
    private double lng;

    @Schema(description = "반경(m)", example = "500")
    private int radius;

}

