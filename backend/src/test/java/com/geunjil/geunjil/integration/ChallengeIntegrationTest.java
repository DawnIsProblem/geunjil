package com.geunjil.geunjil.integration;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeCreateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeUpdateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.enums.SocialLoginType;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ChallengeIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private String accessToken;

    @BeforeEach
    void setUp() throws Exception {
        userRepository.deleteByLoginId("testUser");

        testUser = userRepository.save(User.builder()
                .loginId("testUser")
                .password(passwordEncoder.encode("testPassword"))
                .email("test@example.com")
                .provider(SocialLoginType.LOCAL)
                .build());

        String loginPayload = objectMapper.writeValueAsString(Map.of(
                "loginId", "testUser",
                "password", "testPassword"
        ));

        MvcResult loginResult = mockMvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isOk())
                .andReturn();

        // ✅ accessToken 꺼내는 부분 수정
        JsonNode root = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        JsonNode dataNode = root.get("data");
        accessToken = dataNode.get("accessToken").asText();
    }


    @Test
    @Order(1)
    @DisplayName("챌린지 생성")
    void createChallenge() throws Exception {
        ChallengeCreateChallengeRequestDto request = new ChallengeCreateChallengeRequestDto();
        request.setTitle("런닝");
        request.setStartTime(LocalTime.of(6, 0));
        request.setEndTime(LocalTime.of(7, 0));
        request.setDay(LocalDate.of(2025, 9, 9));
        request.setLocation("한강공원");
        request.setLat(37.56);
        request.setLng(126.97);
        request.setRadius(500);

        mockMvc.perform(post("/challenge")
                        .with(user("testUser").roles("USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        assertThat(challengeRepository.countByUserId(testUser)).isEqualTo(1);
    }

    @Test
    @Order(2)
    @DisplayName("챌린지 수정")
    @WithMockUser(username = "testUser")
    void updateChallenge() throws Exception {
        Challenge saved = challengeRepository.save(Challenge.builder()
                .userId(testUser)
                .title("기존 챌린지")
                .day(LocalDate.of(2025, 9, 9))
                .startTime(LocalTime.of(6, 0))
                .endTime(LocalTime.of(7, 0))
                .location("기존 장소")
                .lat(37.56)
                .lng(126.97)
                .status(Status.PENDING)
                .radius(300)
                .build());

        ChallengeUpdateChallengeRequestDto request = new ChallengeUpdateChallengeRequestDto();
        request.setTitle("수정된 챌린지");
        request.setDay(LocalDate.of(2025, 9, 10));
        request.setStartTime(LocalTime.of(6, 30));
        request.setEndTime(LocalTime.of(7, 30));
        request.setLocation("새 장소");
        request.setLat(37.57);
        request.setLng(126.96);
        request.setRadius(400);

        mockMvc.perform(patch("/challenge/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        Challenge updated = challengeRepository.findById(saved.getId()).orElseThrow();
        assertThat(updated.getTitle()).isEqualTo("수정된 챌린지");
    }

    @Test
    @Order(3)
    @DisplayName("챌린지 삭제")
    @WithMockUser(username = "testUser")
    void deleteChallenge() throws Exception {
        Challenge saved = challengeRepository.save(Challenge.builder()
                .userId(testUser)
                .title("삭제 챌린지")
                .day(LocalDate.of(2025, 9, 9))
                .startTime(LocalTime.of(6, 0))
                .endTime(LocalTime.of(7, 0))
                .location("삭제 장소")
                .lat(37.56)
                .lng(126.97)
                .radius(300)
                .status(Status.PENDING)
                .build());

        mockMvc.perform(delete("/challenge/" + saved.getId()))
                .andExpect(status().isOk());

        assertThat(challengeRepository.findById(saved.getId())).isEmpty();
    }
}

