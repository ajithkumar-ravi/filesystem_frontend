# Filesystem Frontend

This is the frontend for the File Explorer application. It is built with React, Vite, Tailwind CSS, and Lucide React.

## Features

-   Interactive file and folder navigation.
-   Breadcrumb navigation.
-   UI for creating, renaming, moving, and deleting files and folders.
-   Responsive design using Tailwind CSS.
-   Icons provided by Lucide React.

## Prerequisites

-   Node.js (v14 or higher recommended)

## Setup Instructions

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    - Create a `.env` file and configure the API URL to point to your backend:
      ```env
      VITE_API_URL=http://localhost:5000/api
      ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

    The application will typically start on `http://localhost:5173`. Open this URL in your browser to view the File Explorer.

4.  **Build for production:**
    ```bash
    npm run build
    ```
    This will generate static files in the `dist` directory, which can be served using any static file server.

## Vercel Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). A `vercel.json` file is included to properly handle client-side routing (React Router) in the production build.

1. Install the Vercel CLI or connect your GitHub repository in the Vercel Dashboard.
2. Ensure the **Framework Preset** is set to `Vite`.
3. Set the `VITE_API_URL` environment variable in your Vercel project settings to point to your live backend API URL.
4. Deploy!
