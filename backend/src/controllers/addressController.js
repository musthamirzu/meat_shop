import Address from "../models/Address.js";


// ==========================================
// CREATE ADDRESS
// ==========================================

export const createAddress = async (req, res) => {
  try {
    const {
      label,
      name,
      phone,
      addressLine1,
      addressLine2,
      area,
      city,
      state,
      pincode,
      landmark,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    if (
      !name ||
      !phone ||
      !addressLine1 ||
      !area ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Required address fields are missing",
      });
    }

    // If this is the first address, make it default.
    const addressCount = await Address.countDocuments({
      customerId: req.user._id,
      isActive: true,
    });

    const shouldBeDefault =
      addressCount === 0 || isDefault === true;

    // If setting this address as default,
    // remove default from previous addresses.
    if (shouldBeDefault) {
      await Address.updateMany(
        {
          customerId: req.user._id,
          isActive: true,
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    const address = await Address.create({
      customerId: req.user._id,

      label: label || "home",

      name,
      phone,
      addressLine1,
      addressLine2,
      area,
      city,
      state,
      pincode,
      landmark,

      latitude,
      longitude,

      isDefault: shouldBeDefault,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    console.error("Create address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create address",
    });
  }
};


// ==========================================
// GET MY ADDRESSES
// ==========================================

export const getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      customerId: req.user._id,
      isActive: true,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      data: {
        addresses,
      },
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};


// ==========================================
// UPDATE ADDRESS
// ==========================================

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      customerId: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const {
      label,
      name,
      phone,
      addressLine1,
      addressLine2,
      area,
      city,
      state,
      pincode,
      landmark,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    if (isDefault === true) {
      await Address.updateMany(
        {
          customerId: req.user._id,
          isActive: true,
          _id: { $ne: id },
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    address.label = label ?? address.label;
    address.name = name ?? address.name;
    address.phone = phone ?? address.phone;
    address.addressLine1 =
      addressLine1 ?? address.addressLine1;
    address.addressLine2 =
      addressLine2 ?? address.addressLine2;
    address.area = area ?? address.area;
    address.city = city ?? address.city;
    address.state = state ?? address.state;
    address.pincode = pincode ?? address.pincode;
    address.landmark =
      landmark ?? address.landmark;
    address.latitude =
      latitude ?? address.latitude;
    address.longitude =
      longitude ?? address.longitude;

    if (isDefault !== undefined) {
      address.isDefault = isDefault;
    }

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: {
        address,
      },
    });
  } catch (error) {
    console.error("Update address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};


// ==========================================
// DELETE ADDRESS
// ==========================================

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      customerId: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    address.isActive = false;
    address.isDefault = false;

    await address.save();

    // If deleted address was default,
    // make another address default.
    const remainingAddress =
      await Address.findOne({
        customerId: req.user._id,
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    if (remainingAddress) {
      remainingAddress.isDefault = true;
      await remainingAddress.save();
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      customerId: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await Address.updateMany(
      {
        customerId: req.user._id,
        isActive: true,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    address.isDefault = true;

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated",
      data: {
        address,
      },
    });
  } catch (error) {
    console.error(
      "Set default address error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to set default address",
    });
  }
};