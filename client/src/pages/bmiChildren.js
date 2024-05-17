// BmiChildren.js
import React, { useState, useEffect } from "react";
import "../css/bmi.css";
import { Link } from "react-router-dom";
import { getUserID } from "../libs/cookies";



function BmiChildren() {

    const [loggedIn, setLoggedIn] = useState(false); // State to track user login status

    // Function to check if user is logged in (you can replace this with your actual authentication logic)
    useEffect(() => {
        // Simulate checking if user is logged in
        setLoggedIn(!!getUserID()); // Convert truth/false value to boolean
    }, []);


    const [showInfo, setShowInfo] = useState(false);

    // Function to toggle the visibility of the additional information
    const toggleInfo = (e) => {
        e.preventDefault();
        setShowInfo(!showInfo);
    }

    const [weight, setWeight] = useState();
    const [height, setHeight] = useState();
    const [day, setDay] = useState();
    const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const [feet, setFeet] = useState();
    const [inches, setInches] = useState();
    const [pound, setPound] = useState();
    const [ounces, setOunces] = useState();
    const [bmi, setBmi] = useState();
    const [msg, setMsg] = useState('');
    const [weightSystem, setWeightSystem] = useState('metric'); // Default to metric
    const [gender, setGender] = useState('');
    const [bmiCategory, setBmiCategory] = useState('');

     // Function to clear all input fields
     const resetFields = () => {
        setWeight('');
        setHeight('');
        setDay('');
        setMonth('');
        setYear('');
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
        if (!loggedIn) {
            alert("You need to be logged in to save data.");
            return;
        }
        const bmiDetails = {
            weight,
            height,
            feet,
            inches,
            pound,
            ounces,
            gender,
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
        /* if (!weight || (!height && (!feet || !inches))) {
            setBmi(null);
            setMsg('');
            return;
        } */

        let bmiFormula;
        let category = '';
        if (weightSystem === 'metric') {
            const heightInCentimeters = height / 100;
            console.log("Height:", heightInCentimeters)
            bmiFormula = weight / (heightInCentimeters * heightInCentimeters);
            console.log("BMI:", bmiFormula)
        } else {
            const heightInInches = (parseFloat(feet) * 12) + parseFloat(inches);
            console.log("Height:", heightInInches)
            console.log("Weight:", pound)
            bmiFormula = (pound / (heightInInches * heightInInches)) * 703;
            console.log("BMI:", bmiFormula)
        }

        //weight (lb) ÷ height*2 (inches) * 703

        const calculatedBmi = bmiFormula.toFixed(1);
        setBmi(calculatedBmi);

        if (calculatedBmi < 18.5) {
            category = "Underweight";
        } else if (calculatedBmi >= 18.5 && calculatedBmi < 23) {
            category = "Healthy";
        } else if (calculatedBmi >= 23 && calculatedBmi < 27.5) {
            category = "Overweight";
        } else if (calculatedBmi >= 27.5) {
            category = "Obese";
        }

        setBmiCategory(category);
    }, [weight, height, feet, inches, pound, ounces, weightSystem]);


    return (
        <div className="bmiPage">
             <p>
               {" "}
                <a href="/bmitest" className="button">Go back</a>
            </p>

            <h1>Calculate your body mass index (BMI) for children and teenagers</h1>
            <br/>

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
            <br/>

            <h2>
                Who can not use the tool
            </h2>

            <br/>
            <p>
                You are not permitted to use this tool if you, or the person you are using it for fall into these catergories:
            </p>
            <br/>

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
            <h2>How your BMI is calculated</h2>
            <br/>
            <p>
                A child or teenager's BMI is shown as a "centile". 
                The centile result is shown as a percentage of how their BMI compares with other children or teenagers of the same age and sex.
            </p>
            <p>
                For example, a girl on the 75th centile is heavier than 75 out of 100 other girls her age.
            </p>

            <br/>
            <p>
                The BMI calculator works out if a child or teenager may be:
            </p>

            <br/>
            <ul>
                <li>underweight – on the 2nd centile or below</li>
                <li>a healthy weight – between the 2nd and 91st centiles</li>
                <li>overweight – 91st centile or above</li>
                <li>very overweight – 98th centile or above</li>
            </ul>

            <br/>
            <p>
                The BMI calculation does not include muscle mass, which weighs more than fat.
            </p>

            <br />
            <h2>Next steps</h2>

            <br/>
            <p>
                Overweight children are more likely to become overweight as adults. 
                This could lead to long-term health conditions.
            </p>
            <p>
                See a GP if you're concerned about your or your child's weight. 
                They may be able to refer you to your local healthy lifestyle programme for children, young people and families.
            </p>
            <br/> 

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
                        </>
                    )}

                    
                    <h3>
                        Date of birth
                    </h3>
                    <p>
                        For example: 12 05 2015
                    </p>

                    {/* Additional information dropdown */}
                    <div className="infoContainer">
                        <p>
                            <a href="/#" className="link" onClick={toggleInfo}>Why do we need to know?</a>
                        </p>
                        {showInfo && (
                            <div className="infoContent">
                                <div className="infoText">
                                    <p>Date of birth is needed to accurately work out the BMI of anyone under 18 years old.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="buttonContainer">
                        <div className="buttonWrapper">
                            <p>Day</p>
                            <input className="bmi-input" type="number" placeholder="" onChange={(e) => setDay(e.target.value)} value={day} />
                        </div>

                        <div className="buttonWrapper">
                            <p>Month</p>
                            <input className="bmi-input" type="number" placeholder="" onChange={(e) => setMonth(e.target.value)} value={month} />
                        </div>

                        <div className="buttonWrapper">
                            <p>Year</p>
                            <input className="bmi-input" type="number" placeholder="" onChange={(e) => setYear(e.target.value)} value={year} />
                        </div>
                    </div>

                    <hr className="divider" /> {/* Grey line divider after weight input */}

                    <h3>
                        Sex
                    </h3>
                    {/* Additional information dropdown */}
                    <div className="infoContainer">
                        <p>
                            <a href="/#" className="link" onClick={toggleInfo}>Why do we need to know?</a>
                        </p>
                        {showInfo && (
                            <div className="infoContent">
                                <div className="infoText">
                                    <p>For children and teenagers, BMI centile is sex specific. We give more personalised information based on whether you are male or female.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <br/>
                    <div className="genderWrapper">
                         <label>
                            <input type="radio" name="gender" value="male" onChange={(e) => setGender(e.target.value)} />
                            Male
                        </label>
                        <label>
                            <input type="radio" name="gender" value="female" onChange={(e) => setGender(e.target.value)} />
                            Female
                        </label>
                    </div>

                    <hr className="divider" /> {/* Grey line divider after weight input */}

                    <div className="result">
                        {/* Display BMI and message */}
                        <h3>Your BMI is: {isNaN(bmi) ? " " : bmi}</h3>
                        <p className="p_msg">{msg}</p>
                    </div>

                    {/* Display different cards based on BMI category */}
                    {bmiCategory && (
                        <div className="bmi-cards">
                            {bmiCategory === "Underweight" && (
                                <div className="bmi-card">
                                    <p>Your BMI indicates that you are underweight. 
                                        Please consult with a healthcare provider for guidance.</p>
                                </div>
                            )}
                            {bmiCategory === "Healthy" && (
                                <div className="bmi-card">
                                    <p>Your BMI falls within the healthy range.
                                    Keep up the good work with your lifestyle habits!
                                    </p>
                                </div>
                            )}
                            {bmiCategory === "Overweight" && (
                                <div className="bmi-card">
                                    <p>Your BMI indicates that you are overweight.
                                    Consider consulting with a healthcare provider for advice on weight management.
                                    </p>
                                </div>
                            )}
                            {bmiCategory === "Obese" && (
                                <div className="bmi-card">
                                    <p>Your BMI indicates that you are obese.
                                    It's important to consult with a healthcare provider for support and guidance.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}


                    <div className="bmi-scale">
                        <div className={`underweight ${bmi >= 0 && bmi < 18.5 ? 'bold' : ''}`}>
                            <div className="line"></div>
                            <h4 className={bmi >= 0 && bmi < 18.5 ? 'bold' : ''}>Underweight</h4>
                            <p>&lt; 18.5</p>
                        </div>

                        <div className={`healthy ${bmi >= 18.5 && bmi < 25 ? 'bold' : ''}`}>
                            <div className="line"></div>
                            <h4 className={bmi >= 18.5 && bmi < 25 ? 'bold' : ''}>Healthy</h4>
                            <p>18.5 – 25</p>
                        </div>

                        <div className={`overweight ${bmi >= 25 && bmi < 30 ? 'bold' : ''}`}>
                            <div className="line"></div>
                            <h4 className={bmi >= 25 && bmi < 30 ? 'bold' : ''}>Overweight</h4>
                            <p>25 – 30</p>
                        </div>

                        <div className={`obese ${bmi >= 30 ? 'bold' : ''}`}>
                            <div className="line"></div>
                            <h4 className={bmi >= 30 ? 'bold' : ''}>Obese</h4>
                            <p>≥ 30</p>
                        </div>
                    </div>

                    <div>
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



        </div>
    );
}   

export default BmiChildren;