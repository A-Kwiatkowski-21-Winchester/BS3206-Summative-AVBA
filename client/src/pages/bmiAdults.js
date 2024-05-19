import React, { useState, useEffect } from "react";
import "../css/bmi.css";
import { Link } from "react-router-dom";
import { getUserID } from "../libs/cookies";

function BmiAdults() {

    const [loggedIn, setLoggedIn] = useState(false); // State to track user login status
    const [showInfo, setShowInfo] = useState(false);
    const [ isDataComplete, setDataComplete] = useState(false);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [pound, setPound] = useState('');
    const [bmi, setBmi] = useState(NaN);
    const [weightSystem, setWeightSystem] = useState('metric'); // Default to metric
    const [bmiCategory, setBmiCategory] = useState('');
    const [message, setMessage] = useState('');


    // // Function to check if user is logged in (you can replace this with your actual authentication logic)
    useEffect(() => {
        setLoggedIn(!!getUserID());
    }, []);

    // Function to toggle the visibility of the additional information
    const toggleInfo = (e) => {
        e.preventDefault();
        setShowInfo(!showInfo);
    }

    // Function to clear all input fields
    const resetFields = () => {
        setWeight('');
        setHeight('');
        setDay('');
        setMonth('');
        setYear('');
        setFeet('');
        setInches('');
        setPound('');
        setBmi('');
    };

    {/*Check if the user is logged in before saving data and
     if so it saves those stated in the bmi details*/}
    async function saveData(e){
        e.preventDefault();
        // Check if the user is logged in before saving data
        if (!loggedIn) {
            alert("You need to be logged in to save data.");
            return;
        }
        const bmiDetails = {
            height,
            weight,
            feet,
            inches,
            pound,
            day,
            month,
            year,
            bmi
        }
        
        // Function to save BMI data to the MongoDB database
        console.log(weight)
        const apiCall = await fetch('http://localhost:8080/api/bmi/create', {
            method:'POST', 
            body:JSON.stringify(bmiDetails),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const apiResponse = await apiCall.json()
        if(apiResponse.acknowledged) alert("Saved successfully!")
        console.log(apiResponse)
    }

     {/*Check if all required data is complete (weight, height, day, month and year)
    and if so then it goes on to calculate the bmi and put them into their category*/}
    useEffect(() => {
        const isDataComplete = day && month && year && weight && height;
    
        if (isDataComplete) {
            let bmiFormula;
            let category = '';
            if (weightSystem === 'metric') {
                const heightInCentimeters = height / 100;
                bmiFormula = weight / (heightInCentimeters * heightInCentimeters);
            } else {
                const heightInInches = (parseFloat(feet) * 12) + parseFloat(inches);
                bmiFormula = (pound / (heightInInches * heightInInches)) * 703;
            }
    
            const calculatedBmi = bmiFormula.toFixed(1);
            setBmi(calculatedBmi);
    
            if (calculatedBmi < 18.5) {
                category = "Underweight";
            } else if (calculatedBmi < 25) {
                category = "Healthy";
            } else if (calculatedBmi < 30) {
                category = "Overweight";
            } else {
                category = "Obese";
            }
    
            setBmiCategory(category);
        }
    
        // Update the state to reflect whether all required fields are complete
        setDataComplete(isDataComplete);
    }, [day, month, year, weight, height, feet, inches, pound, weightSystem]);
    
    
        {/* this calculates the age that has been inputed into their relevant 
        sections and ensures the user is not 17 or under as they would be using the wrong
        bmi calculator*/}
        const checkAge = () => {
            if (day && month && year) {
                const enteredDate = new Date(year, month - 1, day);
                const currentDate = new Date();
                const age = currentDate.getFullYear() - enteredDate.getFullYear();
                const monthDifference = currentDate.getMonth() - enteredDate.getMonth();
        
                if (age < 18 || (age === 18 && monthDifference <= 0 && currentDate.getDate() < enteredDate.getDate())) {
                    setMessage(
                        <span>
                            You should use the child and teen BMI calculator. Click the link: <br/>
                            <Link to="/bmiChildren" className="link">Calculate your BMI for children and teenagers</Link>
                        </span>
                    );
                } else {
                    setMessage(null);
                }
            }
        };
        
    
    return (
        <div className="bmiPage">
            {/* Navigation link to go back to the previous page it was on */}
            <p>
                <a href="/bmitest" className="button">Go back</a>
            </p>
            <br/>

             {/* Main header for the adults page*/}
            <h1>Calculate your BMI for adults</h1>

            {/* Description of what this page is meant to do */}
            <br/>
            <p>
                Use this service to:
            </p>
            <br />
            <ul>
                <li>Check the BMI of an adult aged 18 and over</li>
                <li>Get information about what to do next</li>
            </ul>

            {/* Disclaimer */}
            <br />
            <p>
                This tool should not be used to make any symptom diagnoses. Get in touch with your GP or neighborhood chemist if you're concerned about your weight.
            </p>
            <br/>

            {/* description of the requirments where you can not use the tool */}
            <h2>
                Who cannot use the tool
            </h2>

            <br/>
            <p>
                If you or the person you are using it for fits into any of the following categories, you are not allowed to use this tool:
            </p>

            <br />
            <ul>
                <li>belong to the age group under 18</li>
                <li>are pregnant</li>
                <li>Having received a diagnosis for an eating disorder or suspect you may have one</li>
                <li>possess a health issue that impacts your height</li>
            </ul>

            {/* Information for children and teens in the wrong section for the Bmi Calculator */}
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

            <br/>
            <p>
                To use the calculator, you will need to know your:
            </p>
            <br/>

            <ul>
                <li>height</li>
                <li>weight</li>
            </ul>

            <br />
            <h2>Your results</h2>

            <br/>
            <p>
                One of these weight groups will be represented by a number reflecting your BMI result:
            </p>
            <ul>
                <li>underweight</li>
                <li>a healthy weight</li>
                <li>overweight</li>
                <li>obese</li>
            </ul>

            <br/>
            <p>
                You might be requested to take a waist measurement after receiving your results. This might assist you in determining if you are overweight in the area around your abdomen.
            </p>

            <br/>
            {/* extra information dropdown detailing how your bmi is calculated*/}
            <div className="infoContainer">
                <p>
                    <a href="/#" className="link" onClick={toggleInfo}>How your BMI is calculated</a>
                </p>

                <br/>
                {showInfo && (
                    <div className="infoContent">
                        <div className="infoText">
                            <p>To calculate an adult's BMI, divide their weight in kilogrammes by the square of their height in metres.</p>
                            <p>For instance, calculating your BMI if your height is 1.73 metres (5 feet 8 inches) and your weight is 70 kg (around 11 stone) you do this:</p>
                            <p>squaring the height in metres: 1.73 times 1.73 is 2.99.</p>
                            <p>dividing your weight in kilograms: 70 ÷ 2.99 = 23.41</p>
                            <p>Your result, that is 23.4, will be shown to one decimal place.</p>
                        </div>
                    </div>
                )}
            </div>

            <br/>
            <h2>What your results mean</h2>

            <br/>
            <p>
                An elevated body mass index (BMI) elevates the risk of chronic illnesses like type 2 diabetes and heart disease.
            </p>
            <p>
                BMI calculation is only one indicator of health. It is unable to distinguish between fat and muscle.
            </p>
            <p>
                For example, you could be considered overweight or obese even when your body fat percentage is modest if you have a lot of muscle.
            </p>
            <p>
                 For this reason, measuring your waist may give you a better indication of your general health.
            </p>
            <br/>

             {/* BMI calculator input options including age and weight, height
            both in metric and imperial measurment */}
            <div className="parentContainer">
                <div className="childBmi">
                    <h2>
                        BMI calculator for adults
                    </h2>
                   
                   {/* The buttons allowing the user to switch between imperial and metric*/}
                    <div>
                        <button className={`bttn ${weightSystem === "metric" ? "" : "inactive"}`} onClick={() => setWeightSystem("metric")}>Metric (kg, cm)</button>
                        <button className={`bttn ${weightSystem === "imperial" ? "" : "inactive"}`} onClick={() => setWeightSystem("imperial")}>Imperial (lbs, ft)</button>
                    </div>

                    {weightSystem === 'metric' ? (
                        <>
                        {/* these are the input fields for the weight, height*/}
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

                      {/* Date of birth input fields to make sure the user is within the correct age
                    range and if not then they are directed to the child and teens section */}
                    <div className="buttonContainer">
                        <div className="buttonWrapper">
                            <p>Day</p>
                            <input className="bmi-input" type="number" placeholder="" onChange={(e) => setDay(e.target.value)} onBlur={checkAge} />
                        </div>

                        <div className="buttonWrapper">
                            <p>Month</p>
                            <input className="bmi-input" type="number" placeholder="" onChange={(e) => setMonth(e.target.value)} onBlur={checkAge} />
                        </div>

                        <div className="buttonWrapper">
                            <p>Year</p>
                            <input className="bmi-input" type="number" placeholder="" onChange={(e) => setYear(e.target.value)} onBlur={checkAge} />
                        </div>
                    </div>

                    <p>{message}</p> {/* Display the age check message */}

                    <hr className="divider" /> {/* Grey line divider  */}

                    <div className="result">
                        {/* Display BMI and message */}
                        <h3>Your BMI is: {isNaN(bmi) ? " " : bmi}</h3>
                    </div>

                    {/* Display different sets of information based on BMI category */}
                    {bmiCategory && (
                        <div className="bmi-info">
                            {bmiCategory === "Underweight" && (
                                <div className="bmi-card">
                                    <p>You are underweight based on your BMI. 
                                    For guidance, please speak with a healthcare expert.</p>
                                </div>
                            )}
                            {bmiCategory === "Healthy" && (
                                <div className="bmi-info">
                                    <p>You are within the healthy range for BMI.
                                    Maintain your good health choices!
                                    </p>
                                </div>
                            )}
                            {bmiCategory === "Overweight" && (
                                <div className="bmi-info">
                                    <p>According to your BMI, you are overweight.
                                    Consider seeking weight-management guidance from a healthcare specialist.                                    </p>
                                </div>
                            )}
                            {bmiCategory === "Obese" && (
                                <div className="bmi-info">
                                    <p>YIn accordance with your BMI, you are deemed as obese.
                                    It is critical to seek assistance and instruction from a healthcare professional.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}


                    <div className="bmi-gauge">
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

                    {/* Form to save data */}
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
