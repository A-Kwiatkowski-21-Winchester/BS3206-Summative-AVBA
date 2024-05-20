import React from "react";
import { Link } from 'react-router-dom';
import "../css/bmi.css"



const Bmi = () => (
    
    <div className="bmiPage">
        {/* Page container with the class name to help with the styling import from bmi.css */}
        <h1>Calculate your body mass index (BMI)</h1>
        {/* Header displaying the main title of the page */}

        <br/>
        <p>
            Check your BMI to find out if you're a healthy weight for your height.
        </p>
        {/* Description explaining the purpose of checking BMI */}

        <br/>
        <p>
               {" "}
                <Link to="/bmiAdults" className="link">Calculate your BMI for adults</Link>
        </p>
        {/* Link to the BMI calculator for adults */}


        <br/>
        <p>
                {" "}
                <Link to="/bmiChildren" className="link">Calculate your BMI for children and teenagers</Link>
        </p>
        {/* Link to the BMI calculator for children and teenagers */}

    </div>
);
export default Bmi;