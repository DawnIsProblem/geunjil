package com.geunjil.geunjil.domain.challenge.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChallengeLocationRequestDto {

    private double lat;
    private double lng;

}
