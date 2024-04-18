
//import axios from 'axios'
import {useState} from 'react'
import './BookAppointments.css';


export default function BookAppointments(){

    const [patientName, setPatientName] = useState('');
    const [healthNumber, setHealthNumber] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    async function onSubmit(e){
        e.preventDefault();

        const appointmentDetails = {patientName, healthNumber, doctorName, date, time}
        
        const response = await fetch('http://localhost:8080/api/appointments/create',{
            method: 'POST',
            body: JSON.stringify(appointmentDetails),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if(!response.ok){
            console.log(json.error)
        }
        if (response.ok){
            console.log(json)
        }
        
    }
        
   

    return(
        <div className='book'>
            <form className="bookingform" onSubmit={onSubmit}>
                <h1 className="title">Book a GP Appointment</h1>
                <label>Patient Name</label>
                <input type="text" 
                onChange={(e) => setPatientName(e.target.value)}
                value = {patientName}
                required/>

                <label>Health Number</label>
                <input type="Integer" 
                onChange={(e) => setHealthNumber(e.target.value)}
                value = {healthNumber}
                required/>

                <label>Doctor Name</label>
                <input type="text"
                onChange={(e) => setDoctorName(e.target.value)}
                value = {doctorName}
                required/>

                <label>Date</label>
                <input type="Date"
                onChange={(e) => setDate(e.target.value)}
                value = {date}
                required/>

                <label>Time</label>
                <input type="time" 
                onChange={(e) => setTime(e.target.value)}
                value = {time}
                required/>

                <button className="btn"type="submit">Submit</button>
                    
            </form>
        </div>
    );
}