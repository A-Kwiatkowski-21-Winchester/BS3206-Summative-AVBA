import axios from "axios";
import "../css/accountbar.css";
import React, { useEffect, useState } from 'react';
import { getToken, getUserID } from "../libs/cookies";
import sha256 from "js-sha256"
let loggedin = false;
let tokenContent = "null";

function logIn() {
    var cred = {
        email:document.forms["loginCredentialsEntry"]["loginEmail"].value,
        password:sha256(document.forms["loginCredentialsEntry"]["loginPassword"].value),
    }
    axios.get(`http://localhost:8080/api/users/session/create?iden=${cred.email}&password=${cred.password}`)
    .then(
        (/*response*/) => {window.location.reload()}, 
        (error) => {
            console.error(error);
            alert("Invalid username or password")
        }
    )
    

    // if (localStorage.getItem("loginStatus") == null) { //Check for presence of "loginStatus" token in localStorage 
    //     localStorage.setItem("loginStatus", tokenContent) //If "loginStatus" is null, user is not logged in and "loginStatus" is not present. Add it.
    //     //Aditional code is required for account credential verification and handling
    //     window.location.reload() //As login is done via the page header, the page must be refreshed to update the UI whilst keeping the user on the same page
    // } else {
    //     alert("Uh oh! Something has gone wrong!")
    //     //User is already logged in and the login button should not be able to be pressed
    //     //If somehow user presses login whilst already being logged in, should redirect to error page.
    // }
}

function logOut() {
try {
    axios.delete("http://localhost:8080/api/users/session/expire").then(
        (/*response*/) => {window.location.reload()}, 
        (error) => {console.error(error)}
    )
} catch (error) {
    alert("beep boop")
}



    // if (localStorage.getItem("loginStatus")) { //Check for presence of "loginStatus" token in localStorage
    //     localStorage.removeItem("loginStatus") //If "loginStatus" is present, user is logged in. "loginStatus" token should be removed to facilitate logout
    //     alert("You have been logged out") //Inform the user that they have been logged out
    //     window.location = "/" //Send the user to the homepage, as they may be on any page when logging out, and may lose view permissions
    //     //Sending user back to homepage is best way to mitigate potential issues 
    // }
}

function sendToSignup() {
    window.location = "/signup" //Redirect user to signup page
}

function sendToAccount() {
    window.location = "/account" //Redirect user to account page. Potentially further code needed if data needs to be passed during this redirect
}

export default function AccountBar() {  //Construct accountBar component

    const [userID, setUserID] = useState(undefined);

    useEffect(() => {
        // If there is no token stored in cookies, return early without request
        if(!getToken()) {
            setUserID(false)
            return
        }

        axios.get(`http://localhost:8080/api/users/session/check`)
            .then(
                (response) => {
                    setUserID(response.data.userID) 
                }, 
                (error) => { 
                    console.log(error)
                    setUserID(false)
                });
    }, []);

    if(userID === undefined) { // If the request hasn't gone through yet
        return <p style={{color: "white"}}>LOADING...</p>
    }

    if(userID) {
        console.log("There's an ID!");
        return (
            <div className="loggedinInteract">
                {/* <li><button onClick={sendToAccount}>My Account</button></li> */}
                <li style={{color: "white"}}>ID: {userID}</li>
                <li><button onClick={logOut}>Log Out</button></li>
            </div>
        )
    }

    console.log("There is no ID!")
    return (
        <div className="loginInteract">
            <div className="loginCred">
                <form name="loginCredentialsEntry">
                    <div>
                        <li className="loginCredLabel">Email:</li>
                        <li className="loginCredEntry"><input type="text" name="loginEmail" required></input></li>

                    </div>
                    <div>
                        <li className="loginCredLabel">Password:</li>
                        <li className="loginCredEntry"><input type="password" name="loginPassword" required></input></li>

                    </div>
                </form>
            </div>
            <div className="loginButton">
                <li><button onClick={logIn}>Log In</button></li>
                <li><button onClick={sendToSignup}>Sign Up</button></li>
            </div>
        </div>
    )
}


