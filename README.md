# 🏡 PropertyMatch – Smart Real Estate Platform

PropertyMatch is a full-stack real estate web application designed to 
simplify property discovery for users looking to buy or rent properties.

Users can explore property listings, view detailed information and images, 
and discover relevant properties through the SmartMatch feature. The 
platform also provides property management functionality for sellers and 
an admin approval workflow.

## 🚀 Key Features

### 🏠 Property Discovery
- Browse properties for buying and renting.
- View property details, pricing, location, and images.
- Explore approved property listings.

### 🎯 SmartMatch
- Discover properties based on user preferences.
- Explore relevant properties from available approved listings.

### 🔐 Authentication and Security
- JWT-based authentication.
- Spring Security integration.
- Role-based access control.
- Protected admin APIs.

### 🏢 Seller Functionality
- Create property listings.
- Upload multiple property images.
- Manage property listings.

### 🛡️ Admin Functionality
- Review property submissions.
- Manage listing approval status.
- Control access to admin APIs.

### 📸 Image Management
- Multiple property image uploads.
- Local image file storage.
- Display images on property cards and detail pages.

## 🛠️ Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| UI | HTML5, CSS3 |
| API Integration | Axios, REST APIs |
| Backend | Java 17, Spring Boot |
| Security | Spring Security, JWT |
| Database | MySQL |
| ORM | Spring Data JPA, Hibernate |
| Build Tool | Maven |
| Tools | VS Code, Postman, Git, GitHub |

## 🏗️ Project Architecture

```text
PropertyMatch
│
├── Frontend
│   └── React.js + Vite
│       ├── User Interface
│       ├── Property Listings
│       ├── SmartMatch
│       ├── Authentication
│       └── API Integration
│
└── Backend
    └── Spring Boot
        ├── REST Controllers
        ├── Service Layer
        ├── Repository Layer
        ├── Spring Security + JWT
        ├── JPA Entities
        └── MySQL Database
