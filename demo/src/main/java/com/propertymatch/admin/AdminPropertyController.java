package com.propertymatch.admin;

import com.propertymatch.property.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/properties")
public class AdminPropertyController {
    private final PropertyRepository repository;

    public AdminPropertyController(PropertyRepository repository) {
        this.repository = repository;
    }

    // Development scaffold only: add MAIN_ADMIN/ADMIN authentication before using this route.
    @GetMapping
    public List<Property> getAll() {
        return repository.findAll();
    }

    // Development scaffold only: add admin authorization before using this route.
    @PatchMapping("/{id}/status")
    public Property updateStatus(@PathVariable Long id, @RequestParam ListingStatus status) {
        Property property = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Property not found"));
        property.setStatus(status);
        return repository.save(property);
    }
}
