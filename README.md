# Veil Web Application

Frontend for the Veil API marketplace platform built with Next.js, React, and Tailwind CSS.

## Overview

This is the web frontend for the Veil SaaS platform that provides:
- API marketplace for discovering and subscribing to APIs
- User authentication and profile management
- Seller dashboard for API providers
- API key management for consumers
- Real-time integration with the Veil BFF API

## Prerequisites

- Node.js 18+ and pnpm
- Veil BFF API running on `localhost:6969`

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The web app connects directly to the Veil BFF API running on `localhost:6969`. Make sure the BFF service is running before starting the web application.

## Features

- **Marketplace**: Browse and discover APIs with search and filtering
- **Authentication**: User registration, login, and profile management
- **Subscriptions**: Subscribe to APIs and manage subscriptions
- **API Keys**: Generate and manage API keys for subscriptions
- **Seller Dashboard**: Manage your APIs, view analytics, and track usage
- **Responsive Design**: Mobile-first responsive design with dark/light theme support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: Shadcn UI components with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **HTTP Client**: Native fetch API with custom client wrapper
- **TypeScript**: Full type safety throughout the application
