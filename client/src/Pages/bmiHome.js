import React from "react";
import { Link } from 'react-router-dom';
import { BmiAdults, BmiChildren } from './pageindex';
import "../css/contact.css"



const Bmi = () => (
    
    <div className="bmiPage">
        <h1>Calculate your body mass index (BMI)</h1>
        <p>
            Check your BMI to find out if you're a healthy weight for your height.
        </p>

        <p>
               {" "}
                <Link to="/bmiAdults" className="link">Calculate your BMI for adults</Link>
        </p>

        <p>
                {" "}
                <Link to="/bmiChildren" className="link">Calculate your BMI for children and teenagers</Link>
        </p>


        <br />
    </div>
);
export default Bmi;