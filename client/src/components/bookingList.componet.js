import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const List = (props) => {
  return (
    <tr>
      <td>{props.bookings.email}</td>
      <td>{props.bookings.checkin_date.substring(0, 10)}</td>
      <td>{props.bookings.checkout_date.substring(0, 10)}</td>
      <td>{props.bookings.no_of_guest}</td>
      <td>{props.bookings.cost}</td>
      <td>{props.bookings.paid}</td>
      <td>
        <button className="btn btn-warning" style={{ margin: "0px 5px" }}>
          <Link to={"/refund/" + props.bookings._id}>Full cancellation</Link>
        </button>
        <button className="btn btn-warning">
          <Link to={"/edit/" + props.bookings._id}>Partial cancellation</Link>
        </button>
      </td>
    </tr>
  );
};

export default class BookingList extends Component {
  constructor(props) {
    super(props);
    this.state = { bookings: [] };
  }
  componentDidMount() {
    axios
      .get("http://localhost:5000/")
      .then((response) => {
        this.setState({ bookings: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  showList() {
    return this.state.bookings.map((currentBooking) => {
      return <List bookings={currentBooking} key={currentBooking._id} />;
    });
  }
  render() {
    return (
      <div>
        <h3>All Bookings</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Email</th>
              <th>Checkin-date</th>
              <th>Checkout-date</th>
              <th>Guest</th>
              <th>Cost</th>
              <th>Paid(%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.showList()}</tbody>
        </table>
      </div>
    );
  }
}
