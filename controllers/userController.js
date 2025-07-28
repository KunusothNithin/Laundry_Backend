const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper to generate Token

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//POST /api/users

const registerUser = async (req, res) => {
  try {
    const { name, id, email, phone, password } = req.body;

    // ✅ Check if email ends with @rgukt.ac.in
    if (!email.endsWith("@rgukt.ac.in")) {
      return res
        .status(400)
        .json({ message: "Only RGUKT domain emails are allowed" });
    }

    // 🔍 Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // 🔐 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🆕 Create and save the user
    const newUser = new User({
      name,
      id,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Respond with success and token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        id: newUser.id,
        email: newUser.email,
        token: generateToken(newUser._id),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return es.status(400).json({ message: "Invalid email or password" });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.params.id;
    const image = req.file?.filename;

    const updateData = { name, phone };
    if (image) updateData.image = image;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Updated Profile", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};


const updateRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    res.status(200).json({ message: "Role is Changed", user: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "update role is Failed", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateRole,
  getUser,
  updateProfile,
};
