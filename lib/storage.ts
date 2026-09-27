import { AppState } from "./types";
import { STORAGE_KEY } from "./constants";

export function safeLoad(): Partial<AppState> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<AppState>) : null;
  } catch {
    return null;
  }
}

export function safeSave(state: AppState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function safeClear(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
