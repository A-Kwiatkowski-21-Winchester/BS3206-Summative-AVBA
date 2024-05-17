import React, { useState, useEffect } from "react";
import "../css/bmi.css";
import { Link } from "react-router-dom";
import { getUserID } from "../libs/cookies";

function BmiAdults() {
    // const [loggedIn, setLoggedIn] = useState(false); // State to track user login status

    // // Function to check if user is logged in (you can replace this with your actual authentication logic)
    // useEffect(() => {
    //     // Simulate checking if user is logged in
    //     setLoggedIn(!!getUserID()); // Convert truth/false value to boolean
    // }, []);


    // Function to toggle the visibility of the additional information
    const toggleInfo = (e) => {
        e.preventDefault();
        setShowInfo(!showInfo);
    }

    const [showInfo, setShowInfo] = useState(false);
    const [weight, setWeight] = useState();
    const [height, setHeight] = useState();
    const [feet, setFeet] = useState();
    const [inches, setInches] = useState();
    const [pound, setPound] = useState();
    const [ounces, setOunces] = useState();
    const [bmi, setBmi] = useState();
    const [msg, setMsg] = useState('');
    const [weightSystem, setWeightSystem] = useState('metric'); // Default to metric
    const [gender, setGender] = useState('');

    // Function to clear all input fields
    const resetFields = () => {
        setWeight('');
        setHeight('');
        setGender('');
        setFeet('');
        setInches('');
        setPound('');
        setOunces('');
        setBmi('');
        setMsg('');
    };

    async function saveData(e){
        e.preventDefault();
        // Check if the user is logged in before saving data
        // if (!loggedIn) {
        //     alert("You need to be logged in to save data.");
        //     return;
        // }
        const bmiDetails = {
            weight,
            height,
            feet,
            inches,
            pound,
            ounces,
            bmi
        }
        
        console.log(weight)
        const apiCall = await fetch('http://localhost:8080/api/bmi/create', {
            method:'POST', 
            body:JSON.stringify(bmiDetails),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const apiResponse = await apiCall.json()

        console.log(apiResponse)
    }

    useEffect(() => {
        // if (!weight || (!height && (!feet || !inches))) 
            if ((!weight || !height) && (!weight || (!feet || !inches))) {
            setBmi(null);
            setMsg('');
            console.log("value is incomplete")
            return;
        }




        let bmiFormula;
        if (weightSystem === 'metric') {
            const heightInCentimeters = height / 100;
            bmiFormula = weight / (heightInCentimeters * heightInCentimeters);
        } else {
            const heightInInches = feet * 12 + inches;
            bmiFormula = (weight / (heightInInches * heightInInches)) * 703;
        }

        //weight (lb) ÷ height*2 (inches) * 703

        const calculatedBmi = bmiFormula.toFixed(1);
        setBmi(calculatedBmi);

        if (calculatedBmi < 18.5) {
            setMsg("You're Underweight");
        } else if (calculatedBmi >= 18.5 && calculatedBmi < 23) {
            setMsg("You're Healthy");
        } else if (calculatedBmi >= 23 && calculatedBmi < 27.5) {
            setMsg("You're Overweight");
        } else {
            setMsg("You're Obese");
        }
    }, [weight, height, feet, inches, pound, ounces, weightSystem]);

    return (
        <div className="bmiPage">
             <p>
               {" "}
                <a href="/bmitest" className="button">Go back</a>
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
                This tool should not be used to make any symptom diagnoses. Get in touch with your GP or neighborhood chemist if you're concerned about your weight.
            </p>

            <h2>
                Who cannot use the tool
            </h2>
            <p>
                You are not permitted to use this tool if you, or the person you are using it for fall into these categories:
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
                To use the calculator, you will need to know your:
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
                This is because people from an Asian, Black African, African-Caribbean, or Middle Eastern ethnic background have a higher chance of developing health problems at a lower BMI.
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
                            <p>The BMI is calculated by dividing an adult's weight in kilograms by their height in meters squared.</p>
                            <p>For example, if you weigh 70kg (around 11 stone) and are 1.73m (around 5 foot 8 inches) tall, you work out your BMI by:</p>
                            <p>squaring your height in meters: 1.73 x 1.73 = 2.99</p>
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

            <div className="parentContainer">
                <div className="childBmi">
                    <h2>
                        BMI calculator for adults
                    </h2>
                   
                    <div>
                        <button className={`bttn ${weightSystem === "metric" ? "" : "inactive"}`} onClick={() => setWeightSystem("metric")}>Metric (kg, cm)</button>
                        <button className={`bttn ${weightSystem === "imperial" ? "" : "inactive"}`} onClick={() => setWeightSystem("imperial")}>Imperial (lbs, ft)</button>
                    </div>

                    {weightSystem === 'metric' ? (
                    <>
                        <div>
                            <label className="labels">Height (cm):</label><br />
                            <input className="bmi-input" type="number" placeholder=""  onChange={(e)=>setHeight(e.target.value)} value={height} />
                        </div>
                        <hr className="divider" /> {/* Grey line divider after height input */}

                        <div>
                            <label className="labels">Weight (kg):</label><br />
                            <input className="bmi-input" type="number" placeholder=""  onChange={(e)=>setWeight(e.target.value)} value={weight}/>
                        </div>
                        <hr className="divider" /> {/* Grey line divider after height input */}
                    </>
                ) : (
                    <>
                        <div>
                            <label className="labels">Height (ft):</label><br />
                            <input className="bmi-input" type="number" placeholder="" value={feet} onChange={(e)=>setFeet(e.target.value)} />
                        </div>
                        <hr className="divider" /> {/* Grey line divider after height input */}

                        <div>
                            <label className="labels">Height (in):</label><br />
                            <input className="bmi-input" type="number" placeholder="" value={inches} onChange={(e)=>setInches(e.target.value)} />
                        </div>
                        <hr className="divider" /> {/* Grey line divider after height input */}
                        
                        <div>
                            <label className="labels">Weight (lbs):</label><br />
                            <input className="bmi-input" type="number" placeholder="" value={pound} onChange={(e)=>setPound(e.target.value)}/>
                        </div>
                        <hr className="divider" /> {/* Grey line divider after height input */}
                        
                        {/* <div>
                            <label className="labels">Weight (oz):</label><br />
                            <input className="bmi-input" type="number" placeholder="" value={[ounces]} onChange={(e)=>setOunces(e.target.value)}/>
                        </div> */}
                    </>
                )}
                    <div className="result">
                        {/* <h3>Age: {age}</h3> */}
                        <h3>Your BMI is: {bmi}</h3>
                        <p className="p_msg">{msg}</p>
                     </div>

                     <form onSubmit={saveData}>
                        <br/>
                        <div>
                            <button className="bttn" type="submit">Save</button>
                            <button className="bttn" type="button" onClick={resetFields}>Reload</button>
                        </div>
                    </form>

                </div>
            </div>

        </div>
            
    );
}

export default BmiAdults;
