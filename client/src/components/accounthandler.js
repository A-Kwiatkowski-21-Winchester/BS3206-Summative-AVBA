let loggedin = false;
let testToken = "null";

function logIn(){
    if (localStorage.getItem("test_token")){
        alert("Already Logged In")
    } else {
        localStorage.setItem("test_token" ,testToken)
        alert("Logged In")
    }
    
    
}
function logOut(){
    if (localStorage.getItem("test_token")){
        localStorage.removeItem("test_token")
        alert("Logged Out")
    } else {
        alert("Not Logged In")
    }
    
    
}

export {logIn, logOut}
