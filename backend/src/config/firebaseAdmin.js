import {
  initializeApp,
  applicationDefault,
  getApps,
} from "firebase-admin/app";

import { getMessaging } from "firebase-admin/messaging";

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
        projectId: "meat-shop-7c531",
      });

export const messaging = getMessaging(firebaseApp);