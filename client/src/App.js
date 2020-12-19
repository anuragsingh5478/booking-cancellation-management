import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/navbar.component";
import BookingList from "./components/bookingList.componet";
import CreateBooking from "./components/newBooking.component";
import Refund from "./components/refund.component";
import EditBooking from "./components/editBooking.component";
import RefundPartial from "./components/refundpartial.component";
function App() {
  return (
    <div className="container">
      <Router>
        <Navbar />
        <br />
        <Route path="/" exact component={BookingList} />
        <Route path="/booking" exact component={CreateBooking} />
        <Route path="/edit/:id" exact component={EditBooking} />
        <Route path="/refund/:id" exact component={Refund} />
        <Route path="/refundpartial/:id" exact component={RefundPartial} />
      </Router>
    </div>
  );
}

export default App;
