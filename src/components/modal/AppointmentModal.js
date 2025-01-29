import './AppointmentModal.css';

const AppointmentModal = ({ appointments, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Appointments</h3>
                {/* {console.log(appointments, 'appointments')} */}
                {appointments?.length > 0 ? (
                    <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Session Date</th>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Idea</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.session_date}</td>
                                    <td>{appointment.appointment_title}</td>
                                    {/* <td>{appointment.appointment_location}</td> */}

                                    <td>
                                        {appointment.appointment_location
                                            ? appointment.appointment_location.name
                                            : 'Not provided'}
                                    </td>
                                    <td>{appointment.tatto_idea}</td>
                                    <td>
                                        {appointment.start_time} - {appointment.end_time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No appointments found.</p>
                )}

                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default AppointmentModal;
