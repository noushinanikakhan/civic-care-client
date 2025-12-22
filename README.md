🏙️ CivicCare – Public Infrastructure Issue Reporting System

🌐 Live Website

Client: https://civic-care-ed056.web.app

Server: https://civic-care-server.vercel.app

🔐 Admin Credentials (For Evaluation)

Admin Email: bangladesh@bd.com

Admin Password: ****** 


📌 Project Overview

CivicCare is a full-stack public infrastructure issue reporting system that enables citizens to report civic problems such as potholes, streetlight failures, garbage overflow, and water leaks. Admins and staff can manage, assign, track, and resolve issues through a role-based dashboard system.

🚀 Key Features (Highlights)

Role-based system – Citizen, Staff, and Admin dashboards with protected routes

Issue reporting with title, description, category, image, and location

Issue lifecycle tracking (Pending → In-Progress → Resolved → Closed)

Timeline system showing full issue history (read-only audit trail)

Upvote system (one upvote per user, cannot upvote own issue)

Premium subscription for unlimited issue reporting

Issue boosting via payment (priority set to High)

Staff assignment by admin with instant dashboard visibility

Staff status updates with enforced status flow

Admin user management (block/unblock citizens)

Admin staff management (create, update, delete staff)

Firebase Authentication (Email/Password + Google Login)

MongoDB persistence with secure token verification

Responsive UI (mobile, tablet, desktop)

SweetAlert notifications for all actions

TanStack Query for all server data fetching

Server-side pagination, filtering & search

CORS-secured production deployment

Environment variable protection

Deployed on Firebase Hosting & Vercel

🧭 Application Structure
🏠 Home Page

Navbar with profile dropdown

Hero banner

Latest Resolved Issues section (sorted)

Feature & How-it-Works sections

Footer

📄 All Issues Page (/all-issues)

Paginated issue cards

Filters: category, status, priority

Server-side search

Upvote button with instant UI update

View Details navigation

🔍 Issue Details Page (Private)

Full issue information

Timeline / Tracking UI

Edit/Delete (if owner & pending)

Boost priority (paid)

Assigned staff info

Upvote count visibility

👤 Citizen Dashboard

Routes

Dashboard overview (stats & charts)

My Issues (edit/delete/view)

Report Issue (limit enforced for free users)

Profile page (subscription & update info)

Rules

Free users: max 3 issues

Premium users: unlimited issues

Blocked users: login allowed, actions disabled

🧑‍🔧 Staff Dashboard

Assigned issues only

Status update workflow:

Pending → In-Progress → Working → Resolved → Closed

Timeline entry created for each status change

Profile update page

🛠️ Admin Dashboard

System statistics & charts

All issues table

Assign staff (one-time assignment)

Reject pending issues

Manage citizens (block/unblock)

Manage staff (create/update/delete)

Payments overview

Admin profile update

💳 Payments System

Subscription payment (1000৳)

Issue boost payment (100৳ per issue)

Admin payments table

User & admin payment visibility

(PDF invoice generation supported as challenge task)

🔐 Security & Architecture

Firebase Authentication

JWT token verification

Role-based middleware

Secure CORS configuration

Environment variables for secrets

No passwords stored for citizens

Staff passwords stored only for assignment evaluation

🧩 Tech Stack
Frontend

React + Vite

Tailwind CSS + DaisyUI

React Router

TanStack Query

Firebase Authentication

SweetAlert2

Backend

Node.js

Express.js

MongoDB

Firebase Admin SDK

JWT Verification

Vercel Deployment

📦 Deployment

Client: Firebase Hosting

Server: Vercel

Environment Variables: .env protected

📁 GitHub Repositories

Client Repo: https://github.com/noushinanikakhan/civic-care-client

Server Repo: https://github.com/noushinanikakhan/civic-care-server

