# 🚨 RESQ AI — Disaster Communication & Emergency Response

**RESQ AI** is an AI-assisted disaster communication and emergency response platform designed to improve situational awareness, citizen distress reporting, resource coordination, and evacuation planning during disasters.

The platform provides a unified dashboard to visualize incidents, monitor disaster zones, coordinate response resources, and support emergency decision-making.

## 🎯 Problem Statement

During disasters such as floods, earthquakes, cyclones, and forest fires, communication networks may become unreliable, emergency reports can be difficult to coordinate, and rescue resources may not reach affected areas efficiently.

RESQ AI aims to address these challenges through a centralized disaster-response interface with incident visualization, citizen SOS reporting, AI-assisted analysis, and resource coordination.

## 💡 Key Features

**1. 📡 Disaster Communication**
- Designed around the challenge of communication failures during disasters.
- Supports emergency reporting and communication-related workflows.
- Mesh-network communication is a project concept; actual offline device-to-device communication depends on implementing a compatible networking system.

**2. 🗺️ Tactical Geolocation Grid**
- Visualizes disaster zones and incident markers.
- Displays critical, high-risk, warning, and safe-zone indicators.
- Includes map layers for rescue teams, hospitals, shelters, blocked roads, evacuation routes, and citizen SOS reports.
- Provides interactive incident and zone details.

**3. 🆘 Citizen Emergency Reporting**
- Allows citizens to submit emergency reports.
- Captures incident descriptions, categories, and location information.
- Supports browser-based GPS coordinates when permission is granted.
- Can display a city or place name when reverse geocoding is available.

**4. 🤖 AI-Powered Decision Support**
- Designed to assist with disaster classification and risk analysis.
- Supports AI-assisted incident summaries and threat assessments.
- Can provide response recommendations through the configured Gemini API.
- AI recommendations should be verified before operational use.

**5. 🚑 Rescue Resource Coordination**
- Displays rescue teams, ambulances, hospitals, and shelters.
- Provides interfaces for viewing incident and resource information.
- Supports resource coordination workflows.

**6. 🛣️ Evacuation Planning**
- Visualizes evacuation corridors and blocked-road indicators.
- Provides an interface for reviewing evacuation options.
- Actual route optimization requires geographic road data and route-calculation logic.

**7. 🚨 Emergency Alerts**
- Includes emergency broadcast and alert-management interfaces.
- Supports alert preparation and simulated communication workflows.
- Actual delivery requires a configured messaging or notification service.

**8. 📊 Emergency Operations Dashboard**
- Centralized view of incidents, hazards, and response resources.
- Interactive controls for monitoring and exploring incident information.
- Designed to support faster situational awareness and coordinated response.

## 🛠️ Technology Stack

**Frontend**
- React.js
- TypeScript

**Backend**
- Node.js
- Express.js
- Python

**Database**
- PostgreSQL
- Supabase DB

**Authentication**
- Supabase Auth

Check the project configuration for the exact services and dependencies enabled in your version.

## ⚙️ Installation

```bash
npm install
npm run dev
