import { NavLink } from "react-router-dom";

function Navbar() {
  return(
    <nav>
      <h1>PNG Wuhan Students Association</h1>
      <div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/members">Members</NavLink>
        <NavLink to="/contact">Contact Us</NavLink>
      </div>
    </nav>
  )
}

export default Navbar;