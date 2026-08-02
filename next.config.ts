import type { NextConfig } from "next";

function firebaseEnv(name: string) {
  const reactKey = `REACT_APP_FIREBASE_${name}`;
  const publicKey = `NEXT_PUBLIC_FIREBASE_${name}`;
  return process.env[publicKey] ?? process.env[reactKey];
}

const nextConfig: NextConfig = {
  env: {
    REACT_APP_FIREBASE_API_KEY: firebaseEnv("API_KEY"),
    REACT_APP_FIREBASE_AUTH_DOMAIN: firebaseEnv("AUTH_DOMAIN"),
    REACT_APP_FIREBASE_PROJECT_ID: firebaseEnv("PROJECT_ID"),
    REACT_APP_FIREBASE_STORAGE_BUCKET: firebaseEnv("STORAGE_BUCKET"),
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID: firebaseEnv("MESSAGING_SENDER_ID"),
    REACT_APP_FIREBASE_APP_ID: firebaseEnv("APP_ID"),
    REACT_APP_FIREBASE_MEASUREMENT_ID: firebaseEnv("MEASUREMENT_ID"),
    NEXT_PUBLIC_FIREBASE_API_KEY: firebaseEnv("API_KEY"),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseEnv("AUTH_DOMAIN"),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseEnv("PROJECT_ID"),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseEnv("STORAGE_BUCKET"),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseEnv("MESSAGING_SENDER_ID"),
    NEXT_PUBLIC_FIREBASE_APP_ID: firebaseEnv("APP_ID"),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: firebaseEnv("MEASUREMENT_ID"),
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
