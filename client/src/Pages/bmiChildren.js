// BmiChildren.js
import React, { useState } from "react";
import "../css/bmi.css";
import { Link } from "react-router-dom";


function BmiChildren() {
    const [showInfo, setShowInfo] = useState(false);

    // Function to toggle the visibility of the additional information
    const toggleInfo = (e) => {
        e.preventDefault();
        setShowInfo(!showInfo);
    }

    return (
        <div className="bmiPage">
             <p>
               {" "}
                <a href="/bmitest" class="button">Go back</a>
            </p>

            <h1>Calculate your body mass index (BMI) for children and teenagers</h1>
            {/* Add BMI calculator form specific for adults */}

            <p>
                Use this service to:
            </p>
            <br />
            <ul>
                <li>check the BMI of children and teenagers aged between 2 and 17</li>
                <li>Get information about what to do next</li>
            </ul>

            <br />
            <p>
                This tool should not be used to make any symptom diagnoses. Get in touch with your GP or neighbourhood chemist if you're concerned about your weight.
            </p>

            <h2>
                Who can not use the tool
            </h2>
            <p>
                You are not permitted to use this tool if you, or the person you are using it for fall into these catergories:
            </p>

            <ul>
                <li>are over the age of 18</li>
                <li>are pregnant</li>
                <li>have been diagnosed with an eating disorder, or think you may have one</li>
                <li>have a condition that affects your height</li>
            </ul>

            <br />
            <div className="infoContent">
                        <div className="infoText">
                        <p>
                            If you're aged 18 or over,{" "}
                            <Link to="/bmiAdults" className="link">Calculate your BMI for adults</Link>
                </p>
                        </div>
                    </div>

            <br />
            <h2>How your BMIis calculated</h2>
            <p>
                A child or teenager's BMI is shown as a "centile". 
                The centile result is shown as a percentage of how their BMI compares with other children or teenagers of the same age and sex.
            </p>
            <p>
                For example, a girl on the 75th centile is heavier than 75 out of 100 other girls her age.
            </p>
            <p>
                The BMI calculator works out if a child or teenager may be:
            </p>

            <ul>
                <li>underweight – on the 2nd centile or below</li>
                <li>a healthy weight – between the 2nd and 91st centiles</li>
                <li>overweight – 91st centile or above</li>
                <li>very overweight – 98th centile or above</li>
            </ul>

            <p>
                The BMI calculation does not include muscle mass, which weighs more than fat.
            </p>

            <br />
            <h2>Next steps</h2>
            <p>
                Overweight children are more likely to become overweight as adults. 
                This could lead to long-term health conditions.
            </p>
            <p>
                See a GP if you're concerned about your or your child's weight. 
                They may be able to refer you to your local healthy lifestyle programme for children, young people and families.
            </p>
            <div className="childBmi">
                <h2>
                    BMI calculator for children and teenagers
                </h2>
                <p>
                    Height
                </p>
            </div>


        </div>
    );
}

export default BmiChildren;