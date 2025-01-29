import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TableList.css';
import { useAuth } from '../auth/AuthContext';
import { AiOutlineReload } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AppointmentModal from './modal//AppointmentModal';
import AllAppointmentModal from './modal/AllAppointmentModal';
import { ViewDetails } from './ViewDetails'
import axios from 'axios';
import { AppointmentsListModal } from './modal/AppointmentsListModal';

const AllRegisteredUsers = ({ showTable, setShowTable }) => {
    const [rows, setRows] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Add search term state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAllAppointmentVisible, setModalAllAppointmentVisible] = useState(false);
    const [selectedUserAppointments, setSelectedUserAppointments] = useState(null);
    const [allAppointments, setAllAppointments] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [viewDetailsAppointment, setViewDetailsAppointment] = useState(null);
    const [showOptionsModal, setShowOptionsModal] = useState(null);
    const [appointmentData, setAppointmentData] = useState([]);

    const [showAppointmentsList, setShowAppointmentsList] = useState(false);
    const [selected, setSelected] = ('all')







    const navigate = useNavigate();
    const { authData, setAuthData } = useAuth();
    const accessToken = authData?.loginResponse?.access || localStorage.getItem('accessToken');

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    const tokenFromStorage = localStorage.getItem('accessToken');


    // Filter rows based on search term
    const filteredRows = rows.filter((row) =>
        // row.name.toLowerCase().includes(searchTerm.toLowerCase())
        row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // {console.log(filteredRows,'filteredRows')}

    const currentUsers = filteredRows.slice(indexOfFirstUser, indexOfLastUser);

    function formatAssignedUser(assignedUser) {
        if (!assignedUser) {
            return "Not Assigned";
        }
        const prefixesToRemove = ['WEST -', 'YALE -', 'WEBER -', 'EAST -', 'WEST-', 'EAST-', 'WEBER-', 'YALE-'];
        prefixesToRemove.forEach(prefix => {
            if (assignedUser.startsWith(prefix)) {
                assignedUser = assignedUser.slice(prefix.length);
            }
        });
        return assignedUser.trim();
    }

    const baseURL = process.env.REACT_APP_API_BASE_URL || "https://apptbackend.cercus.app";


    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                let endpoint = '/get-registred-users/';
                if (filterType === 'months') {
                    endpoint = '/get-appointmentcount-filter?month=last';
                } else if (filterType === 'weeks') {
                    endpoint = '/get-appointmentcount-filter?week=last';
                } else if (filterType === 'dates' && startDate && endDate) {
                    const start = startDate.toISOString().split('T')[0];
                    const end = endDate.toISOString().split('T')[0];
                    endpoint = `/get-appointmentcount-filter?start_date=${start}&end_date=${end}`;
                }

                const headers = {};
                if (endpoint !== '/get-registred-users/') {
                    headers['Authorization'] = `Bearer ${accessToken}`;
                }

                const response = await fetch(`${baseURL}${endpoint}`, { headers });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                const transformedData = data.map(user => ({
                    id: user?.user?.id,
                    name: user?.user?.username,
                    email: user?.user?.email,
                    // appointments: user?.user?.session_count,
                    appointments: user?.session_count,
                    completed_count: user?.completed_count,
                    upcoming_count: user?.upcoming_count,
                    completed_appointments: user?.completed_appointments,
                    upcoming_appointments: user?.upcoming_appointments
                }));

                setOriginalData(transformedData);
                setRows(transformedData);
                // console.log(transformedData,'transformed data')
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [filterType, accessToken, startDate, endDate]);



    const handleGetTodaysAppointments = async () => {
        if (!selectedLocation) {
            alert("Please select a location first.");
            return;
        }

        setLoading(true); // Optional: Show loading state
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            // const endpoint = `${baseURL}/todays-sessions/?studio_name=${selectedLocation}`;
            const endpoint = `${baseURL}/get-upcomming-appointments-by-location/?location=${selectedLocation}`;
            const response = await fetch(endpoint, { headers });

            if (!response.ok) {
                throw new Error("Failed to fetch today's appointments");
            }

            const data = await response.json();

            const transformedData = data?.map(user => ({
                id: user?.user?.id,
                name: user?.user?.username,
                email: user?.user?.email,
                // appointments: user?.user?.session_count,
                appointments: user?.session_count,
                completed_count: user?.completed_count,
                upcoming_count: user?.upcoming_count,
                completed_appointments: user?.completed_appointments,
                upcoming_appointments: user?.upcoming_appointments
            }));

            setOriginalData(transformedData);
            setRows(transformedData);
            // Optionally, update the state to show these appointments in the UI
        } catch (error) {
            console.error("Error fetching today's appointments:", error);
            alert("Location not found");
        } finally {
            setLoading(false); // End loading state
        }
    };



    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseURL}/remove-registred-users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            const updatedRows = rows.filter((row) => row.id !== id);
            setRows(updatedRows);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddNewUser = () => {
        navigate('/signup/');
    };

    const handleAddNewAdmin = () => {
        // console.log('Access Token:', accessToken);
        // if (accessToken) {
        //     navigate('/admin-signup/');
        // } else {
        //     alert('You must be logged in to add a New Admin. Please log in first.');
        //     navigate('/admin-login');
        // }
        if (authData?.loginResponse?.access || localStorage.getItem('accessToken')) {
            navigate('/admin-signup/');
        } else {
            alert('You must be logged in to add a New Admin. Please log in first.');
            navigate('/admin-login');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setAuthData(null);
        navigate('/admin-login')
    };

    const handleFilter = (type) => {
        setFilterType(type);
    };

    const handleFilterByDate = () => {
        if (startDate && endDate) {
            setFilterType('dates');
        } else {
            alert('Please select both start and end dates.');
        }
    };

    const handleReset = () => {
        setFilterType(null);
        setStartDate(null);
        setEndDate(null);
        setSearchTerm(''); // Reset search term
        setRows(originalData);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div className="table-container">Loading...</div>;
    }

    if (error) {
        return <div className="table-container">Error: {error}</div>;
    }

    const totalPages = Math.ceil(filteredRows.length / usersPerPage);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setRows(originalData);
        } else {
            const filteredRows = originalData.filter((user) =>
                user.name.toLowerCase().includes(term.toLowerCase())
            );
            setRows(filteredRows);
        }
    };

    const openAllAppointmentModal = (completedAppointments, upcomingAppointments) => {
        setAllAppointments({
            completed: completedAppointments,
            upcoming: upcomingAppointments,
        });
        setModalAllAppointmentVisible(true);
    };


    const openModal = (appointments) => {
        setSelectedUserAppointments(appointments);
        setModalVisible(true);
    };
    // const openModal = (appointments) => {

    const closeModal = () => {
        setModalVisible(false);
        setSelectedUserAppointments(null);
        setModalAllAppointmentVisible(false);
        setAllAppointments(null);
    };


    // const handleGetTodaysAppointments = async () => {

    //   };


    const OptionsModal = ({ onViewDetails, onClose }) => (
        <div className="options-modal">
            <div onClick={onViewDetails}>View Details</div>
            {/* <div onClick={onEdit}>Edit</div> */}
            {/* <div onClick={onDelete}>Delete</div> */}
            <div onClick={onClose}>Close</div>
        </div>
    );


    {
        viewDetailsAppointment && (
            <ViewDetails
                appointment={viewDetailsAppointment}
                onClose={() => setViewDetailsAppointment(null)}
            />
        )
    }

    const getUserData = async (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${tokenFromStorage}`,
            },
        };
        try {
            const response = await axios.get(`${baseURL}/get-appointments/?id=${id}`, config);

            const mappedAppointments = response?.data?.map((appt) => ({
                id: appt?.id,
                assigned_user: {
                    id: appt?.assigned_user?.id,
                    username: appt?.assigned_user?.username,
                    email: appt?.assigned_user?.email,
                },
                user: {
                    id: appt?.user?.id,
                    username: appt?.user?.username,
                    email: appt?.user?.email,
                },
                sessions: appt?.sessions?.map((session) => ({
                    id: session?.id,
                    start_time: session?.start_time,
                    end_time: session?.end_time,
                    session_date: session?.session_date,
                    session_no: session?.session_no,
                    appointment: session?.appointment,
                })),
                appointment_title: appt?.appointment_title,
                appointment_location: appt?.appointment_location?.name,
                reference_images: appt?.reference_images,
                created_at: appt?.created_at,
                tatto_idea: appt?.tatto_idea,
                appointment_count: appt?.appointment_count,
                has_previous_tattoos: appt?.has_previous_tattoos,
                tattooed_at_certified_studios: appt?.tattooed_at_certified_studios,
                tattoo_style: appt?.tattoo_style,
                tattoo_body_part: appt?.tattoo_body_part,
                tattoo_size: appt?.tattoo_size,
                color_or_black_grey: appt?.color_or_black_grey,
                cover_up_or_rework: appt?.cover_up_or_rework,
                preferred_tattooer: appt?.preferred_tattooer,
                preferred_location: appt?.preferred_location,
                specific_dates: appt?.specific_dates,
                is_traveling: appt?.is_traveling,
                deposite_amount: appt?.deposite_amount,
                total_project_cost: appt?.total_project_cost,
            }));
            setSelectedUserAppointments(mappedAppointments); // Save the response data
            console.log(mappedAppointments, "mappedAppointments");
        } catch (error) {
            console.error("Error fetching appointment data:", error);
        }
    };

    const handleChange = (e)=>{
        setSelected(e.target.value)
    }



    return (
        <div className="table-container">
            <div className="heading">
                <h2 className="title">All Registered Users</h2>
                <div className="btn">
                <button className="btn-toggle" onClick={() => { setShowTable(!showTable) }}>{showTable ? "List" : "Calendar"}</button>
                {/* <button className="btn-toggle" onClick={() => { setShowTable(!showTable) }}>{showTable ? "Calendar" : "List"}</button> */}


                    <button className="add-user-button" onClick={handleAddNewAdmin}>
                        Add New Admin
                    </button>
                    <button className="add-user-button" onClick={handleAddNewUser}>
                        Add New User
                    </button>
                    <button className="add-user-button" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </div>

            <div className="filter-buttons">
                 <button className="filter-button" onClick={() => handleFilter('months')}>
                    Filter with Months
                </button>
                <button className="filter-button" onClick={() => handleFilter('weeks')}>
                    Filter with Weeks
                </button> 

                {/* <select
                    className="filter-dropdown"
                    value={selectedFilter}
                    onChange={()=>handleChange(e)}
                >
                    <option value="all">Show All</option>
                    <option value="months">Filter with Months</option>
                    <option value="weeks">Filter with Weeks</option>
                    <option value="weeks">Touchup Data</option>
                </select> */}

                <div className="date-picker-container">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Start Date"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="End Date"
                    />
                    <button className="filter-button" onClick={handleFilterByDate}>
                        Filter by Dates
                    </button>
                </div>

                <button className="reset-button" onClick={handleReset}>
                    <AiOutlineReload /> Reset
                </button>

                <div className="search-bar-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search by name"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {/* <button className="search-button" onClick={() => handleSearch(searchTerm)}>
                        Search
                    </button> */}
                </div>
            </div>


            <div className="filter-buttons">
                <div className="btn-groups location-filter">
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        style={{
                            padding: "0.5rem",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    >
                        <option value="">Select a location</option>
                        <option value="Lakewood, Co. (West Colfax)">Lakewood, Co. (West Colfax)</option>
                        <option value="Southeast Denver, Co. (Yale)">Southeast Denver, Co. (Yale)</option>
                        <option value="Colorado Springs, Co. (Weber St.)">Colorado Springs, Co. (Weber St.)</option>
                        <option value="East Downtown Denver, Co. (East)">East Downtown Denver, Co. (East)</option>
                    </select>
                    <button
                        onClick={handleGetTodaysAppointments}
                        className="filter-button location-filter"
                    >
                        Get Appointments with Location
                    </button>
                </div>
            </div>



            {/* <div className="filter-buttons">
                <button className="filter-button" onClick={() => handleFilter('months')}>
                    Filter with Months
                </button>
                <button className="filter-button" onClick={() => handleFilter('weeks')}>
                    Filter with Weeks
                </button>
                <div className="date-picker-container">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Start Date"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="End Date"
                    />
                    <button className="filter-button" onClick={handleFilterByDate}>
                        Filter by Dates
                    </button>
                </div>

                <button className="reset-button" onClick={handleReset}>
                    <AiOutlineReload /> Reset
                </button>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div> */}
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Artist Name</th>
                        <th>Email</th>
                        <th>No. of Appointments</th>
                        <th>Past Appointments</th>
                        <th>Upcoming Appointments</th>
                        <th>Actions</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((row) => (
                        <tr key={row.id}>
                            <td>{formatAssignedUser(row.name)}</td>
                            <td>{row.email}</td>
                            {/* <td>{row.appointments}</td> */}
                            <td
                                onClick={() => openAllAppointmentModal(row.completed_appointments, row.upcoming_appointments)}
                                className="clickable-cell"
                            >
                                {row.appointments}
                            </td>

                            <td
                                onClick={() => openModal(row.completed_appointments)}
                                // onClick={() => openModal(mockAppointments)}
                                className="clickable-cell"
                            >{row.completed_count}</td>
                            <td
                                // onClick={() => openModal()}
                                onClick={() => openModal(row.upcoming_appointments)}
                                className="clickable-cell"
                            >{row.upcoming_count}</td>


                            {/* <td style={{ position: "relative" }}>
                                <img
                                    src={require("./icons/dots.png")}
                                    alt="dots"
                                    onClick={() => setShowOptionsModal(appointment.id)}
                                    style={{ cursor: "pointer" }}
                                />
                                {showOptionsModal === appointment.id && (
                                    <OptionsModal
                                        onViewDetails={() => {
                                            setViewDetailsAppointment(appointment);
                                            setShowOptionsModal(null);
                                        }}
                                        onClose={() => setShowOptionsModal(null)}
                                    />
                                )}
                            </td>
                            {viewDetailsAppointment && (
                                <ViewDetails
                                    appointment={viewDetailsAppointment}
                                    onClose={() => setViewDetailsAppointment(null)}
                                />
                            )} */}

                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(row.id)}
                                >
                                    Delete
                                </button>
                            </td>

                            <td style={{ position: "relative" }}>
                                <img
                                    src={require("./icons/dots.png")}
                                    alt="dots"
                                    onClick={() => {
                                        setShowOptionsModal(row.id); // Set the row ID
                                        // getUserData(row.id); 
                                    }}
                                    style={{ cursor: "pointer" }}
                                />
                                {showOptionsModal === row.id && (
                                    <OptionsModal
                                        // onViewDetails={() => {
                                        //     setViewDetailsAppointment(row);
                                        //     setShowOptionsModal(null);
                                        // }}
                                        onViewDetails={async () => {
                                            // await getUserData(row.id); 
                                            // setViewDetailsAppointment(row); 
                                            // setShowOptionsModal(null); 
                                            await getUserData(row.id); // Fetch data
                                            setShowAppointmentsList(true); // Show the appointments list modal
                                            setShowOptionsModal(null); // Close the options modal
                                        }}
                                        onClose={() => setShowOptionsModal(null)}
                                    />
                                )}
                            </td>
                            {showAppointmentsList && (
                                <AppointmentsListModal
                                    appointments={selectedUserAppointments}
                                    onSelect={(appointment) => {
                                        setViewDetailsAppointment(appointment); // Pass the selected appointment
                                        setShowAppointmentsList(false); // Close the list modal
                                    }}
                                    onClose={() => setShowAppointmentsList(false)}
                                />
                            )}
                            {viewDetailsAppointment && (
                                <ViewDetails
                                    // appointment={viewDetailsAppointment}
                                    // userAppointments={selectedUserAppointments}
                                    appointment={viewDetailsAppointment}
                                    onClose={() => setViewDetailsAppointment(null)}
                                />
                            )}

                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <div className="rows-per-page">
                    <select
                        id="rows-per-page"
                        value={usersPerPage}
                        onChange={(e) => setUsersPerPage(Number(e.target.value))}
                    >
                        {[10, 30, 50, 100].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {modalVisible && (
                <AppointmentModal
                    appointments={selectedUserAppointments}
                    onClose={closeModal}
                />
            )}
            
            {modalAllAppointmentVisible && (
                <AllAppointmentModal
                    appointments={allAppointments}
                    completedAppointments={allAppointments?.completed}
                    upcomingAppointments={allAppointments?.upcoming}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default AllRegisteredUsers;
