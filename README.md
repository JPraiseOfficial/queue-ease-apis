# QueueEase API

QueueEase is the backend API for a modern, efficient queue management system. It's designed to help organizations streamline their customer flow, reduce wait times, and improve service quality. It provides endpoints for managing organizations, services, staff, and customer tickets, along with collecting metrics for performance analysis.

## ✨ Features

*   **Organization Management:** Create and manage multiple organizations.
*   **Service & Staff Management:** Define services within an organization and assign staff to them.
*   **Ticketing System:** Create, update, and manage customer tickets from various sources.
*   **Live Queue Tracking:** Real-time queue booking and wait time prediction.
*   **Queue Analytics:** Collect daily and hourly metrics to analyze queue performance.
*   **Authentication:** Secure endpoints for staff and organization management.

## 🛠️ Technologies Used

*   **[Node.js](https://nodejs.org/)**: JavaScript runtime environment.
*   **[Express.js](https://expressjs.com/)**: Web framework for Node.js.
*   **[TypeScript](https://www.typescriptlang.org/)**: Typed superset of JavaScript.
*   **[Prisma](https://www.prisma.io/)**: Next-generation ORM for Node.js and TypeScript.
*   **[PostgreSQL](https://www.postgresql.org/)**: Recommended database.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm
*   A running PostgreSQL database instance.

### Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd queue-ease-apis
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Now, open the `.env` file and fill in the required environment variables, especially your `DATABASE_URL`.

4.  **Run database migrations:**

    Prisma needs to sync the schema with your database.

    ```bash
    npx prisma migrate dev
    ```

5.  **Generate Prisma Client:**

    This step is usually done automatically after migrations, but you can run it manually if needed.

    ```bash
    npx prisma generate
    ```

6.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The server should now be running on the port specified in your `.env` file (default is `3000`).

##  API Documentation

A complete and interactive API documentation is available through Swagger UI, hosted on Render. It provides detailed information on all available endpoints, including request parameters, response schemas, and authentication requirements.

**You can access the official Swagger docs at:**
**https://queue-ease-apis.onrender.com/api-docs**

## 📝 API Endpoints Overview

The API provides a rich set of RESTful endpoints for managing the queue system's resources. Below is a brief overview of the available resource modules. For detailed endpoints, please refer to the Swagger documentation.

*   **Auth:** Handles staff registration and JWT-based authentication (`/api/auth`).
*   **Organizations:** For creating and managing organizations (`/api/organizations`).
*   **Services:** For managing the services offered by an organization (`/api/services`).
*   **Staff:** For managing staff members within an organization (`/api/staff`).
*   **Tickets:** Core endpoints for creating, managing, and tracking customer tickets (`/api/tickets`).
*   **Metrics & Records:** Endpoints for fetching queue analytics, live booking data, and performance metrics.

## ⚙️ Environment Variables

The following environment variables are required for the application to run.

| Variable        | Description                                                                                             | Example                                                              |
| :-------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------- |
| `DATABASE_URL`  | The connection string for your PostgreSQL database. Prisma uses this to connect to the database.         | `postgresql://user:password@localhost:5432/mydb?schema=public`       |
| `PORT`          | The port on which the Express server will run.                                                          | `3000`                                                               |
| `JWT_SECRET`    | A secret key used to sign and verify JSON Web Tokens (JWTs) for authentication. Make this a long, random string. | `your-super-secret-and-long-jwt-key`                                 |
| `ML_ENGINE_URL` | The URL for the machine learning engine used for predictions.                                           | `http://your-ml-engine-url.com`                                      |

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
