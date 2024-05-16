import React, { useState } from "react";
import "../css/bmi.css";
import { Link } from "react-router-dom";

function BmiAdults() {
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

            <h1>Calculate your BMI for adults</h1>
            {/* Add BMI calculator form specific for adults */}

            <p>
                Use this service to:
            </p>
            <br />
            <ul>
                <li>Check the BMI of an adult aged 18 and over</li>
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

            <br />
            <ul>
                <li>are under the age of 18</li>
                <li>are pregnant</li>
                <li>have been diagnosed with an eating disorder, or think you may have one</li>
                <li>have a condition that affects your height</li>
            </ul>

            <br />
            <div className="infoContent">
                        <div className="infoText">
                        <p>
                            If you or your child are aged between 2-17,{" "}
                            <Link to="/bmiChildren" className="link">Calculate your BMI for children and teenagers</Link>
                </p>
                        </div>
                    </div>

            <br />
            <h2>What you need</h2>
            <p>
                To use the calculator, you will need to know you:
            </p>

            <ul>
                <li>height</li>
                <li>weight</li>
            </ul>

            <br />
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

            <br />
            <h2>Your results</h2>
            <p>
            Your BMI result will be displayed as a number with one of these weight categories:
            </p>
            <ul>
                <li>underweight</li>
                <li>a healthy weight</li>
                <li>overweight</li>
                <li>obese</li>
            </ul>
            <p>
                After getting your result, you may be asked to measure your waist. This can help you understand if you are carrying too much weight around your tummy.
            </p>

            <br/>
            {/* Additional information dropdown */}
            <div className="infoContainer">
                <p>
                    <a href="/#" className="link" onClick={toggleInfo}>How your BMI is calculated</a>
                </p>
                {showInfo && (
                    <div className="infoContent">
                        <div className="infoText">
                            <p>The BMI is calculated by dividing an adult's weight in kilograms by their height in metres squared.</p>
                            <p>For example, if you weigh 70kg (around 11 stone) and are 1.73m (around 5 foot 8 inches) tall, you work out your BMI by:</p>
                            <p>squaring your height in metres: 1.73 x 1.73 = 2.99</p>
                            <p>dividing your weight in kilograms: 70 ÷ 2.99 = 23.41</p>
                            <p>Your result will be displayed to one decimal place, for example, 23.4.</p>
                        </div>
                    </div>
                )}
            </div>

            <br/>
            <h2>What your results mean</h2>
            <p>
                A higher BMI increases the chance of developing long-term conditions, such as type 2 diabetes and heart disease.
            </p>
            <p>
                The BMI calculation is just one measure of health. It cannot tell the difference between muscle and fat.
            </p>
            <p>
                For example, if you have a lot of muscle, you may be classed as overweight or obese despite having low body fat.
            </p>
            <p>
                This is why you may get a better idea of your overall health from measuring your waist.
            </p>

            <br/>
            <p>
                <button onClick={() => { window.location.href = '/bmiCalc'; }} className="bttn">Calculate BMI</button>
            </p>

        </div>
    );
}

export default BmiAdults;

