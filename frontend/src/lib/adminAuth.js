const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '6767';
const STORAGE_KEY = 'asa_admin_auth';

export function adminLogin(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    return true;
  }
  return false;
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem(STORAGE_KEY) === 'true';
}

export function adminLogout() {
  sessionStorage.removeItem(STORAGE_KEY);
}