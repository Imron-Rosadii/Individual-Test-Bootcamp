package com.example.E_comerse.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    // ✅ Generate Token berdasarkan userId
    public String generateToken(Long userId) {
        return Jwts.builder()
                .setSubject(userId.toString())  // Gunakan userId sebagai subject
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Expired dalam 24 jam
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    // ✅ Ambil userId dari Token
    public Long extractUserId(String token) {
        return Long.parseLong(extractClaim(token, Claims::getSubject));
    }

    // ✅ Ekstrak data dari token (flexibel)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // ✅ Ambil semua claims dari token
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    // ✅ Cek apakah token sudah kadaluarsa
    private Boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    // ✅ Validasi token berdasarkan userId
    public Boolean validateToken(String token, Long userId) {
        return extractUserId(token).equals(userId) && !isTokenExpired(token);
    }
}
