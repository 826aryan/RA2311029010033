# Notification System App

This project is a full-stack notification management system featuring a centralized logging middleware, a Node.js Express backend, and a modern React TypeScript frontend. The system fetches upstream notifications, prioritizes them via a custom mathematical algorithm backed by a Bounded Min-Heap, and displays them beautifully in a Material UI frontend.

## Screenshots

### Desktop View
| All Notifications | Priority Inbox |
| :---: | :---: |
| ![Desktop All Notifications](screenshots/Desktop_view(All).png) | ![Desktop Priority Inbox](screenshots/Desktop_view(Priority).png) |

### Mobile View
| All Notifications | Priority Inbox |
| :---: | :---: |
| ![Mobile All Notifications](screenshots/Mobile_view(All).png) | ![Mobile Priority Inbox](screenshots/Mobile_view(Priority).png) |

## Project Structure
- `logging_middleware/` - A universal TS library for sending structured logs to an external service.
- `notification_app_be/` - Express server handling the notification APIs, Min-Heap implementation, and algorithmic logic.
- `notification_app_fe/` - React frontend handling UI, Pagination, Responsive Design, and Read/Unread state persistence.

## Architecture and Approach

### 1. Priority Scoring Algorithm
The backend calculates a custom score for each notification, balancing categorical importance and temporal relevance.
- **Weight Allocation**: `Placement` = 3, `Result` = 2, `Event` = 1
- **Recency Decay**: `Recency Score = 1 / (1 + hours_elapsed)`
- **Composite Final Score**: `(Weight * 0.7) + (Recency Score * 0.3)`

### 2. Time Complexity & Data Structures (Bounded Min-Heap)
To efficiently extract the Top $N$ notifications from a massive dataset of size $M$ (where $N \ll M$), we implemented a **Bounded Min-Heap of size $N$**.
- **Time Complexity:** $O(M \log N)$ rather than $O(M \log M)$ for standard sorting.
- **Space Complexity:** $O(N)$
- This optimally allows for instantaneous real-time streaming updates since a new notification can replace the lowest score in $O(\log N)$ time.

### 3. Frontend Implementation
- **Tech Stack:** React 18, TypeScript, Material UI (MUI), React Router v6.
- **Pagination & Sorting:** Fetches strictly paginated arrays dynamically from the API and executes final timestamp-descending sorting directly in the browser state.
- **State Management:** A hoisted `readIds` string array securely tracks clicked notifications and maps directly to `localStorage`, protecting read state across page reloads.
- **UX Components:** Displays polished UI details including dynamic MUI Chips, responsive layouts, unread badges, and loading skeletons.

### 4. Telemetry and Logging
Both the backend and frontend consume the custom `logging_middleware`.
- Validates properties universally via static TS typings (`level: info | warn | error | fatal`).
- Safely truncates messages and isolates logging errors.
- Centralizes application insight without blocking the synchronous Node execution context.

## Setup Instructions

### Backend
```bash
cd notification_app_be
npm install
npm run dev
```
*(Ensure you have an active `.env` file containing `BEARER_TOKEN=<your_jwt_token>`)*

### Frontend
```bash
cd notification_app_fe
npm install
npm start
```
