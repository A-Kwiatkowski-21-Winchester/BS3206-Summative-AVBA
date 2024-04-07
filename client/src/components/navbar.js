import React, { useState } from "react";
import { Link } from "react-router-dom";
import {styles }from "../css/navbar.css";

const Navbar = () => {
    const [isOpen, setOpen] = useState(false);
    return (
        <nav>
            <div>
                <Link className="navbar-item" activeClassName="is-active" to="/">Home</Link>
                <Link className="navbar-item" activeClassName="is-active" to="/login">Physical</Link>
                <Link className="navbar-item" activeClassName="is-active" to="/">Mental</Link>
                <Link className="navbar-item" activeClassName="is-active" to="/">Fitness</Link>
                <Link className="navbar-item" activeClassName="is-active" to="/">Support</Link>
            </div>
        </nav>
    )
}

export default Navbar;