import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class EditBooking extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeCheckinDate = this.onChangeCheckinDate.bind(this);
    this.onChangeCheckoutDate = this.onChangeCheckoutDate.bind(this);
    this.onChangeGuest = this.onChangeGuest.bind(this);
    this.onChangePaidPercent = this.onChangePaidPercent.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      checkin_date: new Date(),
      checkout_date: new Date(),
      no_of_guest: 0,
      paid: 100,
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangeCheckinDate(date) {
    this.setState({
      checkin_date: date,
    });
  }

  onChangeCheckoutDate(date) {
    this.setState({
      checkout_date: date,
    });
  }

  onChangeGuest(e) {
    this.setState({
      no_of_guest: e.target.value,
    });
  }

  onChangePaidPercent(e) {
    this.setState({
      paid: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const newBooking = {
      id: this.props.match.params.id,
      email: this.state.email,
      checkin_date: this.state.checkin_date,
      checkout_date: this.state.checkout_date,
      no_of_guest: this.state.no_of_guest,
      paid: this.state.paid,
    };

    console.log(newBooking);

    axios
      .post(
        "http://localhost:5000/partialcancel/" + this.props.match.params.id,
        newBooking
      )
      .then((res) => console.log(res.data));

    window.location = "/refundpartial/" + this.props.match.params.id;
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/booking/" + this.props.match.params.id)
      .then((response) => {
        this.setState({
          email: response.data.email,
          checkin_date: new Date(response.data.checkin_date),
          checkout_date: new Date(response.data.checkout_date),
          no_of_guest: response.data.no_of_guest,
          paid: response.data.paid,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <h3>Partial Cancel Booking</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Email id: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.email}
              onChange={this.onChangeEmail}
              disabled="disabled"
            />
          </div>
          <div className="form-group">
            <label>Checkin-Date: </label>
            <div>
              <DatePicker
                selected={this.state.checkin_date}
                onChange={this.onChangeCheckinDate}
                disabled="disabled"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Checkout-Date: </label>
            <div>
              <DatePicker
                selected={this.state.checkout_date}
                onChange={this.onChangeCheckoutDate}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Number of Guest: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.no_of_guest}
              onChange={this.onChangeGuest}
            />
          </div>
          <div className="form-group">
            <label>Pay: (100% or 30%) </label>
            <br />
            <select
              value={this.state.paid}
              onChange={this.onChangePaidPercent}
              disabled="disabled"
            >
              <option value="100">100%</option>
              <option value="30">30%</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Save Booking"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
