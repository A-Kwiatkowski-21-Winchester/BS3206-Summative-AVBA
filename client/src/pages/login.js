import React from "react";
import {logIn,logOut} from "../components/accounthandler";

function loginbutton(){
    alert("hello world");
    return(null);
}


const Login = () => (
    <>
    <div>
        <h1>Login Page</h1>
        <p>
            Login text Login text
            Login text Login text
        </p>
        <button onClick={logIn}>Login</button>
        <button onClick={logOut}>Log Out</button>
    </div>
    </>
);

export default Login;