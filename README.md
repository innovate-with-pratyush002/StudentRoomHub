# StudentRoomHub

StudentRoomHub is a student-focused room rental platform built with Node.js, Express, MongoDB, and EJS. It helps students discover rooms or PG accommodations in different cities, while allowing property owners to publish and manage listings with images, pricing, tenant preferences, and map coordinates.

## Features

- User signup and sign-in with local authentication
- Google OAuth login support
- Create, edit, and delete room listings
- Upload listing images with Cloudinary
- Location-aware listings with stored map coordinates
- Search listings using text search across title, description, and location
- Review system with ratings and comments
- User profile page showing owned listings
- Flash messages for common success and error states

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- EJS and `ejs-mate`
- Passport.js for authentication
- Cloudinary + Multer for image uploads
- Method Override
- Connect Flash

## Project Structure

StudentRoomHub/
├── app.js
├── cloudConfig.js
├── controller/
├── init/
├── middleware.js
├── models/
├── public/
├── routes/
└── views/


## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18 or later
- MongoDB running locally on `mongodb://127.0.0.1:27017/RoomForU`
- A Cloudinary account for image storage
- A Google OAuth app if you want to use Google sign-in

## Installation

1. Clone the repository:

```bash
git clone https://github.com/innovate-with-pratyush002/StudentRoomHub.git
cd StudentRoomHub
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
cloudName=your_cloudinary_cloud_name
apiKey=your_cloudinary_api_key
apiSecret=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Start MongoDB locally.

5. Run the application:

```bash
node app.js
```

For development with automatic reloads:

```bash
npx nodemon app.js
```

6. Open the app in your browser:

```text
http://localhost:3000
```

## Seed Data

Sample listing data is available in [`init/data.js`](/home/pratyush/Development/GitHub/RoomHub/StudentRoomHub/init/data.js). To load seed data, run:

```bash
node init/index.js
```

Note: the seed script clears the existing `Listing` collection before inserting sample data.

## Main Routes

- `/signup` - create an account
- `/signin` - sign in with username and password
- `/auth/google` - sign in with Google
- `/listings` - view all listings
- `/listings/new` - create a new listing
- `/listings/:id` - view listing details
- `/listings/:id/edit` - edit a listing
- `/listings/:id/reviews` - create or delete reviews
- `/search?search=<query>` - search listings
- `/profile` - view the current user's profile and listings

## Data Models

### Listing

A listing contains:

- title
- description
- image metadata
- price
- location and state
- room type
- preferred tenant
- availability status
- contact phone number
- owner reference
- reviews
- GeoJSON map coordinates

### Review

A review contains:

- comment
- rating from 1 to 5
- owner reference
- creation timestamp

### UserAuth

A user contains:

- name
- email
- username for local auth
- optional Google account ID
- optional profile picture

## Environment Notes

A few settings are currently hardcoded in the application:

- The server runs on port `3000`
- MongoDB connection points to local database `RoomForU`
- Google OAuth callback URL is `http://localhost:3000/auth/google/callback`
- Session secret is defined directly in `app.js`

## Contributing

Open contributions are welcome. Read [`CONTRIBUTING.md`](/home/pratyush/Development/GitHub/RoomHub/StudentRoomHub/CONTRIBUTING.md) before opening an issue or pull request.

## License

This project is currently published with the `ISC` license as defined in [`package.json`](/home/pratyush/Development/GitHub/RoomHub/StudentRoomHub/package.json).
