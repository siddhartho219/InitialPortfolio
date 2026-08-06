"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/** Static access required — Next.js only inlines literal process.env.KEY names. */
export function getFirebaseConfig() {
  return {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
      process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
      process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
      process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
      process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
      process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ??
      process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };
}

export function isFirebaseConfigured() {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.projectId && config.appId);
}

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

function ensureFirebase() {
  if (typeof window === "undefined") {
    return false;
  }

  if (!isFirebaseConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Firebase] Missing env vars. Add REACT_APP_FIREBASE_* or NEXT_PUBLIC_FIREBASE_* to .env.local and restart the dev server.",
      );
    }
    return false;
  }

  if (!firebaseApp) {
    const config = getFirebaseConfig();
    firebaseApp = getApps().length ? getApps()[0] : initializeApp(config);
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
  }

  return true;
}

/** @returns {import("firebase/auth").Auth | null} */
export function getClientAuth() {
  return ensureFirebase() ? firebaseAuth : null;
}

/** @returns {import("firebase/firestore").Firestore | null} */
export function getClientDb() {
  return ensureFirebase() ? firebaseDb : null;
}
