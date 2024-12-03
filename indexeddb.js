import { openDB} from 'idb';

const dbPromise = openDB('my-database', 1, {
    upgrade(db) {
        db.createObjectStore('yourObjectStore', {
            keyPath: 'id',
            autoIncrement: true,
        });
    },
});

async function addIndexedDB(data) {
    const db = await dbPromise;
    await db.add('yourObjectStore', data);
}

async function getIndexedDBRecords() {
    const db = await dbPromise;
    return await db.getAll('yourObjectStore');
}

async function updateIndexedDBRecord(id, data) {
    const db = await dbPromise;
    await db.put('yourObjectStore', { ...data, id});
}

async function deleteIndexedDBRecord(id) {
    const db = await dbPromise;
    await db.delete('yourObjectStore', id);
}

export { addIndexedDB, getIndexedDBRecords, updateIndexedDBRecord, deleteIndexedDBRecord};
