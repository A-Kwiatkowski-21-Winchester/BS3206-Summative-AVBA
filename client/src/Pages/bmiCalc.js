import React, { useState, useEffect } from "react";
import "../css/bmi.css";
import axios from 'axios';

function BMI()  {

    const [showInfo, setShowInfo] = useState(false);

    // Function to toggle the visibility of the additional information
    const toggleInfo = (e) => {
        e.preventDefault();
        setShowInfo(!showInfo);
    }

    const [age, setAge] = useState();
    const [weight, setWeight] = useState();
    const [height, setHeight] = useState();
    const [feet, setFeet] = useState();
    const [inches, setInches] = useState();
    const [bmi, setBmi] = useState();
    const [msg, setMsg] = useState('');
    const [weightSystem, setWeightSystem] = useState('metric'); // Default to metric

    // const reload = () => {
    //     window.location.reload();
    // };
    
    async function saveData(){
        // e.preventDefault();
        const bmiDetails = {
            // age,
            weight,
            // height,
            // feet,
            // inches,
            // bmi
        }
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
        // if (weight === 0 || (height === 0 && (feet === 0 || inches === 0))) {
        //     setMsg('');
        //     return;
        // }

        if (!weight || (!height && (!feet || !inches))) {
            setBmi(null);
            setMsg('');
            return;
        }

        let bmiFormula;
        if (weightSystem === 'metric') {
            const heightInMeters = height / 100;
            bmiFormula = weight / (heightInMeters * heightInMeters);
        } else {
            const heightInInches = feet * 12 + inches;
            bmiFormula = (weight / (heightInInches * heightInInches)) * 703;
        }

        const calculatedBmi = bmiFormula.toFixed(2);
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
    }, [weight, height, feet, inches, weightSystem]);

    return (
        <div className="bmiPage">
            <p>
               {" "}
                <a href="/bmitest" class="button">Go back</a>
            </p>
                <h1>Calculate your body mass index (BMI)</h1>
                <h2>Height & Weight</h2>

 {/*link for another screen which gives more info of bmi then on that page one for the calc itself*/} 
            <div className="infoContainer">
                <p>
                    <a href="/#" className="link" onClick={toggleInfo}>Why do we need this infomation?</a>
                </p>
                {showInfo && (
                    <div className="infoContent">
                        <div className="infoText">
                            <p>Your height and weight are required to calculate your BMI.</p>
                        </div>
                    </div>
                )}
            </div>              

                <form onSubmit={saveData}>
                    {/* <div>
                        <label className="labels">Age:</label><br />
                        <input className="bmi-input" type="number" placeholder="Age..." value={age} onChange={(e)=>setAge(e.target.value)} />
                    </div> */}

                    {weightSystem === 'metric' ? (
                        <>
                            <div>
                                <label className="labels">Height (cm):</label><br />
                                <input className="bmi-input" type="number" placeholder="Height (cm)..." value={height} onChange={(e)=>setHeight(e.target.value)} />
                            </div>
                            <div>
                                <label className="labels">Weight (kg):</label><br />
                                <input className="bmi-input" type="number" placeholder="Weight (kg)..." value={weight} onChange={(e)=>setWeight(e.target.value)}/>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="labels">Height (ft):</label><br />
                                <input className="bmi-input" type="number" placeholder="Height (ft)..." value={feet} onChange={(e)=>setFeet(e.target.value)} />
                            </div>
                            <div>
                                <label className="labels">Height (in):</label><br />
                                <input className="bmi-input" type="number" placeholder="Height (in)..." value={inches} onChange={(e)=>setInches(e.target.value)} />
                            </div>
                            <div>
                                <label className="labels">Weight (lbs):</label><br />
                                <input className="bmi-input" type="number" placeholder="Weight (lbs)..." value={weight} onChange={(e)=>setWeight(e.target.value)}/>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="labels">Weight System:</label><br />
                        <select value={weightSystem} onChange={(e) => setWeightSystem(e.target.value)}>
                            <option value="metric">Metric (kg, cm)</option>
                            <option value="imperial">Imperial (lbs, feet/in)</option>
                        </select>
                    </div>

                    {/* <div>
                        <button className="btn" type="submit">Calculate</button>
                        <button className="btn btn-reload" type="button" onClick={reload}>Reload</button>
                    </div> */}
                    <br/>
                    <div>
                        <button className="bttn" type="submit">Calculate</button>
                        {/* <button className="bttn" type="submit">Save</button> */}
                    </div>
                </form>

                <div className="result">
                    {/* <h3>Age: {age}</h3> */}
                    <h3>Your BMI is: {bmi}</h3>
                    <p className="p_msg">{msg}</p>
                </div>
            </div>
    );
};
export default BMI;

// const App = () => {
//   const [showBMI, setShowBMI] = useState(false);

//   const apiCall = () => {
//     axios.get('http://localhost:8080').then((data) => {
//       console.log(data)
//     })
//   }

//   const handleBMIClick = () => {
//     setShowBMI(true);
//   }

//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <button onClick={apiCall}>Test API Call</button> */}
//         <button onClick={handleBMIClick}>BMI</button>
//       </header>
//       {showBMI && <BMI />}
//     </div>
//   );
// }

// export default App;