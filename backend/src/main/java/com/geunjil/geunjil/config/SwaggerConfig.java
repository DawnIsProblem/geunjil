package com.geunjil.geunjil.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("Authorization",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)
                                        .bearerFormat("JWT")
                                        .name("Authorization")
                        )
                )
                .addSecurityItem(new SecurityRequirement().addList("Authorization"))
                .info(new Info()
                        .title("GeunJil-GeunJil / 헬스 케어 프로젝트")
                        .version("1.0.0")
                        .description(
                                """
                                작성 예정입니다.
                                """
                        )
                );
    }

}
