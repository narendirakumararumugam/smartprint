package com.smartprint.smartservice.services;

import com.smartprint.smartservice.models.UserPrincipal;
import com.smartprint.smartservice.models.Users;
import com.smartprint.smartservice.repos.UsersRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {
    private final UsersRepo usersRepo;

    public AppUserDetailsService(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepo.findByName(username);
        
        if(user == null){
            throw new UsernameNotFoundException("Username not found");
        }
        
        return new UserPrincipal(user);
    }
}
