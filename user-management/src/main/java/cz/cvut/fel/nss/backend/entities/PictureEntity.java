package cz.cvut.fel.nss.backend.entities;

import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "picture")
@Getter
@NoArgsConstructor
public class PictureEntity {
    @Id
    private String username;
    private String contentType;
    private byte[] storedPicture;
    private byte[] thumbnail;

    public void savePicture(byte[] file, String username, String contentType) {
        if (storedPicture == null) {
            this.username = username;
        }
        this.storedPicture = file;
        this.contentType = contentType;

    }
}
