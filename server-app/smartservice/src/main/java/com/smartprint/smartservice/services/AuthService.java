package com.smartprint.smartservice.services;

import com.smartprint.smartservice.constants.LookupCodes;
import com.smartprint.smartservice.constants.Messages;
import com.smartprint.smartservice.dtos.AuthResponse;
import com.smartprint.smartservice.dtos.LoginRequest;
import com.smartprint.smartservice.dtos.RefreshTokenRequest;
import com.smartprint.smartservice.dtos.SignupRequest;
import com.smartprint.smartservice.models.User;
import com.smartprint.smartservice.models.lookup.UserType;
import com.smartprint.smartservice.repository.UserRepository;
import com.smartprint.smartservice.repository.lookup.UserTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authManager;
    private final JWTService jwtService;
    private final UserTypeRepository userTypeRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse signup(SignupRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException(Messages.Auth.EMAIL_ALREADY_REGISTERED);
        }

        final String userTypeCode = LookupCodes.UserTypes.OWNER.equalsIgnoreCase(request.getRole())
                ? LookupCodes.UserTypes.OWNER : LookupCodes.UserTypes.CUSTOMER;

        UserType userType = userTypeRepository.findByCode(userTypeCode)
                .orElseThrow(() -> new RuntimeException(Messages.Lookup.USER_TYPE_NOT_FOUND + userTypeCode));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .userType(userType)
                .phone(request.getPhone())
                .username(request.getUsername())
                .avatar(request.getAvatar())
                .bio(request.getBio())
                .city(request.getCity())
                .active(true)
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .userType(user.getUserType().getCode())
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public AuthResponse login(LoginRequest request){
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String accessToken = jwtService.generateAccessToken(authentication);
        String refreshToken = jwtService.generateRefreshToken(request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException(Messages.Auth.INVALID_CREDENTIALS));

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(request.getEmail())
                .fullName(user.getFullName())
                .userType(user.getUserType().getCode())
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public AuthResponse refresh(RefreshTokenRequest request){
        String token = request.getRefreshToken();

        String email = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(Messages.Auth.USER_NOT_FOUND));

        String accessToken = jwtService.generateAccessToken(email);
        String refreshToken = jwtService.generateRefreshToken(email);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .userType(user.getUserType().getCode())
                .username(user.getUsername())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
