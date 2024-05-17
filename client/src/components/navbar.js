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

                
                
                <li>
                <div className="dropdown-container">
                    <NavLink className="dropdown-navbar" to="/bmitest">BMI</NavLink>
                    <div className="dropdown-content">
                        <li><NavLink activeClassName="is-active" to="/bmiAdults">BMI Adult</NavLink></li>
                        <li><NavLink activeClassName="is-active" to="/bmiChildren">BMI Children</NavLink></li>
                    </div>
                </div>
                </li>
                <li>
                <div className="dropdown-container">
                    <NavLink className="dropdown-navbar">GP Appointments</NavLink>
                    <div className="dropdown-content">
                        <li><NavLink activeClassName="is-active" to="/bookAppointments">Book Appointments</NavLink></li>
                        <li><NavLink activeClassName="is-active" to="/viewAppointments">View Appointments</NavLink></li>
                    </div>
                </div>
                </li>
                <li>
                <div className="dropdown-container">
                    <NavLink className="dropdown-navbar">Mental Health</NavLink>
                    <div className="dropdown-content">
                        <li><NavLink activeClassName="is-active" to="/mentalView">View Articles</NavLink></li>
                        <li><NavLink activeClassName="is-active" to="/mentalCreate">Create Articles</NavLink></li>
                    </div>
                </div>
                </li>

                
                <li><NavLink className="navbar-item" activeClassName="is-active" to="/contact">Contact Us</NavLink></li>

            
            </div>
        </nav>
    )
}


export default Navbar;