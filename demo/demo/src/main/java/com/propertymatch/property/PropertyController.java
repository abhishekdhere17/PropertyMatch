
package com.propertymatch.property;

import com.propertymatch.user.User;
import com.propertymatch.user.UserRepository;
import com.propertymatch.user.UserRole;

import jakarta.validation.Valid;
import jakarta.validation.Validator;
import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyRepository repository;
    private final UserRepository userRepository;
    private final PropertyImageStorageService imageStorage;
    private final Validator validator;

    public PropertyController(
            PropertyRepository repository,
            UserRepository userRepository,
            PropertyImageStorageService imageStorage,
            Validator validator) {

        this.repository = repository;
        this.userRepository = userRepository;
        this.imageStorage = imageStorage;
        this.validator = validator;
    }

    @GetMapping
    public List<PropertyResponse> getApproved(
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) String city) {

        List<Property> properties;

        if (listingType != null && city != null && !city.isBlank()) {
            properties = repository
                    .findByStatusAndListingTypeAndCityContainingIgnoreCase(
                            ListingStatus.APPROVED, listingType, city.trim());
        } else if (listingType != null) {
            properties = repository.findByStatusAndListingType(
                    ListingStatus.APPROVED, listingType);
        } else if (city != null && !city.isBlank()) {
            properties = repository.findByStatusAndCityContainingIgnoreCase(
                    ListingStatus.APPROVED, city.trim());
        } else {
            properties = repository.findByStatus(ListingStatus.APPROVED);
        }

        return properties.stream()
                .map(this::toPropertyResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public PropertyResponse getOne(@PathVariable Long id) {

        Property property = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Property not found"));

        if (property.getStatus() != ListingStatus.APPROVED) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Property not found");
        }

        return toPropertyResponse(property);
    }

    private PropertyResponse toPropertyResponse(Property property) {

        User owner = userRepository.findById(property.getOwnerId())
                .orElse(null);

        String ownerName = owner != null
                ? owner.getFullName()
                : "Property Owner";

        String ownerPhone = owner != null
                ? owner.getPhone()
                : null;

        return PropertyResponse.from(property, ownerName, ownerPhone);
    }

    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public PropertyResponse create(
            @Valid @RequestPart("property") Property property,
            @RequestPart(value = "images", required = false)
                    List<MultipartFile> images,
            Authentication authentication) {

        User user = getCurrentUser(authentication);
        requireSellerOrAdmin(user);

        var validationErrors = validator.validate(property);

        if (!validationErrors.isEmpty()) {
            String message = validationErrors.stream()
                    .map(error -> error.getPropertyPath() + ": " + error.getMessage())
                    .collect(Collectors.joining(", "));

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, message);
        }
     User currentUser = getCurrentUser(authentication);
        property.setOwnerId(currentUser.getId());
        property.setStatus(ListingStatus.PENDING);
        property.setImageUrl(null);
        property.setImages(new ArrayList<>());
        Property savedProperty = repository.saveAndFlush(property);

        List<String> savedImageUrls = imageStorage.saveImages(images);

        try {
            savedProperty.setImages(savedImageUrls);
            Property finalProperty = repository.save(savedProperty);

            return toPropertyResponse(finalProperty);

        } catch (RuntimeException exception) {
            imageStorage.deleteImages(savedImageUrls);
            throw exception;
        }
    }

    @PutMapping("/{id}")
    public Property update(
            @PathVariable Long id,
            @Valid @RequestBody Property input,
            Authentication authentication) {

        User user = getCurrentUser(authentication);
        requireSellerOrAdmin(user);

        Property existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Property not found"));

        if (!isAdmin(user) &&
                !user.getId().equals(existing.getOwnerId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot edit another user's property");
        }

        existing.setTitle(input.getTitle());
        existing.setDescription(input.getDescription());
        existing.setCity(input.getCity());
        existing.setAddress(input.getAddress());
        existing.setPrice(input.getPrice());
        existing.setListingType(input.getListingType());
        existing.setPropertyType(input.getPropertyType());
        existing.setBedrooms(input.getBedrooms());
        existing.setBathrooms(input.getBathrooms());
        existing.setAreaSqft(input.getAreaSqft());
        existing.setImageUrl(input.getImageUrl());

        if (!isAdmin(user)) {
            existing.setStatus(ListingStatus.PENDING);
        }

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getCurrentUser(authentication);
        requireSellerOrAdmin(user);

        Property property = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Property not found"));

        if (!isAdmin(user) &&
                !user.getId().equals(property.getOwnerId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot delete another user's property");
        }

        imageStorage.deleteImages(property.getImages());
        repository.delete(property);
    }

    private User getCurrentUser(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User account not found"));
    }

    private void requireSellerOrAdmin(User user) {

        if (user.getRole() != UserRole.SELLER && !isAdmin(user)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Seller access or administrator access is required");
        }
    }

    private boolean isAdmin(User user) {
        return user.getRole() == UserRole.ADMIN ||
                user.getRole() == UserRole.MAIN_ADMIN;
    }
}
