import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/navbar.css";

const Navbar = () => {
    const [isOpen, setOpen] = useState(false);
    const toggleClass = () => {

    };
    return (
        <nav>
            <div className="navbar">   {/* NavBar links currently link to "placeholder pages". 
            These can be updated should another URL be better suited to your page(s). The URL 
            should match that set in the App.js */}
                <li><NavLink className="navbar-item" activeClassName="is-active" to="/" >Home</NavLink></li>
                <li><NavLink className="navbar-item" activeClassName="is-active" to="/physical">Physical</NavLink></li>
                <li><NavLink className="navbar-item" activeClassName="is-active" to="/mental">Mental</NavLink></li>
                <li><NavLink className="navbar-item" activeClassName="is-active" to="/fitness">Fitness</NavLink></li>
                <li><NavLink className="navbar-item" activeClassName="is-active" to="/support">Support</NavLink></li>
            </div>
        </nav>
    )
}


export default Navbar;