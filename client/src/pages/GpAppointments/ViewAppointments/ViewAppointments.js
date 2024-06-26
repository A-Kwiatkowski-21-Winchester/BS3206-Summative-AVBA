/* eslint-disable react/jsx-key */

import "./ViewAppointments.css"
import {useEffect, useState} from 'react'

export default function ViewAppointments(){

    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        const getAppointments = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/appointments/')
                const responseData = await response.json()

                if (response.ok){
                    setAppointments(responseData)
                }
            } catch (error) {
                alert("Error loading appointments. Unable to communicate with server.")
                console.error("Could not connect to server.", error)
            }
            
        }  
        getAppointments()
    }, [])


    const deleteAppointment = async (id) => {
        const response = await fetch('http://localhost:8080/api/appointments/delete/' + id,{
            method: 'DELETE'
        })

        const json = await response.json()

        if(!response.ok){
            console.log(json.error)
        }
        if (response.ok){
            console.log(json)
            alert("Success! Appointment Deleted.")
        }

        window.location.reload();
    }

    return(
        <div>
            <h1 className="title">My Appointments</h1>
            <div className="card">
                {appointments.map((appointment) => (
                    <div className="cards">
                        <p key={appointment._id}>Patient: {appointment.patientName}</p>
                        <p key={appointment.healthNumber}>Health No.{appointment.healthNumber}</p>
                        <p key={appointment.doctorName}>Doctor: {appointment.doctorName}</p>
                        <p key={appointment.date}>Date: {appointment.date}</p>
                        <p key={appointment.time}>Time: {appointment.time}</p>
                        <button className="aptbtn" onClick={() => deleteAppointment(appointment._id)}>Cancel</button>
                    </div>
                ))}
            </div>
        </div>
    );
    
}