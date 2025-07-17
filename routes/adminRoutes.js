const express = require('express');
const router = express.Router();
const {protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createUser, 
  getAllUsers, 
  updateUserVehicle, 
  updateUserRole,
  deleteUser,
  updateUserInfo,
 } = require ('../controllers/adminController')

// ✅ Create User (by Admin)
// router.post("/users", adminOnly, createUser);
// router.post("/users", adminOnly('admin'), createUser);
router.post("/users", protect, authorizeRoles('admin'), createUser);

// ✅ GET /api/admin/users → View all users with their vehicle access
router.get("/users", protect, authorizeRoles('admin'), getAllUsers);

// ✅ PUT /api/admin/users/:id/vehicles → Reassign vehicles
// router.put("/users/:id/vehicles", protect, authorizeRoles('admin'), updateUserVehicle);

// ✅ PUT /api/admin/users/:id/role → Update user role
// router.put("/users/:id/role", protect ,authorizeRoles('admin'), updateUserRole);

// ✅ PUT /api/admin/users/:id/role → Update user role
router.delete("/users/:id", protect ,authorizeRoles('admin'), deleteUser);

// ✅ PUT /api/admin/users/:id/role → Update user
router.put("/users/:id", protect ,authorizeRoles('admin'), updateUserInfo);


module.exports = router;
