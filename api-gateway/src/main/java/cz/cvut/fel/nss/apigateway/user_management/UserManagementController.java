package cz.cvut.fel.nss.apigateway.user_management;

import cz.cvut.fel.global_logging.LoggingClient;
import cz.cvut.fel.nss.apigateway.utils.ServiceEnum;
import cz.cvut.fel.nss.user_management.entities.dto.CombinedUserDto;
import cz.cvut.fel.nss.user_management.entities.dto.SignUpDto;
import cz.cvut.fel.nss.user_management.entities.dto.UpdateUserEntityDto;
import cz.cvut.fel.nss.user_management.entities.dto.UserDetailDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@RestController
@RequestMapping("/users")
public class UserManagementController {

    LoggingClient loggingClient = new LoggingClient("api-gateway");

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping()
    public ResponseEntity<CombinedUserDto> addUser(@RequestBody SignUpDto user) {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users";
        ResponseEntity<CombinedUserDto> response = restTemplate.postForEntity(url, user, CombinedUserDto.class);
        loggingClient.logInfo("User added: " + response.getBody());
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }


    @PutMapping()
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<CombinedUserDto> updateUser(@RequestBody UpdateUserEntityDto user) {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users";
        restTemplate.put(url, user);
        loggingClient.logInfo("User updated: " + user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/details")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<CombinedUserDto> updateUserDetails(@RequestBody UserDetailDto user) {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/details";
        restTemplate.put(url, user);
        loggingClient.logInfo("User details updated: " + user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("login")
    public ResponseEntity<CombinedUserDto> loginUser(@RequestHeader("username") String username, @RequestHeader("password") String password) {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/login";

        HttpHeaders headers = new HttpHeaders();
        headers.set("username", username);
        headers.set("password", password);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<CombinedUserDto> response = restTemplate.exchange(url, HttpMethod.POST, entity, CombinedUserDto.class);
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
    public ResponseEntity<String> getThumbnail(@PathVariable int id){
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id + "/thumbnail";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        loggingClient.logInfo("Thumbnail retrieved: " + Arrays.toString(response.getBody().toCharArray()));
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @GetMapping("/{id}/profilePhoto")
    public ResponseEntity<String> getProfilePhoto(@PathVariable int id){
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id + "/profilePhoto";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        loggingClient.logInfo("Profile photo retrieved: " + Arrays.toString(response.getBody().toCharArray()));
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @PutMapping("/{id}/profilePhoto")
    public ResponseEntity<String> updateProfilePhoto(@PathVariable int id, @RequestParam("file")MultipartFile file) throws IOException {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id + "/profilePhoto";
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, buildProfilePhotoHttpEntity(file), String.class);
        loggingClient.logInfo("Profile photo updated: " + response.getBody());
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

    }

    @PostMapping("/{id}/profilePhoto")
    public ResponseEntity<String> uploadProfilePhoto(@PathVariable int id, @RequestParam("file") MultipartFile file) throws IOException {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id + "/profilePhoto";
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, buildProfilePhotoHttpEntity(file), String.class);
        loggingClient.logInfo("Profile photo updated: " + response.getBody());
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    @DeleteMapping("/{id}/profilePhoto")
    public ResponseEntity<String> deleteProfilePhoto(@PathVariable int id) {
        String url = ServiceEnum.USER_MANAGEMENT.getUrl() + "/users/" + id + "/profilePhoto";
        restTemplate.delete(url);
        loggingClient.logInfo("Profile photo deleted");
        return ResponseEntity.ok().build();
    }

    /**
     * Builds a HttpEntity with a MultipartFile as a part of a multipart request
     * @param file
     * @return
     * @throws IOException
     */
    private HttpEntity<MultiValueMap<String, HttpEntity<?>>> buildProfilePhotoHttpEntity(MultipartFile file) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        }).header("Content-Disposition", "form-data; name=file; filename=" + file.getOriginalFilename());

        return new HttpEntity<>(builder.build(), headers);
    }
}
