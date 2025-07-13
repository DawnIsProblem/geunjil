package com.geunjil.geunjil.domain.mypage.dto.response;

import com.geunjil.geunjil.domain.challenge.enums.Status;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class MypageRecent3ChallengeResponseDto {

    private String title;
    private LocalDate day;
    private Status status;

}
