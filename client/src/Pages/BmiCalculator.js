import React, { useState, useEffect } from "react";
import axios from 'axios';

const BMI = () => {
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
        if (weight === 0 || (height === 0 && (feet === 0 || inches === 0))) {
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
        <div className="app">
            <div className="container">
                <h1>Calculate your body mass index (BMI)</h1>
                <h2>Check your BMI to find out if you're a healthy weight for your height.</h2>

{/*link for another screen which gives more info of bmi then on that page one for the calc itself*/}               

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

                    <div>
                        <button className="btn" type="submit">Save</button>
                        {/* <button className="btn btn-reload" type="button" onClick={reload}>Reload</button> */}
                    </div>
                </form>

                <div className="result">
                    {/* <h3>Age: {age}</h3> */}
                    <h3>Your BMI is: {bmi}</h3>
                    <p className="p_msg">{msg}</p>
                </div>
            </div>
        </div>
    );
};

const App = () => {
  const [showBMI, setShowBMI] = useState(false);

  const apiCall = () => {
    axios.get('http://localhost:8080').then((data) => {
      console.log(data)
    })
  }

  const handleBMIClick = () => {
    setShowBMI(true);
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={apiCall}>Test API Call</button>
        <button onClick={handleBMIClick}>BMI</button>
      </header>
      {showBMI && <BMI />}
    </div>
  );
}

export default App;