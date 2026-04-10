const firebaseConfig = {
  apiKey: 'AIzaSyBTUuCI_xYBv_CQCGzt4uqqsJ8lWj--Caw',
  authDomain: 'insightboard-de3d5.firebaseapp.com',
  projectId: 'insightboard-de3d5',
  storageBucket: 'insightboard-de3d5.firebasestorage.app',
  messagingSenderId: '957065627439',
  appId: '1:957065627439:web:13a8978525c77c973f43da',
  measurementId: 'G-SZ9KWC91H9',
};

let firebaseApp: any = null;
let firebaseAuth: any = null;
let googleAuthProvider: any = null;
let firebaseAnalytics: any = null;

async function loadFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  const firebase = await import('firebase/app');
  const { getApps, initializeApp, getApp } = firebase;

  firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  return firebaseApp;
}

export async function getFirebaseAuth() {
  if (firebaseAuth && googleAuthProvider) {
    return { auth: firebaseAuth, googleProvider: googleAuthProvider };
  }

  const app = await loadFirebaseApp();
  const authModule = await import('firebase/auth');

  firebaseAuth = authModule.getAuth(app);
  googleAuthProvider = new authModule.GoogleAuthProvider();

  return { auth: firebaseAuth, googleProvider: googleAuthProvider };
}

export async function getFirebaseAnalytics() {
  if (firebaseAnalytics) return firebaseAnalytics;

  const app = await loadFirebaseApp();
  const analyticsModule = await import('firebase/analytics');
  firebaseAnalytics = analyticsModule.getAnalytics(app);
  return firebaseAnalytics;
}
