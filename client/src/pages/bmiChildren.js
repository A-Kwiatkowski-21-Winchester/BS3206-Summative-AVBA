import React, { useState, useEffect } from "react";
import "../css/bmi.css";
import { Link } from "react-router-dom";
import { getUserID } from "../libs/cookies";

function BmiChildren() {
    const [loggedIn, setLoggedIn] = useState(false);
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
    const [weightSystem, setWeightSystem] = useState('metric');
    const [gender, setGender] = useState('');
    const [bmiCategory, setBmiCategory] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setLoggedIn(!!getUserID());
    }, []);

    // Function to toggle the visibility of the additional information
    const toggleInfo = (e) => {
        e.preventDefault();
        setShowInfo(!showInfo);
    }

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
        setBmi('');
    };

    {/*Check if the user is logged in before saving data and
     if so it saves those stated in the bmi details*/}
    async function saveData(e) {
        e.preventDefault();
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
            gender,
            day,
            month,
            year,
            bmi
        };

        // Function to save BMI data to the MongoDB database
        const apiCall = await fetch('http://localhost:8080/api/bmi/create', {
            method:'POST', 
            body:JSON.stringify(bmiDetails),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const apiResponse = await apiCall.json();
        console.log(apiResponse);
    }

    {/*Check if all required data is complete (weight, height,day, month, year, gender)
    and if so then it goes on to calculate the bmi and put them into their category*/}

    useEffect(() => {
    const isDataComplete = day && month && year && gender && weight && height;

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
        } else if (calculatedBmi < 23) {
            category = "Healthy";
        } else if (calculatedBmi < 27.5) {
            category = "Overweight";
        } else {
            category = "Obese";
        }

        setBmiCategory(category);
    }

    // Update the state to reflect whether all required fields are complete
    setDataComplete(isDataComplete);
}, [day, month, year, gender, weight, height, feet, inches, pound, weightSystem]);


    {/* this calculates the age that has been inputed into their relevant 
    sections and ensures the user is not 18 or over as they would be using the wrong
    bmi calculator*/}
    const checkAge = () => {
        if (day && month && year) {
            const enteredDate = new Date(year, month - 1, day);
            const currentDate = new Date();
            const age = currentDate.getFullYear() - enteredDate.getFullYear();
            const monthDifference = currentDate.getMonth() - enteredDate.getMonth();

            if (age > 18 || (age === 18 && monthDifference > 0) || (age === 18 && monthDifference === 0 && currentDate.getDate() >= enteredDate.getDate())) {
                setMessage(
                    <span>
                        You should use the adult BMI calculator. Click the link: <br/>
                        <Link to="/bmiAdults" className="link">Calculate your BMI for adults</Link>
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
               {" "}
                <a href="/bmitest" className="button">Go back</a>
            </p>

            {/* Main header for the childrens page*/}
            <h1>Calculate your body mass index (BMI) for children and teenagers</h1>
            <br/>

            {/* Description of what this page is meant to do */}
            <p>
                Use this service to:
            </p>
            <br />
            <ul>
                <li>check the BMI of children and teenagers aged between 2 and 17</li>
                <li>Get information about what to do next</li>
            </ul>

            {/* Disclaimer */}
            <br />
            <p>
            It is not recommended to diagnose any symptoms with this tool. 
            If you're worried about your weight, speak with your doctor or the local pharmacy.
            </p>
            <br/>

            {/* Section: Who cannot use the tool */}
            <h2>
                Who can not use the tool
            </h2>

            <br/>
            <p>
                If you or the person you are using it for fits into any of 
                the following categories, you are not allowed to use this tool:
            </p>
            <br/>

            <ul>
                <li>are older than eighteen</li>
                <li>are carrying a child</li>
                <li>have an eating disorder that has been diagnosed, or believe you may have one</li> 
                <li>have a condition that affects your height</li>
            </ul>

            {/* Information for adults in the wrong section for the Bmi Calculator */}
            <br />
            <div className="infoContent">
                        <div className="infoText">
                        <p>
                            If you're aged 18 or over,{" "}
                            <Link to="/bmiAdults" className="link">Calculate your BMI for adults</Link>
                </p>
                        </div>
                    </div>

            {/* Information on how you BMI is calculated as a child or teenager */}
            <br />
            <h2>How your BMI is calculated</h2>
            <br/>
            <p>
                The BMI of a child or teenager is displayed as a "centile". 
                The centile result is expressed as a percentage of the child or teen's BMI in relation to other kids or teens of the same age and gender.
            </p>
            <p>
            A girl who weighs in at the 75th percentile, for instance, is heavier than 75 out of 100 females her age.
            </p>

            <br/>
            <p>
                The following can be determined by using the BMI calculator on a child or teenager:
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
                The BMI calculation does not take into account muscle mass, which weighs more than fat.
            </p>

            <br />
            <h2>Next steps</h2>

            <br/>
            <p>
                Children that are overweight have a higher likelihood of being overweight adults. 
                This might result in chronic health issues.
            </p>
            <p>
                If you're worried about your weight or the weight of your child, see a doctor. 
                They may be able to direct you to the children's, youth, and family healthy living initiative in your area.
            </p>
            <br/> 

            {/* BMI calculator input options including gender, age and weight, height
            both in metric and imperial measurment */}
            <div className="parentContainer">
                <div className="childBmi">
                    <h2>
                        BMI calculator for children and teenagers
                    </h2>
                   
                    <div>
                        {/* The buttons for selecting the weight system you would 
                        like to calculate your bmi in */}
                        <button className={`bttn ${weightSystem === "metric" ? "" : "inactive"}`} onClick={() => setWeightSystem("metric")}>Metric (kg, cm)</button>
                        <button className={`bttn ${weightSystem === "imperial" ? "" : "inactive"}`} onClick={() => setWeightSystem("imperial")}>Imperial (lbs, ft)</button>
                    </div>

                    {weightSystem === 'metric' ? (
                        <>
                        {/* This is the input fields for the metric system which is the default calculation 
                        system when using the bmi calculator */}
                            <div>
                                <label className="labels">Height (cm):</label><br />
                                <input className="bmi-input" type="number" placeholder=""  onChange={(e)=>setHeight(e.target.value)} value={height} />
                            </div>
                            <hr className="divider" /> {/* Grey line divider */}

                            <div>
                                <label className="labels">Weight (kg):</label><br />
                                <input className="bmi-input" type="number" placeholder=""  onChange={(e)=>setWeight(e.target.value)} value={weight}/>
                            </div>
                            <hr className="divider" /> {/* Grey line divider */}
                        </>
                    ) : (
                        <>
                        {/* This is the input fields for the imperial system which becomes visable
                        when the imperial button has been selected. */}
                            <div>
                                <label className="labels">Height (ft):</label><br />
                                <input className="bmi-input" type="number" placeholder="" value={feet} onChange={(e)=>setFeet(e.target.value)} />
                            </div>
                            <hr className="divider" /> {/* Grey line divider */}

                            <div>
                                <label className="labels">Height (in):</label><br />
                                <input className="bmi-input" type="number" placeholder="" value={inches} onChange={(e)=>setInches(e.target.value)} />
                            </div>
                            <hr className="divider" /> {/* Grey line divider */}
                            
                            <div>
                                <label className="labels">Weight (lbs):</label><br />
                                <input className="bmi-input" type="number" placeholder="" value={pound} onChange={(e)=>setPound(e.target.value)}/>
                            </div>
                            <hr className="divider" /> {/* Grey line divider */}
                        </>
                    )}

                    {/* Date of birth section */}
                    <h3>
                        Date of birth
                    </h3>
                    <p>
                        For example: 12-05-2015
                    </p>

                    {/* Additional information dropdown depicting why we need to know 
                    the users age */}
                    <div className="infoContainer">
                        <p>
                            <a href="/#" className="link" onClick={toggleInfo}>Why do we need to know?</a>
                        </p>
                        {showInfo && (
                            <div className="infoContent">
                                <div className="infoText">
                                    <p>For the purpose of precisely calculating a person's BMI who is younger than eighteen, their date of birth is required.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Date of birth input fields to make sure the user is within the correct age
                    range and if not then they are directed to the adult section */}
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

                    {/* Gender selection section */}
                    <h3>
                        Gender
                    </h3>
                    {/* Additional information dropdown depicting why the website
                    is asking for their gender */}
                    <div className="infoContainer">
                        <p>
                            <a href="/#" className="link" onClick={toggleInfo}>Why do we need to know?</a>
                        </p>
                        {showInfo && (
                            <div className="infoContent">
                                <div className="infoText">
                                    <p>The BMI centile for kids and teens is gender-specific. We provide more tailored information according to your gender.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Radio buttons for the user to select when chosing their gender or the option to 
                    chose neither if they want to keep that private */}
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
                        <label>
                            <input type="radio" name="gender" value="other" onChange={(e) => setGender(e.target.value)} />
                            Prefer not to say
                        </label>
                    </div>

                    <hr className="divider" /> {/* Grey line divider */}

                     {/* This section will display your bmi automatically when you have
                     inputted the weight and height */}
                    <div className="result">
                        <h3>Your BMI is: {isNaN(bmi) ? " " : bmi}</h3>
                    </div>

                    {/* This secion will display text dependant on the category your 
                    bmi falls under so if your bmi was obese you will text regarding your 
                    next steps to ensure better health. */}
                    {bmiCategory && (
                        <div className="bmi-info">
                            {bmiCategory === "Underweight" && (
                                <div className="bmi-info">
                                      <p>
                                        Your weight is between the 2nd centile or below
                                    </p>
                                    <br/>

                                    <p>Your child appears underweight based on their height and weight.
                                        For advice, please speak with a healthcare professional.</p>
                                </div>
                            )}

                            {bmiCategory === "Healthy" && (
                                <div className="bmi-info">
                                    <p>
                                        Your weight is between the 2nd and 91st centiles
                                    </p>
                                    <br/>

                                    <p>Your child appears to be a healthy weight based on their height and weight.
                                        Maintain your excellent dietary choices!
                                    </p>
                                </div>
                            )}

                            {bmiCategory === "Overweight" && (
                                <div className="bmi-info">
                                     <p>
                                        Your weight is within the 91st centile or above
                                    </p>
                                    <br/>

                                    <p>Your child appears to be overweight based on their height and weight.
                                        If you need guidance on managing your weight, think about speaking with a healthcare professional.
                                    </p>
                                </div>
                            )}

                            {bmiCategory === "Obese" && (
                                <div className="bmi-info">
                                     <p>
                                        Your weight is within the 98th centile or above
                                    </p>
                                    <br/>

                                    <p>Given their height and weight, your youngster appears to be quite overweight.
                                        Seeking advice and support from a healthcare professional is crucial.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    

                    {/* BMI gauge display which is a line that is different coloured 
                    based on the bmi category, it also has the category nameand range underneath the line.
                    if the bmi goes into one of the categories the number below the lines will be bold. */}
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

                    {/* Form/buttons to save data to the database as long as the user is logged in and 
                    a reload button which resets the inputs*/}
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