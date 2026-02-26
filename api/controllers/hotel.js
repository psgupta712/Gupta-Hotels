// controllers/hotel.js

import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// create hotel
export const createHotel = async (req, res, next) => { // ✅ fixed: req and res were swapped
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

// update hotel
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

// delete hotel
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};

// get single hotel
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

// get all hotels with optional filters
export const getHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min || 1, $lt: max || 999999 }, // ✅ fixed: | → ||
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

// count hotels by city
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => Hotel.countDocuments({ city: city.trim() }))
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// count hotels by type
export const countByType = async (req, res, next) => {
  try {
    const types = ["hotel", "apartment", "resort", "villa", "cabin"];
    const list = await Promise.all(
      types.map((type) => Hotel.countDocuments({ type }))
    );
    res.status(200).json(
      types.map((type, i) => ({ type, count: list[i] }))
    );
  } catch (err) {
    next(err);
  }
};

// get all rooms for a hotel
export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => Room.findById(room))
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};