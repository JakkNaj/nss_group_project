package cz.cvut.fel.nss.backend.services.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class PictureSerializer {
    public static byte[] readImage(String imagePath) throws IOException {
        return Files.readAllBytes(Paths.get(imagePath));
    }
}
