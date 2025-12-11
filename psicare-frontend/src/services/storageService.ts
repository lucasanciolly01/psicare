const APP_KEY = 'PSI_CARE_V1';

export const storageService = {
  get: <T>(key: string): T | null => {
    const data = localStorage.getItem(`${APP_KEY}_${key}`);
    return data ? JSON.parse(data) : null;
  },

  set: (key: string, value: unknown): void => {
    localStorage.setItem(`${APP_KEY}_${key}`, JSON.stringify(value));
  },

  remove: (key: string): void => {
    localStorage.removeItem(`${APP_KEY}_${key}`);
  }
};