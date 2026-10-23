import type { Note, Paper } from "./types";
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("moonlight-library", 1);
    req.onupgradeneeded = () =>
      req.result.createObjectStore("papers", { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export async function savePaper(paper: Paper) {
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("papers", "readwrite");
      tx.objectStore("papers").put(paper);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
export async function getPapers(): Promise<Paper[]> {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const req = db.transaction("papers").objectStore("papers").getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}
export async function deletePaper(id: string) {
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("papers", "readwrite");
      tx.objectStore("papers").delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
export function readNotes(id: string): Note[] {
  try {
    return JSON.parse(localStorage.getItem(`moonlight:notes:${id}`) || "[]");
  } catch {
    return [];
  }
}
export function writeNotes(id: string, notes: Note[]): boolean {
  try {
    localStorage.setItem(`moonlight:notes:${id}`, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}
