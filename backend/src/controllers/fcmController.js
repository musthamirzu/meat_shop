import FCMToken from "../models/FCMToken.js";


// ==========================================
// REGISTER FCM TOKEN
// ==========================================

export const registerFCMToken = async (req, res) => {
  try {
    const {
      token,
      deviceType = "web",
    } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    const fcmToken = await FCMToken.findOneAndUpdate(
      {
        token,
      },
      {
        userId: req.user._id,
        deviceType,
        isActive: true,
        lastUsedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "FCM token registered successfully",
      fcmToken,
    });
  } catch (error) {
    console.error("registerFCMToken error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register FCM token",
      error: error.message,
    });
  }
};


// ==========================================
// REMOVE FCM TOKEN
// ==========================================

export const removeFCMToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    await FCMToken.updateOne(
      {
        token,
        userId: req.user._id,
      },
      {
        $set: {
          isActive: false,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "FCM token removed successfully",
    });
  } catch (error) {
    console.error("removeFCMToken error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove FCM token",
      error: error.message,
    });
  }
};