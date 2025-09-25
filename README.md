# MueblesSell - Furniture Marketplace

A Next.js application for selling furniture items with Firebase backend.

## Features

- **Public Facing:**
  - Browse available furniture items
  - View detailed item information and images
  - Responsive design for all devices

- **Admin Dashboard:**
  - Secure authentication
  - Add new furniture items with images
  - Mark items as sold
  - Delete items

## Tech Stack

- **Frontend:**
  - Next.js 14
  - React
  - Tailwind CSS

- **Backend:**
  - Firebase Authentication
  - Firestore Database
  - Firebase Storage

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn
- Firebase account

### Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd mueblessell
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Firebase Setup**

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Email/Password)
- Create a Firestore database
- Enable Storage
- Get your Firebase configuration

4. **Environment Variables and Firebase Configuration**

- Copy the `.env.local.example` file to `.env.local`
- Fill in your Firebase configuration details

```bash
cp .env.local.example .env.local
```

- Copy the `.firebaserc.example` file to `.firebaserc`
- Update with your Firebase project ID

```bash
cp .firebaserc.example .firebaserc
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Project Structure

```
mueblessell/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router
│   │   ├── admin/      # Admin dashboard pages
│   │   ├── auth/       # Authentication pages
│   │   ├── item/       # Item detail pages
│   │   ├── layout.js   # Root layout
│   │   └── page.js     # Home page
│   ├── components/     # Reusable components
│   ├── context/        # React context providers
│   ├── firebase/       # Firebase configuration and utilities
│   └── styles/         # Global styles
├── .env.local          # Environment variables (create from .env.local.example)
└── package.json        # Project dependencies
```

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set up the environment variables
4. Deploy

### Firebase Hosting and Rules

1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

2. Login to Firebase
```bash
firebase login
```

3. Initialize Firebase Hosting, Firestore, and Storage
```bash
firebase init hosting
firebase init firestore
firebase init storage
```

4. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

5. Build the application
```bash
npm run build
```

6. Deploy to Firebase
```bash
firebase deploy --only hosting
```

7. Full Deployment (all services)
```bash
firebase deploy
```

## Creating an Admin User

1. Register a new user through the sign-in page
2. In Firebase Console, go to Firestore Database
3. Manually set admin privileges for the user if needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.
