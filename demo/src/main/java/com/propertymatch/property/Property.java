package com.propertymatch.property;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @NotBlank @Column(nullable = false, length = 2000)
    private String description;

    @NotBlank @Column(nullable = false, length = 100)
    private String city;

    @NotBlank @Column(nullable = false, length = 180)
    private String address;

    @NotNull @DecimalMin("0.01") @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal price;

    @NotNull @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private ListingType listingType;

    @NotNull @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
    private PropertyType propertyType;

    @Min(0) private Integer bedrooms = 0;
    @Min(0) private Integer bathrooms = 0;
    @Min(0) private Integer areaSqft = 0;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Long ownerId = 1L;

    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private ListingStatus status = ListingStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        if (status == null) status = ListingStatus.PENDING;
        if (ownerId == null) ownerId = 1L;
    }

    @PreUpdate
    void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public ListingType getListingType() { return listingType; }
    public void setListingType(ListingType listingType) { this.listingType = listingType; }
    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }
    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }
    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }
    public Integer getAreaSqft() { return areaSqft; }
    public void setAreaSqft(Integer areaSqft) { this.areaSqft = areaSqft; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
