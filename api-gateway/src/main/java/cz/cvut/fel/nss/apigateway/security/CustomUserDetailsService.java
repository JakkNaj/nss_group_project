package cz.cvut.fel.nss.apigateway.security;

import cz.cvut.fel.nss.apigateway.utils.ServiceEnum;
import cz.cvut.fel.nss.user_management.entities.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final RestTemplate restTemplate;

    @Autowired
    public CustomUserDetailsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/auth/" + username;
        ResponseEntity<UserEntity> response = restTemplate.getForEntity(url, UserEntity.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            UserEntity userEntity = response.getBody();
            assert userEntity != null;
            return new User(
                    userEntity.getUsername(),
                    //todo delete {noop} when using password encoder
                    "{noop}" + userEntity.getPassword(),
                    // if using other roles, map userEntity.getRoles() to a list of roles
                    // userEntity needs to have a roles field!
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            );
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}

