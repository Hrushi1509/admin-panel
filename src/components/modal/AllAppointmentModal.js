import React, { useState } from 'react';
import './AppointmentModal.css';

const AllAppointmentModal = ({ completedAppointments, upcomingAppointments, onClose }) => {
    const [view, setView] = useState('completed'); // State to toggle between views

    const appointments = view === 'completed' ? completedAppointments : upcomingAppointments;

    console.log(appointments, 'upcoming appt')

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Appointments</h3>
                <div className="switch-container">
                    <button
                        className={`switch-button ${view === 'completed' ? 'active' : ''}`}
                        onClick={() => setView('completed')}
                    >
                        Completed
                    </button>
                    <button
                        className={`switch-button ${view === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setView('upcoming')}
                    >
                        Upcoming
                    </button>
                </div>

                {appointments?.length > 0 ? (
                    <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Session Date</th>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Idea</th>
                                <th>Time</th>
                                <th>GHL</th>
                                <th></th>
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
                                    <td>
                                        <a
                                            href={`https://app.cercus.app/v2/location/0rrNZinFkHbXD50u5nyq/contacts/detail/${appointment?.ghl_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="redirect-link"
                                        >
                                            🔗
                                        </a>
                                    </td>

                                    <td>checkbox</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No {view} appointments found.</p>
                )}

                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default AllAppointmentModal;
