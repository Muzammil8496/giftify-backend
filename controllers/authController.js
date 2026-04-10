const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { UniqueConstraintError } = require('sequelize');
const { User, Wishlist, Address, Order } = require('../models');
const { generateToken } = require('../utils/token');

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// ─── Register ──────────────────────────────────────────────────────────────

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });

    if (!isValidEmail(email))
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });

    if (password.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : null,
    });

    await Wishlist.create({ userId: user.id });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Please login.',
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError)
      return res.status(400).json({ success: false, message: 'Email already in use' });
    next(error);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    return res.json({
      success: true,
      token: generateToken(user),
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Me ────────────────────────────────────────────────────────────────────

const me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'phone', 'gender', 'dob', 'avatar', 'role', 'createdAt'],
    });
    return res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── Update Profile (TICKET-005) ───────────────────────────────────────────

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const { name, phone, gender, dob } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone ? phone.trim() : null;
    if (gender !== undefined) user.gender = gender || null;
    if (dob !== undefined) user.dob = dob || null;

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Change Password (TICKET-007) ─────────────────────────────────────────

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both passwords are required' });

    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });

    const user = await User.findByPk(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Upload Avatar (TICKET-006) ────────────────────────────────────────────

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: 'No file uploaded' });

    const user = await User.findByPk(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    // Delete old avatar file if it exists locally
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', 'public', user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save new avatar URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    return res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: `http://localhost:5000${avatarUrl}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me, updateProfile, changePassword, uploadAvatar };