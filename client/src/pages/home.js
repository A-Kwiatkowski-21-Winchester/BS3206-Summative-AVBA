import React from "react";
import {logIn,logOut} from "../components/accounthandler";

const Home = () => (
    <div>
        <h1>Home Page</h1>
        <p>
            homepage text homepage text
            homepage text homepage text
        </p>
        <button onClick={logIn}>Login</button>
        <button onClick={logOut}>Log Out</button>
    </div>
);

export default Home;