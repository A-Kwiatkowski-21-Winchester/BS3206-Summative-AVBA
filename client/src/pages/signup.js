import { NavLink } from "react-router-dom";
import "../css/signup.css"

function f(){
    var formdataname = document.forms["signupDetails"]["fname"].value;
    var formdatapass = document.forms["signupDetails"]["fpassword"].value;
    alert(formdataname.concat(formdatapass))
}
function f2(){
    alert("Cancel")
}

const SignUp = () => (
    <div>
        <form name="signupDetails">
            <li className="formEntry">Name: <input type="text" name="fname"></input></li>
            <li className="formEntry">Password: <input type="password" name="fpassword"></input></li>
            <input className="formButton" type="button" value="Submit" onClick={f}/><input className="formButton" type="button" value="Cancel" onClick={f2}/>
        </form>
    </div>
);
export default SignUp