import { db, collection, addDoc, getDocs, updateDoc, deleteDoc } from './src/firebase.js';
import { addAnimeToIndexedDB, getAnimeFromIndexedDB, updateAnimeInIndexedDB, deleteAnimeFromIndexedDB } from './src/indexeddb.js';
import axios from 'axios'; // Ensure axios is correctly imported
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth();

// Function to fetch anime data
async function fetchAnimeData(animeId) {
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching anime data:", error);
        return null;
    }
}

// Function to request notification permission
function requestNotificationPermission() {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.log('Notification permission denied.');
            }
        }).catch(error => {
            console.error('Error requesting notification permission:', error);
        });
    }
}

// Sync logic
function isOnline() {
    return navigator.onLine;
}

async function syncData() {
    try {
        if (isOnline()) {
            const localData = await getAnimeFromIndexedDB();
            for (const anime of localData) {
                if (!anime.synced) {
                    await addDoc(collection(db, 'animeList'), anime);
                    anime.synced = true;
                    await updateAnimeInIndexedDB(anime.id, anime);
                }
            }
            notifySync();
        }
    } catch (error) {
        console.error('Error syncing data:', error);
    }
}

function notifySync() {
    if (Notification.permission === 'granted') {
        new Notification('Data synchronized with Firebase!');
    }
}

window.addEventListener('online', syncData);
window.addEventListener('offline', () => console.log('App is offline'));

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

// Function to sign in
function signIn() {
    const email = document.getElementById('sign-in-email').value;
    const password = document.getElementById('sign-in-password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Signed in:', userCredential.user);
        })
        .catch((error) => {
            console.error('Error signing in:', error);
        });
}

// Function to sign up
function signUp() {
    const email = document.getElementById('sign-up-email').value;
    const password = document.getElementById('sign-up-password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Signed up:', userCredential.user);
        })
        .catch((error) => {
            console.error('Error signing up:', error);
        });
}

// Function to sign out
function signOutUser() {
    signOut(auth)
        .then(() => {
            console.log('Signed out');
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
}

// Add event listeners for auth buttons
document.getElementById('sign-in-btn').addEventListener('click', signIn);
document.getElementById('sign-up-btn').addEventListener('click', signUp);
document.getElementById('sign-out-btn').addEventListener('click', signOutUser);

document.addEventListener('DOMContentLoaded', function() {
    M.updateTextFields();
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelectorAll('select'));

    // Initialize tabs
    M.Tabs.init(document.querySelectorAll('.tabs'));

    // Load anime list from IndexedDB or Firebase
    if (navigator.onLine) {
        getDocs(collection(db, 'animeList')).then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                addAnimeCard(data.name, data.thumbnail, data.status);
            });
        }).catch(error => {
            console.error('Error loading data from Firebase:', error);
        });
    } else {
        getAnimeFromIndexedDB().then(animeList => {
            animeList.forEach(anime => addAnimeCard(anime.name, anime.thumbnail, anime.status));
        }).catch(error => {
            console.error('Error loading data from IndexedDB:', error);
        });
    }

    // Add click event listener to add-anime button
    document.getElementById('add-anime-btn').addEventListener('click', () => {
        console.log('Add Anime button clicked');
        const animeName = document.getElementById('anime-name').value;
        const animeThumbnail = 'placeholder-image.png'; // Placeholder image for now
        if (animeName) {
            addAnimeCard(animeName, animeThumbnail, '');
            const newAnime = { name: animeName, thumbnail: animeThumbnail, status: '', synced: false };
            addRecord(newAnime); // Add record to Firebase or IndexedDB

            document.getElementById('anime-name').value = ''; // Clear the input field
        }
    });

    // Example of how to call fetchAnimeData
    async function loadAnimeData(animeId) {
        const animeData = await fetchAnimeData(animeId);
        if (animeData) {
            console.log('Fetched anime data:', animeData);
            // Process and display anime data as needed
        }
    }

    // Example of how to call requestNotificationPermission
    document.getElementById('enable-notifications-btn').addEventListener('click', () => {
        console.log('Enable Notifications button clicked');
        requestNotificationPermission();
    });

    // Add click event listener to fetch-anime button
    document.getElementById('fetch-anime-btn').addEventListener('click', () => {
        const animeId = document.getElementById('anime-id').value; // Assuming you have an input field with ID 'anime-id'
        loadAnimeData(animeId); // Call loadAnimeData with the actual anime ID
    });
});

// Filter by category
document.querySelectorAll('.tabs a').forEach(tab => {
    tab.addEventListener('click', () => {
        console.log('Tab clicked:', tab.getAttribute('href').substring(1));
        const category = tab.getAttribute('href').substring(1);
        document.querySelectorAll('.card').forEach(card => {
            if (category === 'all' || card.classList.contains(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Function to add an anime card
function addAnimeCard(name, thumbnail, status) {
    const animeList = document.getElementById('anime-list');
    const animeCard = document.createElement('div');
    animeCard.className = 'col s12 m6';
    animeCard.innerHTML = `
        <div class="card">
            <div class="card-image">
                <img src="${thumbnail}">
            </div>
            <div class="card-content">
                <span class="card-title">${name}</span>
                <p>Status: <span class="anime-status">${status}</span></p>
                <a class="btn-floating halfway-fab waves-effect waves-light red remove-btn"><i class="material-icons">remove</i></a>
            </div>
        </div>
    `;
    
    // Add event listener for status update
    animeCard.querySelector('.card').addEventListener('click', () => {
        console.log('Anime card clicked');
        const modal = M.Modal.getInstance(document.getElementById('status-modal'));
        modal.open();
        document.getElementById('save-status-btn').onclick = () => {
            const selectedStatus = document.getElementById('anime-status').value;
            animeCard.querySelector('.anime-status').innerText = selectedStatus;

            // Update Firebase or IndexedDB 
            const newAnime = { name, thumbnail, status: selectedStatus, synced: false };
            try {
                if (navigator.onLine) {
                    getDocs(collection(db, 'animeList')).then(querySnapshot => {
                        querySnapshot.forEach(async doc => {
                            if (doc.data().name === name) {
                                await updateDoc(doc.ref, newAnime);
                            }
                        });
                    });
                } else {
                    getAnimeFromIndexedDB().then(animeList => {
                        const animeRecord = animeList.find(anime => anime.name === name);
                        if (animeRecord) {
                            updateAnimeInIndexedDB(animeRecord.id, newAnime);
                        }
                    });
                }
            } catch (error) {
                console.error('Error updating anime status:', error);
            }

            modal.close();
        };
    });

    // Add event listener for removing anime card 
    animeCard.querySelector('.remove-btn').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent triggering the card click event
        console.log('Remove button clicked');
        animeCard.remove();

        // Remove from Firebase or IndexedDB
        try {
            if (navigator.onLine) {
                getDocs(collection(db, 'animeList')).then(querySnapshot => {
                    querySnapshot.forEach(async doc => {
                        if (doc.data().name === name) {
                            await deleteDoc(doc.ref);
                        }
                    });
                });
            } else {
                getAnimeFromIndexedDB().then(animeList => {
                    const animeRecord = animeList.find(anime => anime.name === name);
                    if (animeRecord) {
                        deleteAnimeFromIndexedDB(animeRecord.id);
                    }
                });
            }
        } catch (error) {
            console.error('Error removing anime:', error);
        }
    });

    animeList.appendChild(animeCard);
}

// Functions for adding and syncing records
async function addRecord(data) {
    try {
        if (navigator.onLine) {
            await addDoc(collection(db, 'animeList'), data);
        } else {
            await addAnimeToIndexedDB(data);
        }
    } catch (error) {
        console.error('Error adding record:', error);
    }
}

async function syncOfflineData() {
    try {
        if (navigator.onLine) {
            const records = await getAnimeFromIndexedDB();
            for (const record of records) {
                await addDoc(collection(db, 'animeList'), record);
                await deleteAnimeFromIndexedDB(record.id);
            }
            console.log('Offline data synced with Firebase.');
        }
    } catch (error) {
        console.error('Error syncing offline data:', error);
    }
}

// Event listeners for syncing data
window.addEventListener('online', syncOfflineData);
window.addEventListener('offline', () => console.log('App is offline.'));
