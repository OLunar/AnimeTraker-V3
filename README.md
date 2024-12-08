# KitsuneLuna Anime Tracker

![Anime Tracker Logo](./icon-192x192.png)

KitsuneLuna Anime Tracker is a Progressive Web App (PWA) that helps you effortlessly track your favorite anime. With features like adding, updating, and removing anime from your list, along with Firebase integration for authentication and data storage, and IndexedDB for offline capabilities, this app ensures a seamless experience for all anime enthusiasts.

## Features

- **Add Anime**: Add new anime to your watchlist with ease.
- **Update Status**: Update the status of anime (Watched, In Progress, Dropped, Plan to Watch).
- **Fetch Anime Data**: Retrieve detailed anime information using the Jikan API.
- **Authentication**: Sign up, sign in, and sign out with Firebase Authentication.
- **Offline Capabilities**: Sync data with IndexedDB for offline access and synchronization.
- **Notifications**: Enable browser notifications for data synchronization.

## Installation

To get started with KitsuneLuna Anime Tracker, follow these steps:

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (v6 or higher recommended)
- Git

### Steps

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/USERNAME/REPOSITORY.git
    cd REPOSITORY
    ```

2. **Install Dependencies**:
    ```sh
    npm install
    ```

3. **Configure Firebase**:
    - Update the `firebaseConfig` object in `src/firebase.js` with your Firebase project credentials.

4. **Start the Development Server**:
    ```sh
    parcel index.html
    ```

5. **Open the App**:
    - Navigate to `http://localhost:1234` in your browser to see the app in action.

## Usage

### Adding Anime

1. **Enter Anime Name**: Type the name of the anime in the input field.
2. **Click Add**: Click the floating "Add" button to add the anime to your list.

### Updating Anime Status

1. **Click on Anime Card**: Click on the anime card to open the status update modal.
2. **Select Status**: Choose the appropriate status from the dropdown.
3. **Save**: Click "Save" to update the status.

### Fetching Anime Data

1. **Enter Anime ID**: Type the anime ID in the designated input field.
2. **Fetch Data**: Click the fetch button to retrieve and display anime details.

### Authentication

- **Sign Up**: Enter your email and password in the sign-up modal and click "Sign Up".
- **Sign In**: Enter your email and password in the sign-in modal and click "Sign In".
- **Sign Out**: Click the "Sign Out" button to log out.

### Notifications

- **Enable Notifications**: Click the "Enable Notifications" button to request notification permission.

## Project Structure

.
├── src
│   ├── firebase.js
│   ├── indexeddb.js
├── style.css
├── index.html
├── app.js
├── manifest.json
├── package.json
└── README.md

## Dependencies

- [Firebase](https://firebase.google.com/docs/web/setup)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Axios](https://axios-http.com/docs/intro)
- [Materialize](https://materializecss.com/)
- [Parcel](https://parceljs.org/)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## Contact

For any inquiries or issues, please contact [Oscar Luna](olunar007@outlook.com).
