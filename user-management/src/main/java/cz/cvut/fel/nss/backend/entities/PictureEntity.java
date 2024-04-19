package cz.cvut.fel.nss.backend.entities;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "picture")
@Getter
@NoArgsConstructor
@Slf4j
public class PictureEntity {
    @Id
    private Integer id;
    private String contentType;
    private byte[] storedPicture;
    private byte[] thumbnail;

    @Value("${profilephoto.thumbnail.width}")
    private int thumbnailWidth;

    public void savePicture(byte[] file, byte[] thumbnail, int id, String contentType) {
        if (storedPicture == null) {
            this.id = id;
        }
        this.storedPicture = file;
        this.contentType = contentType;
        this.thumbnail = thumbnail;
    }
}
