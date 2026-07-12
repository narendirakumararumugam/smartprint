# SmartPrint

SmartPrint is a full-stack print-on-demand marketplace designed to connect customers with local print shops through a smooth, modern digital experience. The platform supports customer ordering, shop management, owner analytics, and admin oversight in a single system.

This project was built to demonstrate end-to-end product development skills, including modern frontend architecture, secure backend services, database integration, real-time updates, and role-based access control.

## Why this project stands out

- Built as a complete full-stack application rather than a single-page demo
- Implements role-based experiences for customers, shop owners, and administrators
- Includes real-world workflows such as file upload, order placement, shop discovery, and order tracking
- Designed with a clean modular structure that is easy to extend and maintain
- Demonstrates practical use of modern web technologies and API integration

## Core features

### Customer experience
- Discover nearby print shops through a location-aware interface
- Browse shops, view details, and save favorite businesses
- Upload print files and configure print options
- Place and manage orders from a streamlined workflow
- Access account and order history through a dedicated profile area

### Shop owner experience
- Manage shop profile and settings
- Monitor printer availability and shop status
- Review and manage incoming orders
- Track business insights through an analytics dashboard

### Admin experience
- Manage users, shops, and orders
- Review verifications and audit logs
- Monitor platform-level operations through a dedicated admin dashboard

## Tech stack

### Frontend
- Angular 17
- TypeScript
- Bootstrap and custom UI styling
- Leaflet for map-based shop discovery
- RxJS for reactive state and asynchronous flows

### Backend
- Java with Spring Boot
- Spring Security with JWT authentication
- Spring Data JPA and PostgreSQL
- GraphQL and OpenAPI support
- WebSocket support for real-time updates
- GraphHopper for location-based mapping capabilities

## Project structure

- client-app: Angular frontend application
- server-app/smartservice: Spring Boot backend service

## Getting started

### Prerequisites
- Node.js and npm
- Java 25
- Maven
- PostgreSQL

### Frontend setup
```bash
cd client-app
npm install
npm start
```

The frontend will run at http://localhost:4200.

### Backend setup
```bash
cd server-app/smartservice
./mvnw spring-boot:run
```

The backend service will start with the configured PostgreSQL connection and expose the API layer for the frontend.

### Database configuration
Create a PostgreSQL database named smartprint and ensure the credentials in the backend configuration match your local environment.

## Development notes

The application is structured to reflect a production-style architecture with separate concerns for:
- UI and routing
- authentication and authorization
- API services and shared models
- owner/admin business workflows
- backend persistence and security

## Future enhancements

Potential improvements for the next iteration include:
- payment integration
- order status notifications
- enhanced analytics and reporting
- mobile-first UI refinements
- automated testing coverage

## Portfolio summary

SmartPrint is a strong example of a practical, user-focused full-stack application that combines modern UI development with a scalable backend foundation. It is well-suited for showcasing skills in product thinking, software architecture, API design, and real-world application development.
