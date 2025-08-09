package com.geunjil.geunjil.unit;

import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeUserLocationDto;
import com.geunjil.geunjil.domain.challenge.service.ChallengeUserLocationRedisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class ChallengeUserLocationRedisServiceTest {

    private RedisTemplate<String, ChallengeUserLocationDto> redisTemplate;
    private ValueOperations<String, ChallengeUserLocationDto> valueOps;
    private ChallengeUserLocationRedisService redisService;

    @BeforeEach
    void setUp() {
        redisTemplate = mock(RedisTemplate.class);
        valueOps = mock(ValueOperations.class);
        redisService = new ChallengeUserLocationRedisService(redisTemplate);

        when(redisTemplate.opsForValue()).thenReturn(valueOps);
    }

    @Test
    @DisplayName("Redis에 좌표 저장 테스트")
    void saveLocation_shouldStoreInRedis() {
        Long challengeId = 1L;
        Long userId = 10L;
        double lat = 37.1234;
        double lng = 127.5678;

        redisService.saveLocation(challengeId, userId, lat, lng);

        verify(valueOps).set(eq("challenge:1:user:10:location"), any(ChallengeUserLocationDto.class));
    }

    @Test
    @DisplayName("Redis에 저장된 좌표 호출 테스트")
    void getLocation_shouldReturnStoredValue() {
        String key = "challenge:1:user:10:location";
        ChallengeUserLocationDto mockDto = new ChallengeUserLocationDto(37.1, 127.2, System.currentTimeMillis());

        when(valueOps.get(key)).thenReturn(mockDto);

        ChallengeUserLocationDto result = redisService.getLocation(1L, 10L);
        assertEquals(mockDto.getLat(), result.getLat());
        assertEquals(mockDto.getLng(), result.getLng());
    }

    @Test
    @DisplayName("Redis에 저장된 좌표 삭제 테스트")
    void deleteLocation_shouldRemoveFromRedis() {
        redisService.deleteLocation(2L, 20L);
        verify(redisTemplate).delete("challenge:2:user:20:location");
    }
}
