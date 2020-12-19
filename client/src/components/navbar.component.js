import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          HotelBooking
        </Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">
                Show all booking
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/booking" className="nav-link">
                Create new booking
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
// import "./components.css";

// export default function Navbar() {
//   return (
//     <div>
//       <ul>
//         <li>
//           <a href="#">show all booking</a>
//         </li>
//         <li>
//           <a href="#">create new booking</a>
//         </li>
//         <li>
//           <a href="#">delete booking</a>
//         </li>
//       </ul>
//     </div>
//   );
// }
