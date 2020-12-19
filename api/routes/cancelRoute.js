/*This file contails cancel routes and logic for full cancellation and partial cancellation.
First we have some helper function, then respective function for calculating refunds
of full and partial cancellation*/

const express = require("express");
const router = express.Router();
const fs = require("fs");
var booking = require("../models/bookingModel");

//To read the data from charge.json to know the room price and processing charge
var rawdata = fs.readFileSync("./data/charges.json");
var charges = JSON.parse(rawdata);

//function to calc the remaining day from today
function calcRemainingDay(checkin_date) {
  const utc1 = Date.now();
  const utc2 = new Date(checkin_date);

  return Math.floor(utc2 - utc1) / (1000 * 60 * 60 * 24);
}

//function to calc charges for full cancellation according to time left for checkin date
function calcRefundAmountForFullCancellation(cost, paid, checkin_date) {
  if (paid == 30) {
    var dayRemain = calcRemainingDay(checkin_date);
    if (dayRemain > 7) return 0.3 * cost - charges.processing;
    else return 0;
  }
  if (paid == 100) {
    var dayRemain = calcRemainingDay(checkin_date);
    if (dayRemain >= 7) return cost - charges.processing;
    else return cost - 0.3 * cost;
  }
}

//function to calc no. of days between a and b, where a and b are javascript Date objects
function calc_days(a, b) {
  const utc1 = new Date(a);
  const utc2 = new Date(b);
  return Math.floor(utc2 - utc1) / (1000 * 60 * 60 * 24);
}

//function to calc the total cost,
//where a = checkin date, b = checkout date,guest = no. of guest
function calc_cost(a, b, guest) {
  return charges.room * calc_days(a, b) * guest;
}

//function to calc refund amount in case of partial cancellation
//where cost = old cost, paid = % of cost paid, checkin_date = checkin date, check_out_date = checkout date, no_of_guest = no. of guest
function calcRefundAmountForPartialCancellation(
  cost,
  paid,
  checkin_date,
  checkout_date,
  no_of_guest
) {
  var newCost = calc_cost(checkin_date, checkout_date, no_of_guest);
  if (paid == 30) {
    var dayRemain = calcRemainingDay(checkin_date);
    if (dayRemain > 7) return 0.3 * (cost - newCost);
    //initiate full 30% refund for each cancelled unit
    else return 0; //no refund for cancelled unit
  } else {
    var dayRemain = calcRemainingDay(checkin_date);
    if (dayRemain >= 7) return cost - newCost;
    //initiate full 100% refund for each cancelled unit
    else return cost - newCost - 0.3 * (cost - newCost); //refund after 30 % deduction of each cancelled unit
  }
}

/*To get the refund in case of full cancellation*/
router.get("/refundfull/:id", (req, res) => {
  var id = req.params.id;
  booking
    .findById(id)
    .then((currentBooking) =>
      res.json({
        cost: calcRefundAmountForFullCancellation(
          currentBooking.cost,
          currentBooking.paid,
          currentBooking.checkin_date
        ),
      })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

//function to full cancellation of specified booking by changing the status from "booked" to "cancelled"
router.put("/cancel/", (req, res) => {
  var bookingId = req.body.id;
  console.log("id is" + bookingId);
  booking
    .findById(bookingId)
    .then((currentBooking) => res.json(currentBooking))
    .catch((err) => res.status(400).json("Error: " + err));

  booking.findByIdAndUpdate(bookingId, { status: "cancelled" }, (err, docs) => {
    if (err) console.log(err);
    console.log(docs);
  });
});

//function for partial cancel the specified booking, updating the booking details, calc and store the refund amount
router.route("/partialcancel/:id").post((req, res) => {
  booking
    .findById(req.params.id)
    .then((mybooking) => {
      mybooking.no_of_guest = Number(req.body.no_of_guest);
      mybooking.checkout_date = Date.parse(req.body.checkout_date);
      mybooking.refund = calcRefundAmountForPartialCancellation(
        Number(mybooking.cost),
        Number(mybooking.paid),
        mybooking.checkin_date,
        req.body.checkout_date,
        Number(req.body.no_of_guest)
      );
      mybooking.cost = calc_cost(
        mybooking.checkin_date,
        req.body.checkout_date,
        req.body.no_of_guest
      );

      mybooking
        .save()
        .then(() => {
          console.log("Booking updated!");
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//function to get the refund in case of partial cancellation
router.get("/refundpartial/:id", (req, res) => {
  var id = req.params.id;
  booking
    .findById(id)
    .then((currentBooking) => res.json({ refund: currentBooking.refund }))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
