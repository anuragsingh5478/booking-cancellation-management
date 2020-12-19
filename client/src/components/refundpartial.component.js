import React, { Component } from "react";
import axios from "axios";

export default class RefundPartial extends Component {
  constructor(props) {
    super(props);
    this.state = { id: 0, refund: 0 };
  }
  componentDidMount() {
    this.setState({ id: this.props.match.params.id });
    axios
      .get("http://localhost:5000/refundpartial/" + this.props.match.params.id)
      .then((res) => {
        this.setState({ refund: res.data.refund });
      });
  }

  render() {
    return (
      <div>
        <h1>
          Booking partially cancelled, refund of rs <u> {this.state.refund}</u>{" "}
          initiated{" "}
        </h1>
      </div>
    );
  }
}
