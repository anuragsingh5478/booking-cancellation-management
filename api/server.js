const express = require("express");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.port || 5000;

const bookingRoute = require("./routes/bookingRoute");
const cancelRoute = require("./routes/cancelRoute");
app.use("/", bookingRoute);
app.use("/", cancelRoute);

const booking = require("./models/bookingModel");
mongoose.connect("mongodb://localhost/BookingManagement", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.listen(port, () => {
  console.log(`server started at port: ${port}`);
});
