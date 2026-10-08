import { messaging } from "../config/firebaseAdmin.js";

import FCMToken from "../models/FCMToken.js";
import Notification from "../models/Notification.js";


// ==========================================
// SEND NOTIFICATION TO USER
// ==========================================

export const sendNotificationToUser = async ({
  userId,
  title,
  message,
  type = "general",
  orderId = null,
  data = {},
}) => {
  try {
    // ------------------------------------------
    // Save notification in database
    // ------------------------------------------

    await Notification.create({
      userId,
      title,
      message,
      type,
      orderId,
      data,
    });

    // ------------------------------------------
    // Get active FCM tokens
    // ------------------------------------------

    const tokenDocuments = await FCMToken.find({
      userId,
      isActive: true,
    }).select("token");

    if (!tokenDocuments.length) {
      return {
        success: true,
        pushSent: false,
        message: "No active FCM tokens found",
      };
    }

    const tokens = tokenDocuments.map(
      (item) => item.token
    );

    // ------------------------------------------
    // Convert data values to strings
    // FCM data payload values should be strings
    // ------------------------------------------

    const stringData = Object.fromEntries(
      Object.entries({
        type,
        orderId: orderId?.toString() || "",
        ...data,
      }).map(([key, value]) => [
        key,
        value === undefined || value === null
          ? ""
          : String(value),
      ])
    );

    // ------------------------------------------
    // Send FCM
    // ------------------------------------------

    const response = await messaging.sendEachForMulticast({
      tokens,

      notification: {
        title,
        body: message,
      },

      data: stringData,
    });

    // ------------------------------------------
    // Disable invalid tokens
    // ------------------------------------------

    response.responses.forEach(async (result, index) => {
      if (!result.success) {
        const errorCode = result.error?.code;

        if (
          errorCode ===
            "messaging/registration-token-not-registered" ||
          errorCode ===
            "messaging/invalid-registration-token"
        ) {
          await FCMToken.updateOne(
            {
              token: tokens[index],
            },
            {
              $set: {
                isActive: false,
              },
            }
          );
        }
      }
    });

    return {
      success: true,
      pushSent: response.successCount > 0,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error(
      "sendNotificationToUser error:",
      error
    );

    // Notification failure should not break
    // the main order operation.

    return {
      success: false,
      pushSent: false,
      error: error.message,
    };
  }
};