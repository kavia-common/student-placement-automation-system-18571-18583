# Placement Frontend (React)

Elegant, responsive frontend for Student Placement Automation System following the Ocean Professional style guide.

## Features
- Student and Staff authentication (sign in and registration)
- Student profile management with validation and document uploads (modal)
- Staff dashboard to define criteria and view filtered/shortlisted students (by department)
- Vertical sidebar layout, gradient header, reusable components (FormField, Modal, Sidebar, ProtectedRoute)
- Centralized API service with HTTP requests to placement_backend
- Ocean Professional theme using soft pastels, gradients, rounded components

## Getting Started
1) Install dependencies:
   npm install

2) Configure environment variables:
   cp .env.example .env
   # Set REACT_APP_API_BASE_URL to your backend URL

3) Run the app:
   npm start

## Environment
- REACT_APP_API_BASE_URL: Base URL of placement_backend
- REACT_APP_SITE_URL: Public site URL for email redirects (if needed)

## Code Structure
- src/styles/theme.css: Global theme and components
- src/services/api.js: API client and endpoint stubs
- src/context/AuthContext.js: Auth state provider
- src/components/: Reusable UI components
- src/pages/auth/: Auth pages (SignIn, RegisterStudent, RegisterStaff)
- src/pages/student/: StudentDashboard with profile and uploads
- src/pages/staff/: StaffDashboard with criteria and lists

## Integration Notes
- Replace endpoint paths in src/services/api.js with backend routes.
- Token-based auth uses Authorization: Bearer <token>.
- For file uploads, FormData is used with multipart/form-data.
