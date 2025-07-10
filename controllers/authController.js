const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to create JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, company: user.company },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register new user
exports.register = async (req, res) => {
  const { name, email, password, role, company } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role, company });
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user profile (name, password)
exports.updateProfile = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updated = await user.save();

    res.json({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      company: updated.company,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Admin update company settings
exports.updateCompanySettings = async (req, res) => {
  const { companyName, timezone, logo } = req.body;

  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can update company settings' });
    }

    const users = await User.updateMany(
      { company: req.user.company },
      { $set: { companyName, timezone, logo } }
    );

    res.json({ message: 'Company settings updated for all users in company' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

