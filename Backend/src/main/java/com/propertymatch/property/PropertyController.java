package com.propertymatch.property;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {
    private final PropertyRepository repository;

    public PropertyController(PropertyRepository repository) {
        this.repository = repository;
    }

    // Public property search returns approved listings only.
    @GetMapping
    public List<Property> getApproved(
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) String city) {
        if (listingType != null) {
            return repository.findByStatusAndListingType(ListingStatus.APPROVED, listingType);
        }
        if (city != null && !city.isBlank()) {
            return repository.findByStatusAndCityContainingIgnoreCase(ListingStatus.APPROVED, city.trim());
        }
        return repository.findByStatus(ListingStatus.APPROVED);
    }

    @GetMapping("/{id}")
    public Property getOne(@PathVariable Long id) {
        Property property = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));
        if (property.getStatus() != ListingStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found");
        }
        return property;
    }

    // Development scaffold only: ownerId/status must be protected by authentication before production.
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Property create(@Valid @RequestBody Property property) {
        property.setStatus(ListingStatus.PENDING);
        if (property.getOwnerId() == null) property.setOwnerId(1L);
        return repository.save(property);
    }

    // Development scaffold only: secure this endpoint with seller/admin authorization before production.
    @PutMapping("/{id}")
    public Property update(@PathVariable Long id, @Valid @RequestBody Property input) {
        Property existing = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));
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
        return repository.save(existing);
    }

    // Development scaffold only: secure this endpoint with owner/admin authorization before production.
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found");
        }
        repository.deleteById(id);
    }
}
