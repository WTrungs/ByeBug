package com.group5.byebug.service;

import com.group5.byebug.entity.Admin;
import com.group5.byebug.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class JwtService {
    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final Base64.Encoder BASE64_URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder BASE64_URL_DECODER = Base64.getUrlDecoder();
    private static final Pattern STRING_CLAIM_PATTERN = Pattern.compile("\"%s\"\\s*:\\s*\"([^\"]*)\"");
    private static final Pattern NUMBER_CLAIM_PATTERN = Pattern.compile("\"%s\"\\s*:\\s*(\\d+)");

    private final String jwtSecret;
    private final long jwtExpirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String jwtSecret,
            @Value("${app.jwt.expiration-ms:86400000}") long jwtExpirationMs
    ) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateToken(User user) {
        return buildToken(user.getUsername(), user.getUserId(), user.getRole());
    }

    public String generateToken(Admin admin) {
        return buildToken(admin.getUsername(), admin.getAdminId(), "ADMIN");
    }

    private String buildToken(String username, Long id, String role) {
        long now = Instant.now().toEpochMilli();
        String header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payload = String.format(
                "{\"sub\":\"%s\",\"userId\":%d,\"role\":\"%s\",\"iat\":%d,\"exp\":%d}",
                escapeJson(username),
                id,
                escapeJson(role),
                now / 1000,
                (now + jwtExpirationMs) / 1000
        );
        String encodedHeader = encode(header);
        String encodedPayload = encode(payload);
        String signingInput = encodedHeader + "." + encodedPayload;
        return signingInput + "." + sign(signingInput);
    }

    public boolean isTokenValid(String token) {
        try {
            String payload = parsePayload(token);
            Long expirationSeconds = extractLongClaim(payload, "exp");
            if (expirationSeconds == null) {
                return false;
            }

            return Instant.now().getEpochSecond() < expirationSeconds;
        } catch (RuntimeException ex) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractStringClaim(parsePayload(token), "sub");
    }

    public String extractRole(String token) {
        return extractStringClaim(parsePayload(token), "role");
    }

    private String parsePayload(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid JWT format");
        }

        String signingInput = parts[0] + "." + parts[1];
        String expectedSignature = sign(signingInput);
        if (!MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                parts[2].getBytes(StandardCharsets.UTF_8)
        )) {
            throw new IllegalArgumentException("Invalid JWT signature");
        }

        return new String(BASE64_URL_DECODER.decode(parts[1]), StandardCharsets.UTF_8);
    }

    private String encode(String value) {
        return BASE64_URL_ENCODER.encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String extractStringClaim(String payload, String claimName) {
        Matcher matcher = Pattern.compile(String.format(STRING_CLAIM_PATTERN.pattern(), claimName)).matcher(payload);
        return matcher.find() ? unescapeJson(matcher.group(1)) : null;
    }

    private Long extractLongClaim(String payload, String claimName) {
        Matcher matcher = Pattern.compile(String.format(NUMBER_CLAIM_PATTERN.pattern(), claimName)).matcher(payload);
        return matcher.find() ? Long.parseLong(matcher.group(1)) : null;
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String unescapeJson(String value) {
        return value.replace("\\\"", "\"").replace("\\\\", "\\");
    }

    private String sign(String signingInput) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256));
            return BASE64_URL_ENCODER.encodeToString(mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not sign JWT", ex);
        }
    }
}
