
package com.propertymatch.property;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PropertyImageStorageService {

    private final Path uploadDirectory;

    public PropertyImageStorageService(
            @Value("${app.upload.dir:uploads}") String uploadDir) {

        this.uploadDirectory = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();
    }

    public List<String> saveImages(List<MultipartFile> files) {

        List<String> savedUrls = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            return savedUrls;
        }

        if (files.size() > 8) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You can upload a maximum of 8 images."
            );
        }

        try {
            Files.createDirectories(uploadDirectory);

            for (MultipartFile file : files) {

                if (file == null || file.isEmpty()) {
                    continue;
                }

                if (file.getSize() > 5 * 1024 * 1024) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Each image must be 5 MB or smaller."
                    );
                }

                String contentType = file.getContentType();

                String extension;

                if ("image/jpeg".equalsIgnoreCase(contentType)) {
                    extension = ".jpg";
                } else if ("image/png".equalsIgnoreCase(contentType)) {
                    extension = ".png";
                } else if ("image/webp".equalsIgnoreCase(contentType)) {
                    extension = ".webp";
                } else {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Only JPG, PNG and WebP images are allowed."
                    );
                }

                String filename = UUID.randomUUID() + extension;

                Path destination = uploadDirectory.resolve(filename)
                        .normalize();

                if (!destination.startsWith(uploadDirectory)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid image filename."
                    );
                }

                Files.copy(file.getInputStream(), destination);

                savedUrls.add("/uploads/properties/" + filename);
            }

            return savedUrls;

        } catch (IOException exception) {
            deleteImages(savedUrls);

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not save property images."
            );
        } catch (RuntimeException exception) {
            deleteImages(savedUrls);
            throw exception;
        }
    }

    public void deleteImages(List<String> imageUrls) {

        if (imageUrls == null) {
            return;
        }

        for (String imageUrl : imageUrls) {
            try {
                String filename = Paths.get(imageUrl)
                        .getFileName()
                        .toString();

                Path file = uploadDirectory.resolve(filename).normalize();

                if (file.startsWith(uploadDirectory)) {
                    Files.deleteIfExists(file);
                }
            } catch (Exception ignored) {
                // Cleanup should not hide the original error.
            }
        }
    }
}
