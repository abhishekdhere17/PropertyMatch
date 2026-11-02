
package com.propertymatch.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.propertymatch.property.ListingStatus;
import com.propertymatch.property.Property;
import com.propertymatch.property.PropertyRepository;

@RestController
@RequestMapping("/api/admin/properties")
public class AdminPropertyController {

    private final PropertyRepository repository;

    public AdminPropertyController(PropertyRepository repository) {
        this.repository = repository;
    }

    // View all properties. SecurityConfig protects /api/admin/**.
    @GetMapping
    public List<Property> getAll() {
        return repository.findAll();
    }

    // View properties waiting for admin review.
    @GetMapping("/pending")
    public List<Property> getPending() {
        return repository.findByStatus(ListingStatus.PENDING);
    }

    // Approve or reject a property.
    @PatchMapping("/{id}/status")
    public Property updateStatus(
            @PathVariable Long id,
            @RequestParam ListingStatus status) {

        if (status != ListingStatus.APPROVED
                && status != ListingStatus.REJECTED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status must be APPROVED or REJECTED");
        }

        Property property = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Property not found"));

        property.setStatus(status);
        return repository.save(property);
    }

    // Permanently delete a property as an authorized admin.
    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public org.springframework.http.ResponseEntity<Void> deleteProperty(
            @PathVariable Long id) {

        Property property = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Property not found"));

        repository.delete(property);

        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
