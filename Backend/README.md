# PropertyMatch Backend (starter)

## Does Spring Initializr work without a globally installed Maven?
Yes. Downloading a Spring Initializr ZIP works. If it includes the Maven Wrapper (`mvnw`, `mvnw.cmd`, and `.mvn/wrapper/`), use the wrapper instead of installing Maven globally. This starter ZIP is a source project and does not include wrapper binaries; the easiest approach is to generate the project on start.spring.io and copy its `mvnw`, `mvnw.cmd`, and `.mvn/wrapper/` into this project, or install Maven if possible.

## Generate/download with Spring Initializr
- Project: Maven
- Language: Java
- Spring Boot: select a stable 3.x release compatible with Java 17
- Group: `com.propertymatch`
- Artifact: `propertymatch-backend`
- Packaging: Jar
- Java: 17
- Dependencies: Spring Web, Spring Data JPA, MySQL Driver, Validation
- Download ZIP and extract it.
- You may either use the generated project, or copy the wrapper files into this project.

## Database
1. Start MySQL from XAMPP.
2. Open phpMyAdmin at http://localhost/phpmyadmin.
3. Select Import and import `database/propertymatch.sql`, or paste its SQL into the SQL tab.
4. Default connection is `root` with an empty password. Change `DB_USERNAME`/`DB_PASSWORD` or the values in `application.properties` if yours differ.

## Run on macOS
From the project directory, if Maven Wrapper is present:
```bash
chmod +x mvnw
./mvnw spring-boot:run
```
If you installed Maven:
```bash
mvn spring-boot:run
```
If neither Maven nor wrapper is available, generate/download the project with wrapper from Spring Initializr and copy its wrapper files into this folder.

## Test
- `GET http://localhost:8080/api/properties` returns approved listings.
- `GET http://localhost:8080/api/admin/properties` returns all listings for development/testing.
- `PATCH http://localhost:8080/api/admin/properties/1/status?status=APPROVED` approves listing 1.
- `POST http://localhost:8080/api/properties` creates a pending listing.

Example POST JSON:
```json
{
  "title": "2 BHK apartment in Pune",
  "description": "Bright apartment near transit and schools.",
  "city": "Pune",
  "address": "Wakad, Pune",
  "price": 7500000,
  "listingType": "BUY",
  "propertyType": "APARTMENT",
  "bedrooms": 2,
  "bathrooms": 2,
  "areaSqft": 1050,
  "imageUrl": "https://example.com/property.jpg",
  "ownerId": 1
}
```

## Important limitations
This is the first backend scaffold, not production-ready. Authentication/JWT, user registration, roles, seller approval requests, secure admin endpoints, real file upload, saved properties, enquiries, and Smart Match scoring still need to be implemented. The current admin routes are deliberately unprotected for local testing only; do not deploy or expose this API publicly until authorization is added. The `imageUrl` field stores a URL/path only, it does not upload image bytes.
