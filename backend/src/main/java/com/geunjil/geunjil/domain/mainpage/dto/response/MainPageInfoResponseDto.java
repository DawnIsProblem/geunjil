package com.geunjil.geunjil.domain.mainpage.dto.response;

import com.geunjil.geunjil.domain.challenge.dto.response.ChallengeGetCurrentChallengeResponseDto;
import com.geunjil.geunjil.domain.challenge.dto.response.ChallengeGetNextChallengeInfoResponseDto;
import com.geunjil.geunjil.domain.challenge.dto.response.ChallengeGetResultResponseDto;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MainPageInfoResponseDto {

    private ChallengeGetCurrentChallengeResponseDto currentChallenge;
    private ChallengeGetNextChallengeInfoResponseDto nextChallenge;
    private ChallengeGetResultResponseDto result;

}
