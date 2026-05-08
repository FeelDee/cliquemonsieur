class StorageObject extends Observable {

    constructor(key, defaultValue) {
        super(JSON.parse(localStorage.getItem(key)) || defaultValue);
        this.key = key;
    }

    next(value) {
        localStorage.setItem(this.key, JSON.stringify(value));
        super.next(value);
    }
}

let dbPromise = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open('user-content', 1);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('monsieurs')) {
                    db.createObjectStore('monsieurs');
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    return dbPromise;
}

const onMonsieurSave = new Observable();

async function storageGetAllMonsieurs() {
    const db = await getDB();
    const tx = db.transaction('monsieurs', 'readonly');
    const store = tx.objectStore('monsieurs');

    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error)
    })
}

async function storageSaveMonsieur({ name, occurrences, timestamp, blob }) {
    const db = await getDB();
    const tx = db.transaction('monsieurs', 'readwrite');
    const store = tx.objectStore('monsieurs');

    store.put({ name, occurrences, timestamp, blob }, name);

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => {
            resolve();
            onMonsieurSave.next({ name, occurrences, timestamp, blob });
        }
        tx.onerror = reject;
    });
}

async function storageDeleteMonsieur(name) {
    const db = await getDB();
    const tx = db.transaction('monsieurs', 'readwrite');
    const store = tx.objectStore('monsieurs');

    store.delete(name);

    return new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = reject;
    })
}
