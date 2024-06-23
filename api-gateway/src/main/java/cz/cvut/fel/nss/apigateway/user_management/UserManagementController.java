package cz.cvut.fel.nss.apigateway.user_management;

import cz.cvut.fel.global_logging.LoggingClient;
import cz.cvut.fel.nss.apigateway.utils.ServiceEnum;
import cz.cvut.fel.nss.user_management.entities.dto.CombinedUserDto;
import cz.cvut.fel.nss.user_management.entities.dto.SignUpDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserManagementController {

    LoggingClient loggingClient = new LoggingClient("api-gateway");

    @Autowired
    private RestTemplate restTemplate;


    @PutMapping()
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<CombinedUserDto> updateUser(@RequestBody SignUpDto user) {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users";
        restTemplate.put(url, user);
        loggingClient.logInfo("User updated: " + user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/details")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<CombinedUserDto> updateUserDetails(@RequestBody SignUpDto user) {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/details";
        restTemplate.put(url, null);
        loggingClient.logInfo("User details updated: " + user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("login")
    public ResponseEntity<CombinedUserDto> loginUser(@RequestHeader("username") String username, @RequestHeader("password") String password) {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/login";

        Map<String, String> loginPayload = new HashMap<>();
        loginPayload.put("username", username);
        loginPayload.put("password", password);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(loginPayload, headers);
        ResponseEntity<CombinedUserDto> response = restTemplate.exchange(url, HttpMethod.POST, request, CombinedUserDto.class);
        loggingClient.logInfo("User logged in: " + response.getBody());
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CombinedUserDto> getUserDetails(@PathVariable int id){
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id;
        ResponseEntity<CombinedUserDto> response = restTemplate.getForEntity(url, CombinedUserDto.class);
        loggingClient.logInfo("User details retrieved: " + response.getBody());
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @GetMapping("/{id}/thumbnail")
    public ResponseEntity<byte[]> getThumbnail(@PathVariable int id){
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id + "/thumbnail";
        ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);
        loggingClient.logInfo("Thumbnail retrieved: " + Arrays.toString(response.getBody()));
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @GetMapping("/{id}/profilePhoto")
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable int id){
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id + "/profilePhoto";
        ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);
        loggingClient.logInfo("Profile photo retrieved: " + Arrays.toString(response.getBody()));
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @PutMapping("/{id}/profilePhoto")
    public ResponseEntity<byte[]> updateProfilePhoto(@PathVariable int id, @RequestParam("file")MultipartFile file){
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id + "/profilePhoto";
        ResponseEntity<byte[]> response = restTemplate.postForEntity(url, file, byte[].class);
        loggingClient.logInfo("Profile photo updated: " + Arrays.toString(response.getBody()));
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @DeleteMapping("/{id}/profilePhoto")
    public ResponseEntity<String> deleteProfilePhoto(@PathVariable int id) {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id + "/profilePhoto";
        restTemplate.delete(url);
        loggingClient.logInfo("Profile photo deleted");
        return ResponseEntity.ok().build();
    }


}
