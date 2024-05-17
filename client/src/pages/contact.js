import React from "react";
import "../css/contact.css"

function formSubmit(){
    var formdataname = document.forms["contactDetails"]["eaddressInput"].value;
    var formdatapass = document.forms["contactDetails"]["feedtypeInput"].value
    alert(formdataname.concat(formdatapass))
    alert(document.forms["contactDetails"][2].value)
}
function formCancel(){
    alert("Cancel")
}

const Contact = () => (
    <div className="contactPage">
        <div className="contactText">
            <h1>Get in Touch!</h1>
            <p>
                We'd love to hear from you! If you have a question, issue or comment regarding the site, fill out and submit the form below!
            </p>
        </div>
        <br />
        <div className="contactForm">
            <form name="contactDetails">
                <div className="formInput">
                    <li className="formLabel">Email:</li>
                    <li className="formEntry"><input type="text" name="eaddressInput"></input></li>
                    <li className="formLabel">Type of feedback:</li>
                    <li className="formEntry"><select name="feedtypeInput">
                        <option>Question</option>
                        <option>Comment</option>
                        <option>Issue</option>
                    </select></li>
                    <li className="formLabel">Your Feedback:</li>
                    <li className="formEntry"><textarea name="feedbackInput" rows="6" cols="60"></textarea></li>
                </div>
                <button className="formButton" onClick={formSubmit}>Submit</button><button className="formButton" onClick={formCancel}>Cancel</button>
            </form>
        </div>
    </div>
);
export default Contact;