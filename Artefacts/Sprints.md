# StayPal – Sprint 1 Backlog

**Sprint Goal:** Database formation, user authentication (login/signup), landing page, and visible user profile.  
**Duration:** 21/09/2025 – 28/09/2025  

## Sprint Tasks

| Task | Status |
|------|--------|
| Setup project repository | Done |
| Setup database schema and connection | Done |
| Implement signup form (email, password, confirm password) | Done |
| Add input validation (unique email) | Done |
| Encrypt passwords (bcrypt) | Done |
| Implement login form with error handling | Done |
| Apply CAPTCHA for signup/login | Pending |
| Setup session/JWT management | Done |
| Create landing page design + navigation | Done |
| Add CSS styling for responsiveness | Done |
| Document Functional/Non-Functional Requirements (FR/NFR) | Done |
| Write MoM and update progress | Done |

## Notes
- Sprint 1 started after the 21st Sept meeting where tasks were divided.  
- Goal is to complete by 21st Sept for mid evaluation.  
- Conflicts will be handled in later sprints.  
- All members must commit their own contributions to GitHub.  
- The Scrum Master (Aayman) is tracking progress and updating MoMs.  

--

# Sprint 2 Backlog  

**Sprint Goal:**  
Complete the user profile and property listing modules, integrate header and footer into login and signup pages, and resolve OTP generation and hosting issues.  

**Duration:** 09/10/2025 – 15/10/2025  

## Sprint Tasks  

| Task | Status |
|------|--------|
| Finalize Login and Signup page design | Done |
| Add Header and Footer to Login and Signup pages | Done |
| Implement Google Sign-in and Forgot Password functionality | Postponed |
| Create Tenant Profile module (Name, Gender, Nationality, Occupation, DOB, Hometown, Dietary Preference – Veg/Non-Veg/Jain, Religion, Alcohol, Smoker/Non-Smoker, Hobbies) | Done |
| Create Property Owner Profile module (Name, Property Size, BHK, Age of Construction, Furnishing Type, Parking, Amenities, Nearby Landmarks, Maximum Occupancy, Total Rent) | Done |
| Debug OTP generation issue during signup | Done |
| Set up Git on all members’ laptops | Done |
| Begin testing login, signup, and profile modules | Done |
| Decide on design team structure | Done |

## Notes
- Sprint 2 focused on **frontend-backend integration** and **enhancing user interaction** through profile and listing modules.  
- The team also addressed **technical issues** like OTP errors and hosting bugs.  
- Git was configured across all systems for better collaboration.  
- The discussion on whether to separate or merge UI/UX and CSS teams will be finalized in consultation with TA/Professor.  
- The Sprint aimed to complete all user-facing components required for a functional prototype before moving to Sprint 3 (Matching & Communication).  

## Key Deliverables
- Functional and styled Login & Signup pages with header and footer.  
- Working user profile forms for both Tenant and Property Owner.  
- Partial backend integration for authentication and profile data.  
- Git-enabled collaboration setup.  
- Bug identification (OTP issue) and deployment fixes completed.  

## Scrum Master Notes
- Scrum Master (Aayman) tracked progress, wrote MoMs, and ensured documentation consistency.  
- The team was coordinated for testing and deployment cycles.  
- Sprint 3 will focus on finishing remaining property listing functionalities and starting matching logic.

 ---
  
#  Sprint 3 Backlog  

**Linked EPIC:** EPIC 3 – Feature-Based Search (Filters)  
**Sprint Goal:**  
Implement the feature-based search module that allows tenants to search for flats or flatmates using customizable filters such as budget, location, gender, lifestyle choices, and amenities. Display results dynamically according to preferences.  

**Duration:** 24/10/2025 – 28/10/2025  

## Sprint Tasks  

| Task | Status |
|------|--------|
| Design and integrate search bar with filter options (budget, location, gender, lifestyle, amenities) | In Progress |
| Create backend logic for filtering property and roommate listings based on user input | In Progress |
| Add option for users to choose whether they are searching for a **flat**, **flatmate**, or **both** | Pending |
| Implement dynamic rendering of filtered search results | Pending |
| Connect search filters to existing property database | In Progress |
| Test and validate search accuracy for multiple filter combinations | Pending |
| Optimize search response time and handle empty-result cases | Pending |

## Notes  
- Sprint 3 directly derives from **EPIC 3**, focusing on building filtering and recommendation logic.  
- Search results should be dynamic — updating instantly when the user changes a filter.  
- The filter system will also help resolve earlier user-experience gaps noted in Sprint 2 (e.g., finding relevant listings faster).  
- Once implemented, this module will form the foundation for the future **NLP-based smart search** planned in EPIC 5.  

## Key Deliverables  
- Functional search component integrated into the main website.  
- Filter options for budget, location, gender, lifestyle, and amenities.    
- Working backend logic for query filtering.  

## Scrum Master Notes  
- Scrum Master (Aayman) tracked Sprint 3 progress and coordinated between frontend and backend integration.  
- Collaboration emphasized between backend (Krish, Yogesh, Meet and Aayman) and frontend (Kosha, Shambhavi, Heet, Harshil and Namra).  
- Sprint 4 will extend this work with user-to-user matching and chat functionality.

---

# Sprint 4 Backlog  

**Linked EPIC:** EPIC 6 – Admin Management  
**Sprint Goal:**  
Develop and integrate the Admin Panel to manage users, property listings, and maintain system integrity.  

**Duration:** 06/11/2025 – 09/11/2025  

## Sprint Tasks  

| Task | Status |
|------|--------|
| Design Admin Dashboard layout and navigation panel | In Progress |
| Implement Admin login authentication and access control | In Progress |
| Create CRUD operations for user management (view, delete, ban, unban) | Pending |
| Enable property listing moderation and approval workflow | Pending |
| Add feature to view bug reports and system logs | Pending |
| Integrate Admin database schema with existing user tables | In Progress |
| Test Admin login and permission access across roles (Admin/User) | Pending |
| Prepare documentation for Admin module functionalities | Pending |

## Notes  
- Sprint 4 was prioritized before EPIC 4 due to uncertainty in NLP module development.  
- Focused on building stable control features critical for mid-evaluation and internal testing.  
- Admin panel ensures moderation, monitoring, and management capabilities.  

## Key Deliverables  
- Functional Admin Dashboard with secure login and role restriction.  
- CRUD management for users and property listings.  
- Integrated database between Admin and User schemas.  

## Scrum Master Notes  
- Scrum Master (Aayman) tracked sprint progress and coordinated frontend–backend integration.  
- Ensured testing of role-based permissions and Admin access.  
- Addressed dependencies and sequencing between Admin and Notification modules.  
  
---

# Sprint 5 Backlog  

**Linked EPIC:** EPIC 4 – Notification System  
**Sprint Goal:**  
Implement the notification system to improve communication between tenants and property owners, supporting message alerts and request updates.  

**Duration:** 09/11/2025 – 12/11/2025  

## Sprint Tasks  

| Task | Status |
|------|--------|
| Design notification UI banners and popup templates | In Progress |
| Create backend API for sending and receiving notifications | In Progress |
| Implement event-based triggers (e.g., new message, request approval) | Pending |
| Add real-time notification display on dashboard | Pending |
| Integrate database table for notification storage and read/unread status | Pending |
| Add “Mark as Read” and “Delete Notification” functionalities | Pending |
| Test notification delivery flow (frontend + backend) | Pending |
| Update module documentation and architecture diagrams | Pending |

## Notes  
- Sprint 5 followed EPIC 6 due to dependency on Admin stability and pending NLP module testing.  
- Notifications ensure user engagement and better interaction between tenants and property owners.  
- This sprint establishes the foundation for future chat and NLP-driven features.  

## Key Deliverables  
- Working backend API for notification creation and delivery.  
- Real-time frontend notification display integrated with user dashboard.  
- Database schema for storing, retrieving, and updating notifications.  

## Scrum Master Notes  
- Scrum Master (Aayman) coordinated integration between frontend (UI notifications) and backend (API triggers).  
- Managed database linkage with user profiles for personalized alerts.  
- Focused on modular design to ensure easy scalability for future chat/NLP extensions.  

---






