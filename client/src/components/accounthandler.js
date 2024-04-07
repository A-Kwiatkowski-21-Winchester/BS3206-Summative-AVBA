import { NavLink } from "react-router-dom";
import "../css/accounthandler.css";

let loggedin = false;
let testToken = "null";

function logIn(){
    if (localStorage.getItem("test_token")){
        alert("Already Logged In")
    } else {
        localStorage.setItem("test_token" ,testToken)
        alert("Logged In")
        window.location.reload()
    }
    
    
}
function logOut(){
    if (localStorage.getItem("test_token")){
        localStorage.removeItem("test_token")
        alert("Logged Out")
        window.location.reload()
    } else {
        alert("Not Logged In")
    }
    
    
}

const accountBar = () => {
    
    if (localStorage.getItem("test_token")){
        return(
                <div className="loginstatus">
                    <li>Logged In</li>
                    <li><NavLink className="loginstatuslink" activeClassName="loginstatuslinkactive" to="/" onClick={logOut}>Log Out</NavLink></li>
                    
                </div>
            
        )
    } else {
        return(
            <div className="loginstatus">
                <li><NavLink className="loginstatuslink" activeClassName="loginstatuslinkactive" to="/login" onClick={logIn}>Log In</NavLink></li>
                <li><NavLink className="loginstatuslink" activeClassName="loginstatuslinkactive" to="/signup">Sign Up</NavLink></li>
            </div>
        )
    }
    
    

}
export default accountBar;
export {logIn, logOut};
