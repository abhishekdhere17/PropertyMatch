package com.propertymatch.property;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByStatus(ListingStatus status);
    List<Property> findByStatusAndListingType(ListingStatus status, ListingType listingType);
    List<Property> findByStatusAndCityContainingIgnoreCase(ListingStatus status, String city);
    List<Property> findByOwnerId(Long ownerId);
}
