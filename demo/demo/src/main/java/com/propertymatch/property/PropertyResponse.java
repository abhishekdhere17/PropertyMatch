
package com.propertymatch.property;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PropertyResponse(
        Long id,
        String title,
        String description,
        String city,
        String address,
        BigDecimal price,
        ListingType listingType,
        PropertyType propertyType,
        Integer bedrooms,
        Integer bathrooms,
        Integer areaSqft,
        String imageUrl,
        List<String> images,
        Long ownerId,
        ListingStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        OwnerContact owner
) {

    public record OwnerContact(
            String name,
            String phone
    ) {
    }

    public static PropertyResponse from(
            Property property,
            String ownerName,
            String ownerPhone) {

        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getCity(),
                property.getAddress(),
                property.getPrice(),
                property.getListingType(),
                property.getPropertyType(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getAreaSqft(),
                property.getImageUrl(),
                property.getImages(),
                property.getOwnerId(),
                property.getStatus(),
                property.getCreatedAt(),
                property.getUpdatedAt(),
                new OwnerContact(ownerName, ownerPhone)
        );
    }
}
