package com.geunjil.geunjil.domain.challenge.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ChallengeUpdateChallengeRequestDto {

    @Schema(description = "타이틀", example = "점심 운동")
    private String title;

    @Schema(description = "시작 시간", example = "12:00:00")
    private LocalTime startTime;

    @Schema(description = "종료 시간", example = "13:00:00")
    private LocalTime endTime;

    @Schema(description = "날짜", example = "2025-09-19")
    private LocalDate day;

    @Schema(description = "지역", example = "서울대학교 운동장")
    private String location;

    @Schema(description = "위도", example = "45.2234")
    private double lat;

    @Schema(description = "경도", example = "123.2345")
    private double lng;

    @Schema(description = "반경(m)", example = "1000")
    private int radius;

}
