package com.smartprint.smartservice.services;

import com.smartprint.smartservice.dtos.AuthLoginDto;
import com.smartprint.smartservice.models.Users;
import com.smartprint.smartservice.repos.UsersRepo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsersRepo usersRepo;
    private final AuthenticationManager authManager;
    private final JWTService jwtService;

    public AuthService(UsersRepo usersRepo, AuthenticationManager authManager, JWTService jwtService){
        this.usersRepo = usersRepo;
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    public String login(AuthLoginDto authLoginDetails){
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(authLoginDetails.getUserName(), authLoginDetails.getPassword()));
        if(authentication.isAuthenticated())
            return jwtService.generateToken(authLoginDetails.getUserName());
        return "Login failure";
    }

    public String register(Users userDetails){
        usersRepo.save(userDetails);
        return "Successfully registered";
    }
}
