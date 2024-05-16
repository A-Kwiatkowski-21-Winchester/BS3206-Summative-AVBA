// BmiChildren.js
import React from "react";
import "../css/bmi.css"
import { Link } from "react-router-dom";

function BmiChildren() {
    return (
        <div className="bmiPage">
             <p>
               {" "}
                <a href="/bmitest" class="button">Go back</a>
            </p>
            
            <h1>Calculate your BMI for children and teenagers</h1>
            {/* Add BMI calculator form specific for children and teenagers */}

            <p>
                Use this service to:
            </p>
            <br/>
            <ul>
                <li>Check the BMI of an adult aged 18 and over</li>
                <li>Get information about what to do next</li>
            </ul>

            <br/>
            <p>
            This tool should not be used to make any symptom diagnoses. Get in touch with your GP or neighbourhood chemist if you're concerned about your weight.
            </p>

            <h2>
                Who can not use the tool
            </h2>
            <p>
                You are not permitted to use this tool if you, or the person you are using it for fall into these catergories:
            </p>

            <br/>
            <ul>
                <li>are under the age of 18</li>
                <li>are pregnant</li>
                <li>have been diagnosed with an eating disorder, or think you may have one</li>
                <li>have a condition that affects your height</li>
            </ul>

            <br/>
            <p>
                If you or your child are aged between 2-17,{" "}
                <Link to="/bmiChildren" className="link">Calculate your BMI for children and teenagers</Link>
            </p>

            <br/>
            <h2>What you need</h2>
            <p>
                To use the calculator, you will need to know you:
            </p>

            <br/>
            <ul>
                <li>height</li>
                <li>weight</li>
            </ul>

            <br/>
            <h2>Ethnic background</h2>
            <p>
                The calculator will also ask for information on your ethnic background.
            </p>
            <p>
                This is because people from an Asian, Black African, African-Caribbean or Middle Eastern ethnic background have a higher chance of developing health problems at a lower BMI.
            </p>
            <p>
                When you enter information on your ethnic background, the calculator will give you more accurate advice about your BMI result.
            </p>

            <br/>
            <h2>Your results</h2>
            <p>
            Your BMI result will be displayed as a number with one of these weight categories:
            </p>
            
            <br/>
            <ul>
                <li>underweight</li>
                <li>a healthy weight</li>
                <li>overweight</li>
                <li>obese</li>
            </ul>
            <p>
                After getting your result, you may be asked to measure your waist. This can help you understand if you are carrying too much weight around your tummy.
            </p>


        </div>
    );
}



export default BmiChildren;
