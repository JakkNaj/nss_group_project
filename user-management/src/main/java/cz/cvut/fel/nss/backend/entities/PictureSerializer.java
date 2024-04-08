package cz.cvut.fel.nss.backend.entities;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class PictureSerializer {
    public byte[] readImage(String imagePath) throws IOException {
        return Files.readAllBytes(Paths.get(imagePath));
    }
}
