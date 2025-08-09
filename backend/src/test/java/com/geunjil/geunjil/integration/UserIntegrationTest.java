package com.geunjil.geunjil.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geunjil.geunjil.domain.user.dto.request.UserLoginRequestDto;
import com.geunjil.geunjil.domain.user.dto.request.UserRegisterRequestDto;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UserIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @Order(1)
    @DisplayName("회원가입 통합 테스트 - 성공")
    void signup_success() throws Exception {
        // given
        UserRegisterRequestDto request = new UserRegisterRequestDto(
                "testuser123", "테스트유저", "test1234", "testuser123@email.com"
        );

        // when & then
        mockMvc.perform(post("/user/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("자체 회원가입 성공!"))
                .andExpect(jsonPath("$.data.loginId").value("testuser123"))
                .andExpect(jsonPath("$.data.email").value("testuser123@email.com"));

        // 실제 DB에 저장되었는지 검증
        assertThat(userRepository.findByLoginId("testuser123")).isPresent();
    }

    @Test
    @Order(2)
    @DisplayName("로그인 통합 테스트 - 성공")
    void login_success() throws Exception {
        // given: 먼저 회원가입 선행
        UserRegisterRequestDto signupRequest = new UserRegisterRequestDto(
                "loginuser", "로그인유저", "mypassword", "loginuser@email.com"
        );

        mockMvc.perform(post("/user/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        // when: 로그인 요청
        UserLoginRequestDto loginRequest = new UserLoginRequestDto(
                "loginuser", "mypassword"
        );

        // then
        mockMvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("로그인 성공!"))
                .andExpect(jsonPath("$.data.loginId").value("loginuser"))
                .andExpect(jsonPath("$.data.accessToken").exists());
    }

}
