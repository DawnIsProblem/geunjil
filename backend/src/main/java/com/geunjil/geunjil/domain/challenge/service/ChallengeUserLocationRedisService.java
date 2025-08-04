package com.geunjil.geunjil.domain.challenge.service;

import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeUserLocationDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ChallengeUserLocationRedisService {

    private final RedisTemplate<String, ChallengeUserLocationDto> userLocationRedisTemplate;

    public void saveLocation(Long challengeId, Long userId, double lat, double lng) {
        String key = "challenge:" + challengeId + ":user:" + userId + ":location";
        ChallengeUserLocationDto dto = new ChallengeUserLocationDto(lat, lng, System.currentTimeMillis());
        userLocationRedisTemplate.opsForValue().set(key, dto);
    }

    public ChallengeUserLocationDto getLocation(Long challengeId, Long userId) {
        String key = "challenge:" + challengeId + ":user:" + userId + ":location";
        return userLocationRedisTemplate.opsForValue().get(key);
    }

    public void deleteLocation(Long challengeId, Long userId) {
        String key = "challenge:" + challengeId + ":user:" + userId + ":location";
        userLocationRedisTemplate.delete(key);
    }

}
