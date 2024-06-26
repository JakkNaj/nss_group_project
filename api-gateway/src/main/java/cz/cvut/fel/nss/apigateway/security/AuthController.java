package cz.cvut.fel.nss.apigateway.security;

import cz.cvut.fel.global_logging.LoggingClient;
import cz.cvut.fel.nss.apigateway.security.dto.AuthResponseDto;
import cz.cvut.fel.nss.apigateway.utils.ServiceEnum;
import cz.cvut.fel.nss.user_management.entities.UserEntity;
import cz.cvut.fel.nss.user_management.entities.dto.CombinedUserDto;
import cz.cvut.fel.nss.user_management.entities.dto.SignUpDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/auth")
public class AuthController {

    LoggingClient loggingClient = new LoggingClient("api-gateway");

    private final AuthenticationManager authenticationManager;
    private final RestTemplate restTemplate;

    private JWTGenerator jwtGenerator;


    // private PasswordEncoder passwordEncoder;

    // todo add PasswordEncoder to constructor
    @Autowired
    public AuthController(AuthenticationManager authenticationManager, RestTemplate restTemplate, JWTGenerator jwtGenerator) {
        this.authenticationManager = authenticationManager;
        this.restTemplate = restTemplate;
        this.jwtGenerator = jwtGenerator;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestHeader("username") String username, @RequestHeader("password") String password){
        // call login endpoint in user_management microservice
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/login";

        HttpHeaders headers = new HttpHeaders();
        headers.set("username", username);
        headers.set("password", password);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<UserEntity> response = restTemplate.exchange(url, HttpMethod.POST, entity, UserEntity.class);

        // Check the HTTP status code of the response
        if (response.getStatusCode().isError()) {
            // If the status code indicates an error, return the error response
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        }

        // If the status code indicates success, log the user in
        UserEntity user = response.getBody();

        // set the auth
        assert user != null;
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        return new ResponseEntity<>(new AuthResponseDto(token), HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignUpDto signUpDto){
        // call register endpoint in user_management microservice
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users";

        // Send a POST request to the /users endpoint
        ResponseEntity<UserEntity> response = restTemplate.postForEntity(url, signUpDto, UserEntity.class);

        // Check the HTTP status code of the response
        if (response.getStatusCode().isError()) {
            // If the status code indicates an error, return the error response
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        }

        // If the status code indicates success, log the user in
        UserEntity user = response.getBody();

        // set the auth
        assert user != null;
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return ResponseEntity.status(response.getStatusCode()).body(user);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("Test successful");
    }
}