package com.geunjil.geunjil.domain.user.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    public JwtAuthenticationFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
        throws ServletException, IOException {

        System.out.println("JwtAuthenticationFilter 작동: " + request.getRequestURI());

        String token = resolveToken(request);

        String bearerToken = request.getHeader("Authorization");
        System.out.println("Authorization 헤더: " + bearerToken);

        if (StringUtils.hasText(token) && jwtProvider.validateToken(token)) {
            System.out.println("✅ JWT 인증 성공: " + jwtProvider.getClaims(token).getSubject());
            // 토큰에서 정보 추출
            Claims claims = jwtProvider.getClaims(token);

            String loginId = claims.getSubject();
            String role = (String) claims.get("role");

            // 사용자 인증 객체 생성
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(loginId, null, authorities);

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            // SecurityContext에 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    // Authorization 헤더에서 Bearer 토큰 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
