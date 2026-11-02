package com.propertymatch.property;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByStatusAndListingTypeAndCityContainingIgnoreCase(
        ListingStatus status,
        ListingType listingType,
        String city);
    List<Property> findByStatus(ListingStatus status);
    List<Property> findByStatusAndListingType(ListingStatus status, ListingType listingType);
    List<Property> findByStatusAndCityContainingIgnoreCase(ListingStatus status, String city);
    List<Property> findByOwnerId(Long ownerId);
}
