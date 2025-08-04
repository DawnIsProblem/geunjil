package com.geunjil.geunjil.domain.challenge.dto.request;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChallengeUserLocationDto implements Serializable {

    private double lat;
    private double lng;
    private long timestamp;

}
