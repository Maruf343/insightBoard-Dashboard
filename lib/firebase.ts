function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

function validateFirebaseConfig(config: Record<string, string | undefined>) {
  const missingKeys = [];
  if (!config.apiKey) missingKeys.push('NEXT_PUBLIC_FIREBASE_API_KEY');
  if (!config.authDomain) missingKeys.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  if (!config.projectId) missingKeys.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  if (!config.appId) missingKeys.push('NEXT_PUBLIC_FIREBASE_APP_ID');

  if (missingKeys.length) {
    throw new Error(
      `Firebase environment variables are not configured correctly. Missing: ${missingKeys.join(', ')}. ` +
      `Set the required Firebase env vars in your deployment environment, then rebuild.`
    );
  }

  return config as {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId: string;
    measurementId?: string;
  };
}

let firebaseApp: any = null;
let firebaseAuth: any = null;
let googleAuthProvider: any = null;
let firebaseAnalytics: any = null;

async function loadFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  const firebaseConfig = validateFirebaseConfig(getFirebaseConfig());
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
