package com.geunjil.geunjil.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geunjil.geunjil.domain.user.dto.request.UserLoginRequestDto;
import com.geunjil.geunjil.domain.user.dto.request.UserRegisterRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class MypageIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeEach
    void setUp() throws Exception {
        // 1. 회원가입
        UserRegisterRequestDto signupRequest = new UserRegisterRequestDto("mypageTestId", "마이페이지테스트", "testpass", "mypage@email.com");

        mockMvc.perform(post("/user/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        // 2. 로그인
        UserLoginRequestDto loginRequest = new UserLoginRequestDto("mypageTestId", "testpass");

        String loginResponseJson = mockMvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // JWT 토큰 파싱
        String accessToken = objectMapper.readTree(loginResponseJson)
                .path("data")
                .path("accessToken")
                .asText();

        this.jwtToken = "Bearer " + accessToken;
    }

    @Test
    @DisplayName("마이페이지 정보 조회 통합 테스트")
    void testGetMypageInfo() throws Exception {
        mockMvc.perform(get("/mypage/me")
                        .header("Authorization", jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("mypage@email.com"))
                .andExpect(jsonPath("$.data.nickname").value("마이페이지테스트"));
    }

    @Test
    @DisplayName("최근 3개 챌린지 조회 (비어있을 경우 빈 배열)")
    void testGetTop3Challenges() throws Exception {
        mockMvc.perform(get("/mypage/me/ch_top3")
                        .header("Authorization", jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("회원 탈퇴 통합 테스트")
    void testDeleteUser() throws Exception {
        mockMvc.perform(delete("/mypage/me")
                        .header("Authorization", jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("회원 탈퇴 성공!"));
    }
}
