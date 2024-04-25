import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/navbar.css";


const p = <li>testestestest</li>

const Navbar = () => {

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
                <li>
                    <div className="dropdown-container">
                        <NavLink className="dropdown-navbar" to="/">Dropdown</NavLink>
                        <div className="dropdown-content">
                            <li>ddd</li>
                            <li>ccc</li>
                            <li>bbb</li>
                        </div>

                    </div>

                </li>
            </div>
        </nav>
    )
}


export default Navbar;