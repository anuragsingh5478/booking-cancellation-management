/*This file helps to create new booking and shows all active bookings.*/

const express = require("express");
const router = express.Router();
const fs = require("fs");
var booking = require("../models/bookingModel");

//Returns the list of active bookings.
router.get("/", (req, res) => {
  booking.find({ status: "booked" }, (err, docs) => {
    if (err) console.log(err);
    res.json(docs);
  });
});

//Return the booking with specified id
router.get("/booking/:id", (req, res) => {
  var id = req.params.id;
  booking.findById(id, (err, docs) => {
    if (err) console.log(err);
    res.json(docs);
  });
});

//To read the data from charge.json to know the room price and processing charge
var rawdata = fs.readFileSync("./data/charges.json");
var charges = JSON.parse(rawdata);

//function calc no. of days between a and b, where  a and b are javascript Date objects
function calc_days(a, b) {
  const utc1 = new Date(a);
  const utc2 = new Date(b);
  return Math.floor(utc2 - utc1) / (1000 * 60 * 60 * 24);
}

//calc the total cost of booking, where a: checkin date, b: checkout date, guest: no. of guest
function calc_cost(a, b, guest) {
  return charges.room * calc_days(a, b) * guest;
}

//this function create a new booking with request received and save it in the database.
router.post("/booking", (req, res) => {
  var bookingDetails = req.body;

  var newBooking = new booking({
    email: bookingDetails.email,
    checkin_date: bookingDetails.checkin_date,
    checkout_date: bookingDetails.checkout_date,
    no_of_guest: bookingDetails.no_of_guest,
    cost: Math.ceil(
      calc_cost(
        bookingDetails.checkin_date,
        bookingDetails.checkout_date,
        bookingDetails.no_of_guest
      )
    ),
    paid: bookingDetails.paid,
    status: "booked",
    refund: 0,
  });

  newBooking.save((err, booking) => {
    //res.send("booking successful, cost: " + newBooking.cost);
    console.log("booking sucessful");
  });
});

module.exports = router;
