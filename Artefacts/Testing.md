# StayPal – Testing Report  

**Course:** IT314 – Software Engineering  
**Project Name:** StayPal  
**Module:** Signup (Registration)  
**Sprint Covered:** Sprint 1 – Sprint 3  
**Prepared By:** Aayman (Scrum Master)  
**Date:** 02/11/2025  

## 1. Objective  
The objective of this testing phase is to validate the functionality, security, and input validation of the **Signup Module** in StayPal.  
Testing ensures that new users can register smoothly using valid data while preventing invalid or duplicate entries.  

## 2. Scope  
This report focuses exclusively on the **Signup process**, including:  
- Landing Page redirection  
- Valid and invalid registration  
- OTP generation and validation  
- Input field validations (email, password, username)  
- Security tests such as OTP expiry and field length restrictions  

## 3. Testing Type  
| Type | Description | Example |
|------|--------------|----------|
| **Functional Testing** | Ensures main signup process works correctly | Valid signup, OTP generation |
| **Validation Testing** | Checks input fields for errors and constraints | Invalid email, password mismatch, input length |
| **UI Testing** | Verifies messages, field highlighting, and navigation | Alerts, tooltip messages |
| **Security Testing** | Tests OTP expiry and duplicate user handling | OTP expiry after 5 mins |
| **Edge Case Testing** | Evaluates unusual or extreme inputs | Long email/username, invalid characters |

## 4. Test Cases  

###  Signup Module Test Scenarios (T1–T17)

| Test ID | Scenario | Input | Expected Result | Actual Result | Status |
|----------|-----------|--------|------------------|----------------|---------|
| **T1** | Navigation from Landing Page | Clicked “Get Started” | Redirects to Signup page | Redirected successfully |  Pass |
| **T2** | Valid signup | `user001@gmail.com` + `Test@123` | OTP received on mail | OTP generated successfully |  Pass |
| **T3** | Enter valid OTP | Entered received OTP | Display “Signup successful” | Message shown correctly |  Pass |
| **T4** | Redirection after signup | Clicked “Close” on popup | Redirect to login/profile page | Redirected correctly | Pass |
| **T5** | Signup with existing email | Reused same email | Should show “Email already registered” | Displayed alert “Email is already registered” | Pass |
| **T6** | Invalid email format | `user.com` | Should show “Invalid email format” | Tooltip: “Enter an email address” |  Pass |
| **T7** | Password mismatch | Password: `Test@123`, Confirm: `Test@12` | Should show “Passwords do not match” | Displayed “Passwords do not match!” |  Minor logic issue |
| **T8** | Incorrect OTP | Entered wrong OTP | Show “Incorrect OTP” | Displayed “Incorrect OTP provided” |  Pass |
| **T9** | Resend OTP and reuse old one | Clicked “Resend OTP”, used old OTP | Should show “Incorrect OTP” | Displayed “Incorrect OTP provided” |  Pass |
| **T10** | Username with special characters | `#User2025` | Should reject or sanitize | Accepted special characters |  Improvement needed |
| **T11** | Username exceeding 12 characters | Enter username >12 chars | Should show “Username too long” | Validation message displayed correctly |  Pass |
| **T12** | Password exceeding 12 characters | Enter password >12 chars | Should show “Password too long” | Validation message displayed correctly |  Pass |
| **T13** | Email exceeding 160 characters | Enter long email (>160 chars) | Should show “Email too long” | Validation message displayed correctly |  Pass |
| **T14** | OTP expiry after 5 minutes | Waited >5 min and entered OTP | Should show “OTP expired” | Displayed “OTP expired” |  Pass |
| **T15** | Invalid email with special symbol | `#user@gmail.com` | Should reject invalid email | Sent OTP successfully |  Validation bug |
| **T16** | Case sensitivity test (uppercase email) | `USER001@gmail.com` | Should accept (case-insensitive) | OTP sent successfully |  Pass |
| **T17** | Mixed-case email test | `UsEr001@GmAiL.CoM` | Should behave same as lowercase | OTP sent successfully |  Pass |

## 5. Bug Report  

| Bug ID | Description | Type | Severity | Status |
|--------|--------------|-------|-----------|---------|
| **B1** | Validation order issue – password mismatch checked before email duplication | Logic | Minor | Open |
| **B2** | Username allows special characters | Validation | Minor | Open |
| **B3** | Email validation allows invalid special characters at start | Validation | Moderate | Open |

## 6. Observations  
- OTP system and email delivery working accurately.  
- Email, password, and username length limits implemented successfully.  
- Duplicate email registration blocked effectively.  
- OTP expiry correctly enforced after 5 minutes.  
- Username still accepts special characters – requires sanitization.  
- Browser and backend validations complement each other well.  

## 7. Conclusion  
The Signup Module is **functionally correct and secure**, with OTP and duplicate-prevention logic working as intended.  
Length restrictions for email (160 chars), username (12 chars), and password (12 chars) were tested successfully and behave as expected.  
Minor improvements recommended for frontend validation messages and username sanitization.  

**Module Prepared & Documented By:**  
Aayman Ammar Shams (202301082)

--

## Login Module  

### 1. Objective  
The objective of this testing phase is to validate the **Login Module** of StayPal.  
Testing ensures that only registered users can successfully log in, that invalid credentials are rejected, and that input validation and error messages are displayed accurately.  

### 2. Scope  
This report focuses on the **Login functionality** of StayPal, covering:  
- Validation of registered user login  
- Handling of incorrect email or password  
- Case sensitivity of email inputs  
- Frontend field validation (empty fields)  
- Input length and format constraints  

### 3. Testing Type  

| Type | Description | Example |
|------|--------------|----------|
| **Functional Testing** | Ensures valid and invalid login actions behave correctly | Correct and incorrect email/password combinations |
| **Validation Testing** | Checks field restrictions and browser validation | Empty fields, invalid email format |
| **UI Testing** | Ensures correct error messages and form prompts | Alerts, tooltip messages |
| **Security Testing** | Ensures only registered users can access system | Unregistered email and wrong password |
| **Edge Case Testing** | Evaluates input behavior for limits and unexpected inputs | Long email or password fields |

### 4. Test Cases  

####  Login Module Test Scenarios (T18–T26)

| **Test ID** | **Scenario** | **Input / Action** | **Expected Result** | **Actual Result** | **Status** |
|--------------|--------------|--------------------|----------------------|------------------|-------------|
| **T18** | Valid login | Email: `user001@gmail.com` <br> Password: `Test@123` | Redirects to homepage/dashboard | Successfully logged in |  Pass |
| **T19** | Invalid password | Email: `user001@gmail.com` <br> Password: `Wrong@123` | “Incorrect password” message displayed | Message displayed correctly |  Pass |
| **T20** | Unregistered email | Email: `random@gmail.com` | “Email not found in database” | Message displayed correctly |  Pass |
| **T21** | Invalid email format | Email: `user@com` | “Enter valid email address” tooltip | Browser tooltip displayed |  Pass |
| **T22** | Empty fields | Leave both fields blank and click Login | Browser prompts user to fill fields | “Fill out this field” prompt shown |  Pass |
| **T23** | Case sensitivity of email | Email: `USER001@gmail.com` <br> Password: `Test@123` | Should still log in (case-insensitive email) | Login successful |  Pass |
| **T24** | Email with spaces before/after | `"  user001@gmail.com  "` | Should trim spaces and log in | Works correctly |  Pass |
| **T25** | Password exceeding 12 characters | Enter 13+ character password | Should show “Password too long” | Validation message displayed correctly |  Pass |
| **T26** | Email exceeding 160 characters | Enter email >160 chars | Should show “Email too long” | Validation message displayed correctly |  Pass |

### 5. Bug Report  

| **Bug ID** | Description | Type | Severity | Status |
|-------------|-------------|------|-----------|---------|
| **B1** | Browser handles most field validations; backend validations minimal | Validation | Minor | Open |
| **B2** | Error messages not standardized (different wording for same issues) | UI | Minor | Open |
| **B3** | No feedback delay or cooldown after multiple wrong attempts | Security | Low | Open |

### 6. Observations  
- Login module successfully authenticates registered users and blocks invalid ones.  
- Case-insensitive email recognition works correctly.  
- Email and password length limits (160 and 12 characters) implemented successfully.  
- Browser manages empty field and format validation effectively.  
- Error messages appear promptly but could be standardized for consistency.  
- No rate-limiting or lockout mechanism implemented yet — acceptable for prototype phase.  

### 7. Conclusion  
The **Login Module** of StayPal meets all its functional and validation goals:  
- Correctly identifies registered users and handles invalid credentials gracefully.  
- Input length restrictions and field validations work as expected.  
- Browser-managed empty-field and email-format prompts enhance user experience.  

**Module Prepared & Documented By:**  
Aayman Ammar Shams (202301082)

--

## Forgot Password Module  

### 1. Objective  
To validate the **Forgot Password** workflow of StayPal, ensuring users can securely reset their password using an OTP sent to their registered email.  
Testing also verifies proper error handling for invalid, unregistered, and expired inputs.

### 2. Scope  
This module covers:  
- Email verification before sending OTP  
- Case sensitivity and format validation  
- OTP generation, validation, and expiry  
- Password reset logic and mismatched password handling  

### 3. Testing Type  

| Type | Description | Example |
|------|--------------|----------|
| **Functional Testing** | Ensures OTP and password reset work correctly | Correct OTP + valid password reset |
| **Validation Testing** | Checks invalid email, empty fields, mismatched passwords | Wrong OTP, empty email, invalid format |
| **UI Testing** | Ensures correct feedback messages | Alerts, success popups |
| **Security Testing** | Tests OTP expiry and registered-user verification | Expired OTP after 5 min |
| **Edge Case Testing** | Unusual inputs or combined invalid conditions | Expired OTP + mismatched password |

### 4. Test Cases  

####  Forgot Password Module Test Scenarios (T25–T37)

| **Test ID** | **Scenario** | **Input / Action** | **Expected Result** | **Actual Result** | **Status** |
|--------------|--------------|--------------------|----------------------|------------------|-------------|
| **T25** | Valid registered email | `user001@gmail.com` | OTP sent to user’s email | “OTP sent to your email!” shown |  Pass |
| **T26** | Unregistered email | `randomuser@gmail.com` | “Email not registered” | Displayed correctly |  Pass |
| **T27** | Invalid email format | `$user001@gmail.com` | “Invalid email” | Shows “Email not registered” instead |  Minor issue |
| **T28** | Email in uppercase | `USER001@GMAIL.COM` | Should send OTP (case-insensitive) | Shows “Email not registered” – case-sensitive |  Improvement needed |
| **T29** | Empty email field | Leave blank and click “Send OTP” | Browser prompts to fill field | “Fill out this field” prompt shown |  Pass |
| **T30** | Email with leading/trailing spaces | `"  user001@gmail.com  "` | Should trim spaces and send OTP | Works correctly |  Pass |
| **T31** | College domain email | `202301082@dau.ac.in` | Should send OTP successfully | OTP sent successfully |  Pass |
| **T32** | Valid OTP + matching passwords | Correct OTP + matching “New Password” & “Confirm Password” | “Password reset successful” + redirect | Message displayed correctly |  Pass |
| **T33** | Incorrect OTP + matching passwords | Wrong OTP + matching passwords | “Incorrect OTP provided” | Displayed correctly |  Pass |
| **T34** | Incorrect OTP + non-matching passwords | Random OTP + different passwords | Preferably “Incorrect OTP” | Shows “Passwords do not match” first |  Minor logic issue |
| **T35** | Correct OTP + non-matching passwords | Correct OTP + different passwords | “Passwords do not match” | Displayed correctly |  Pass |
| **T36** | Expired OTP + matching passwords | Expired OTP (>5 min) + matching passwords | “OTP expired” | “OTP provided is expired” shown |  Pass |
| **T37** | Expired OTP + non-matching passwords | Expired OTP + different passwords | Should prioritize OTP expiry message | Shows “Passwords do not match” instead |  Logic order issue |

### 5. Bug Report  

| **Bug ID** | Description | Type | Severity | Status |
|-------------|-------------|------|-----------|---------|
| **B1** | Email validation allows invalid characters and is case-sensitive | Validation | Moderate | Open |
| **B2** | Validation priority issue – password mismatch checked before OTP expiry | Logic | Minor | Open |
| **B3** | System allows reusing current password while resetting | Security | Low | Open |

### 6. Observations  
- OTP system works correctly and expires after 5 minutes.  
- Password reset logic functions properly for valid inputs.  
- Case-sensitive email validation and inconsistent error priorities noted.  
- Browser handles empty-field validation.  
- Prototype allows password reuse; acceptable for this stage.  

### 7. Conclusion  
The **Forgot Password Module** is functionally complete and secure at the prototype level:  
- OTP generation, expiry, and password reset flow work reliably.  
- Clear messages are displayed for all valid and invalid scenarios.  
- Minor improvements needed in validation order and email handling.

  **Module Prepared & Documented By:**  
Aayman Ammar Shams (202301082)

--



