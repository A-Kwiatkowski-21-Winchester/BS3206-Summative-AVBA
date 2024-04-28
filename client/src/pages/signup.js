import { NavLink } from "react-router-dom";
import "../css/signup.css"

function formSubmit(){
    var formdataname = document.forms["signupDetails"]["fname"].value;
    var formdatapass = document.forms["signupDetails"]["fpassword"].value;
    alert(formdataname.concat(formdatapass))
    alert(document.forms["signupDetails"][2].value)
}
function formCancel(){
    alert("Cancel")
}

const SignUp = () => (
    <div>
        <div className="signupText">
        <h1>Sign Up</h1>
        <p>
            Please fill out the details below and click submit to register your account
        </p>
        </div>
        <form name="signupDetails">
            <li className="formEntry">First Name: <input type="text" name="fnameinput"></input></li>
            <li className="formEntry">Surname: <input type="text" name="snameinput"></input></li>
            <li className="formEntry">Title: <input type="text" name="titleinput"></input></li>
            <li className="formEntry">Email Address: <input type="text" name="eaddressinput"></input></li>
            <li className="formEntry">Postcode: <input type="text" name="postcodeinput"></input></li>
            <li className="formEntry">Password: <input type="password" name="passwordinput"></input></li>
            <li className="formEntry">Confirm Password: <input type="password" name="confpasswordinput"></input></li>
            <button className="formButton" onClick={formSubmit}>Submit</button><button className="formButton" onClick={formCancel}>Cancel</button>
        </form>
    </div>
);
export default SignUp