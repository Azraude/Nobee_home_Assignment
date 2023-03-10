## Description

- You will be building the Mobile frontend for Login & Register flow. Design material is available at [https://www.figma.com/file/Xp8SpVI9P8k1N7cnsJtUUf/Login-testing](https://www.figma.com/file/Xp8SpVI9P8k1N7cnsJtUUf/Login-testing)
- You will have 5 days to submit this assignment. Simply make a PR to this [repo](https://github.com/nobeeinc/frontend-interview), including your name and link to your CV in the PR description
- Backend Api endpoints have already been set up, and accessible via `http://localhost:3000/api/...`
  + [POST /api/auth/register](api-documentations/register.md)
  + [POST /api/auth/login](api-documentations/login.md)
  + [POST /api/auth/logout](api-documentations/logout.md)
  + [POST /api/auth/keep-login](api-documentations/keep-login.md)
  + [GET /api/auth/user](api-documentations/user.md)
  + [HEAD /api/auth/emails/:email](api-documentations/email.md) <- check if email exists


## Set-up instructions

- Install node 14 or higher
- Clone the repo `git clone https://github.com/nobeeinc/frontend-interview.git`
- Run `npm install`
- Spin up local server with `npm run dev`


## Acceptance Criteria

### General
  - [ ] Use [Tailwindcss](https://tailwindcss.com)
  - [ ] Use [Formik](https://formik.org) and [yup](https://github.com/jquense/yup) to manage form and validation
  - [ ] Use [Material UI Button Component](https://mui.com/components/buttons)
  - [ ] Use [Material UI IconButton Component](https://mui.com/api/icon-button)
  - [ ] Use [Material UI Textfield Component](https://mui.com/components/text-fields)
  - [ ] No lint error (Using VSCode with ESLint extension is recommended)

### Email Form
  - [ ] Follow the design
  - [ ] Email must be validated before going to Login/Register step
      - [ ] Required
      - [ ] Valid email
  - [ ] If email already exists, direct user to Login step
  - [ ] If email does not exist, direct user to Register step

### Register Form
  - [ ] Follow the design
  - [ ] User should be able to go back to Email Form
  - [ ] User should be able to register
  - [ ] Email should be prefilled from previous step
  - [ ] Email must be validated before submitting
      - [ ] Required
      - [ ] Valid email
  - [ ] Password should be validated before submitting
      - [ ] Required
      - [ ] At least 8 character
      - [ ] Max 255 character
      - [ ] At least 1 uppercase
      - [ ] At least 1 number
      - [ ] At least 1 symbol
  - [ ] Password & Confirm Password must match before submitting
  - [ ] On success, user should be logged in
  - [ ] Display logged-in state accordingly (see design)
  - [ ] User should still be logged in after browser refresh, new tab & new window

### Login Form
  - [ ] Follow the design
  - [ ] User should be able to go back to Email Form
  - [ ] User should be able to login
  - [ ] Display logged-in state accordingly (see design)
  - [ ] Email should be prefilled from previous step
  - [ ] Email must be validated before submitting
      - [ ] Required
      - [ ] Valid email
  - [ ] Password must be validated before submitting
      - [ ] Required
  - [ ] User should still be logged in after browser refresh, new tab & new window

### Logout
  - [ ] Follow the design
  - [ ] User should be able to logout
  - [ ] Display logged-out state accordingly (see design)
  - [ ] User should still be logged out after browser refresh, new tab & new window
