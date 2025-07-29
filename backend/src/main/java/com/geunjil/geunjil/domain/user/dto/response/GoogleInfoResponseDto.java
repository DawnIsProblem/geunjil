package com.geunjil.geunjil.domain.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoogleInfoResponseDto {

    private String id;
    private String email;
    private String name;

}
