# CMS with Directus & Next.js

## Introduction

This is a simple example of how to use Directus as a headless CMS with Next.js.

## Prerequisites

- Node.js >= 18
- Yarn
- Directus pre-installed with CMS collections

## Installation

1. Clone the repository
2. Install the dependencies:

```bash
npm install
```

3. Create a `.env.local` file and add the following environment variables:

```env
API_URL=http://localhost:8055
NEXT_PUBLIC_API_URL=http://localhost:8055
API_TOKEN=your-api-token
```

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
