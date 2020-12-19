import React, { Component } from "react";
import axios from "axios";

export default class Refund extends Component {
  constructor(props) {
    super(props);
    this.state = { id: 0, cost: 0 };
  }
  componentDidMount() {
    this.setState({ id: this.props.match.params.id });
    axios
      .get("http://localhost:5000/refundfull/" + this.props.match.params.id)
      .then((res) => {
        this.setState({ cost: res.data.cost });
      });
    //remove comment for complete full cancellation operation
    axios.put("http://localhost:5000/cancel", {
      id: this.props.match.params.id,
    });
  }

  render() {
    return (
      <div>
        <h1>
          Booking cancelled, refund of rs <u> {this.state.cost}</u> initiated{" "}
        </h1>
      </div>
    );
  }
}
