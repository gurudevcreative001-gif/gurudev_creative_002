// IndexedDB storage for storing and retrieving full client raw video and photo files
const DB_NAME = 'GurudevCreativeFilesDB';
const STORE_NAME = 'raw_files';
const DB_VERSION = 1;

interface StoredFileRecord {
  id: string; // e.g. "GC-2026-1042_0"
  orderId: string;
  name: string;
  type: string;
  size: number;
  blob?: Blob;
  dataUrl?: string;
  createdAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveRawFile(
  orderId: string,
  index: number,
  file: File
): Promise<{ id: string; name: string; size: number; type: string; dataUrl: string }> {
  const id = `${orderId}_${index}`;
  
  // Read as DataURL for immediate fast preview/download if needed
  let dataUrl = '';
  try {
    if (file.size < 8 * 1024 * 1024) {
      dataUrl = await fileToDataUrl(file);
    } else {
      dataUrl = URL.createObjectURL(file);
    }
  } catch (err) {
    dataUrl = URL.createObjectURL(file);
  }

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const record: StoredFileRecord = {
      id,
      orderId,
      name: file.name,
      type: file.type,
      size: file.size,
      blob: file,
      dataUrl,
      createdAt: Date.now(),
    };

    store.put(record);
    await new Promise((res, rej) => {
      tx.oncomplete = res;
      tx.onerror = rej;
    });
  } catch (err) {
    console.warn('IndexedDB save failed, using memory URL', err);
  }

  return {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    dataUrl,
  };
}

export async function getRawFileRecord(fileId: string): Promise<StoredFileRecord | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(fileId);
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export function downloadRawFile(fileDataUrl: string, fileName: string): void {
  const sourceDownload = document.createElement('a');
  sourceDownload.href = fileDataUrl;
  sourceDownload.download = fileName || 'client_raw_video.mp4';
  sourceDownload.target = '_blank';
  document.body.appendChild(sourceDownload);
  sourceDownload.click();
  document.body.removeChild(sourceDownload);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
