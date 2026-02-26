// controllers/auth.js

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    // 1. check user
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "Invalid credentials"));

    // 2. check password
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return next(createError(401, "Invalid credentials"));

    // 3. create token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    // 4. remove password from response
    // ✅ Fixed: user._doc can be undefined in newer Mongoose — use toObject() instead
    const { password, ...userData } = user.toObject();

    // 5. send response
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userData);

  } catch (err) {
    next(err);
  }
};