import { NavLink } from "react-router-dom";
import "../css/signup.css"
import axios from 'axios';
import {useState} from 'react';
import {useEffect} from 'react';
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css"
import * as querystring from "querystring-es3"
import { getUserID } from "../libs/cookies";

function formCancel() {
    window.location = "/"
}

export default function SignUp() {
    const [dob, setDob] = useState("");
    useEffect(() => {
        //Runs only on the first render
        document.forms["signupDetails"].onsubmit = function(e){
            e.preventDefault();
            formSubmit()
            alert("Signup Sucessful!")
            window.location = "/"
        }
    }, []);
    return (<div>
        <div className="signupText">
            <h1>Sign Up</h1>
            <p>
                Please fill out the details below and click submit to register your account
            </p>
        </div>
        <form name="signupDetails" id="signup">
            <li className="formEntry">First Name: <input type="text" name="fnameinput" required></input></li>
            <li className="formEntry">Surname: <input type="text" name="snameinput" required></input></li>
            <li className="formEntry">Title: <input type="text" name="titleinput" required></input></li>
            <li className="formEntry">Sex: <select name="sexinput" required><option value="0">Male</option><option value="1">Female</option><option value="2">Other</option></select></li>
            <li className="formEntry">Email Address: <input type="text" name="eaddressinput" required></input></li>
            <li className="formEntry">Postcode: <input type="text" name="postcodeinput" required></input></li>
            <li className="formEntry">Password: <input type="password" name="passwordinput" required></input></li>
            <li className="formEntry">Confirm Password: <input type="password" name="confpasswordinput" required></input></li>
            <li className="formEntry">DOB: <DatePicker name="dateinput" className="form-control" minDate={new Date("1910/08/01")} maxDate={new Date()} selected={dob} onChange={(date) => setDob(date)} showMonthDropdown showYearDropdown dropdownMode="select" /></li>
            <button className="formButton" onSubmit={formSubmit}>Submit</button><button type="button" className="formButton" onClick={formCancel}>Cancel</button>
        </form>
    </div>)
    function formSubmit() {

        console.log("User ID:", getUserID());

        var form = document.forms["signupDetails"];
        var accountData = {
    
            firstName: form["fnameinput"].value,
            lastName: form["snameinput"].value,
            title: form["titleinput"].value, 
            dob: form["dateinput"].value,/// Don't think so.
            sex: form["sexinput"].value,
            phone: "000000000000",
            email: form["eaddressinput"].value,
            postcode: form["postcodeinput"].value,
            password: form["passwordinput"].value,
            isAdmin: false
    
        }
    
        if (form["passwordinput"].value == form["confpasswordinput"].value && form["passwordinput"].value != "") {
            axios.post("http://localhost:8080/api/users/create?" + querystring.stringify(accountData))
                .then((response) => {
                    console.log("Status:", response.status);
                    console.log("New ID:", response.data.id);

                    axios.get(`http://localhost:8080/api/users/session/create?iden=${response.data.id}&idenForm=id&password=${accountData.password}`)
                        .then(response => {
                            console.log("Session creation response:", response)
                            console.log("Checking token...")
                            
                            axios.get(`http://localhost:8080/api/users/session/check`)
                                .then(response => {
                                    console.log("Check response:", response)
                                })
                        })
                }, (error) => {
                    console.log(error);
                })
    
        } else { alert("Passwords do not match or are empty!") }
    }


}

















