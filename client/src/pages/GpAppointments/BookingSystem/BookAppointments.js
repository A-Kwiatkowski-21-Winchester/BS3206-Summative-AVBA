import './BookAppointments.css';

export default function BookAppointments(){
    return(
        <div className='book'>
            <form className="bookingform">
                <h1 className="title">Book a GP Appointment</h1>
                <label>Patient Name</label>
                <input type="text" required/>

                <label>Health Number</label>
                <input type="Integer" required/>

                <label>Doctor Name</label>
                <input type="text" required/>

                <label>Date</label>
                <input type="Date" required/>

                <label>Time</label>
                <input type="time" required/>

                <button classname="btn"type="submit">Submit</button>
                    
            </form>
        </div>
    );
}