const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const bcrypt = require("bcryptjs");

// ✅ Create User (by Admin)
exports.createUser =  async (req, res) => {
    const { name, email, role, assignedVehicles } = req.body;
    // console.log("📥 Incoming Data:", { name, email, role, assignedVehicles });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // const tempPassword = "Fleet" + Math.floor(1000 + Math.random() * 9000);
    const tempPassword = "Fleet10000";
    const hashed = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      name,
      email,
      role,
      password: hashed,
      assignedVehicles,
    });

    // (Optional) TODO: Send email with tempPassword
    res.json({
         message: "User created",
          user, password: tempPassword // ⚠️ for now, we return it in response (you can email later)
         });
  } catch (err) {
    console.error("❌ Create User Error:", err); // log full error
     res.status(500).json({ message: err.message || "Something went wrong" });
    }
};

// ✅ GET /api/admin/users → View all users with their vehicle access
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("assignedVehicles", "name licensePlate status");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ PUT /api/admin/users/:id/vehicles → Reassign vehicles
exports.updateUserVehicle = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { assignedVehicles: req.body.assignedVehicles },
      { new: true }
    ).populate("assignedVehicles", "name");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Vehicles updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ PUT /api/admin/users/:id/role → Update user role
exports.updateUserRole =  async (req, res) => {
  try {
    const { role } = req.body;

    if (!["viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) return res.status(404).json({ message: "User not found" });

         res.json({ message: "User deleted successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ✅ PUT /api/admin/users/:id → Update full user info
exports.updateUserInfo = async (req, res) => {
  try {
    const { name, email, role, assignedVehicles } = req.body
    console.log("📥 Incoming Data for updating:", { name, email, role, assignedVehicles });

    // Optional: validate inputs
    if (!["admin", "manager", "viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" })
    }

    // Optional: validate email format
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" })
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
        assignedVehicles,
      },
      { new: true }
    ).populate("assignedVehicles", "name")

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
