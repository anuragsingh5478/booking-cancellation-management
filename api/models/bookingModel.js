/*this file defines the schema for the model*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var booking = new Schema({
  email: String,
  checkin_date: Date,
  checkout_date: Date,
  no_of_guest: Number,
  cost: Number,
  paid: Number,
  status: String,
  refund: Number,
});

module.exports = mongoose.model("booking", booking);
