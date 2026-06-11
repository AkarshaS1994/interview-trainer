import { STORAGE_KEY } from "../data/constants.js";

export const PERSISTENT_KEYS = ["xp","badges","completed","patternStats","daysPracticed","stepStreak"];

export function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePersisted(state) {
  try {
    const toSave = {};
    for (const key of PERSISTENT_KEYS) toSave[key] = state[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}
