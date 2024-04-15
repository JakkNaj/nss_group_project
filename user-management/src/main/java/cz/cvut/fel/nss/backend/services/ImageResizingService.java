package cz.cvut.fel.nss.backend.services;

import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class ImageResizingService {

    @Value("${profilephoto.thumbnail.width}")
    private int thumbnailWidth;

    public byte[] createThumbnail(byte[] imageBytes) throws IOException {
        InputStream is = new ByteArrayInputStream(imageBytes);
        BufferedImage originalImage = ImageIO.read(is);
        BufferedImage resizedImage = Scalr.resize(originalImage, thumbnailWidth);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "png", baos);
        return baos.toByteArray();
    }
}