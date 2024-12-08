import { openDB } from 'idb'; // Correct import path for idb

const dbPromise = openDB('anime-tracker', 1, {
    upgrade(db) {
        db.createObjectStore('animeList', { keyPath: 'id', autoIncrement: true });
    },
});

export async function addAnimeToIndexedDB(anime) {
    try {
        const db = await dbPromise;
        await db.add('animeList', anime);
    } catch (error) {
        console.error('Error adding anime to IndexedDB:', error);
    }
}

export async function getAnimeFromIndexedDB() {
    try {
        const db = await dbPromise;
        return await db.getAll('animeList');
    } catch (error) {
        console.error('Error getting anime from IndexedDB:', error);
    }
}

export async function updateAnimeInIndexedDB(id, updateData) {
    try {
        const db = await dbPromise;
        const anime = await db.get('animeList', id);
        Object.assign(anime, updateData);
        await db.put('animeList', anime);
    } catch (error) {
        console.error('Error updating anime in IndexedDB:', error);
    }
}

export async function deleteAnimeFromIndexedDB(id) {
    try {
        const db = await dbPromise;
        await db.delete('animeList', id);
    } catch (error) {
        console.error('Error deleting anime from IndexedDB:', error);
    }
}
