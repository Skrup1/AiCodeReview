# AI-Powered Code Reviewer

## Overview

The **AI-Powered Code Reviewer** is a web-based tool that allows users to submit JavaScript/TypeScript code and receive AI-generated feedback. The system uses OpenAI's GPT-3.5-turbo model to analyze the code and provide suggestions for improvement, including potential errors, performance issues, and best practices.

## Features

- **Code Analysis:**  
  Submit JavaScript/TypeScript code and receive detailed feedback generated by OpenAI.
  
- **Database Storage:**  
  Reviews (code and feedback) are saved in a MongoDB database, allowing for history tracking.
  
- **API Endpoints:**  
  - `POST /api/review`: Analyzes code and returns feedback.
  - *(Optional)* `GET /api/history`: Retrieves the latest code review history.

## Technologies Used

- **Backend:**  
  - Node.js, Express  
  - OpenAI API (GPT-3.5-turbo)  
  - MongoDB (Atlas or local) with Mongoose

- **Frontend:**  
  - React  
  - Material UI for modern, responsive UI  
  - CodeMirror for code editing with syntax highlighting

## Setup Instructions

### Prerequisites

- Node.js (preferably an LTS version, e.g., v16 or v18)
- npm (Node Package Manager)
- A MongoDB Atlas account (or a local MongoDB instance)

### Backend Setup

1. **Navigate to the backend folder:**

   ```bash
   cd backend
