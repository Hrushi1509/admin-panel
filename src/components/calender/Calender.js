import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calender.css";
import { useAuth } from "../../auth/AuthContext";
// import { ViewCalenderDetails } from "../ViewCalenderDetails";
// import { View } from "./View";

const localizer = momentLocalizer(moment);

const CustomCalendar = ({ showTable, setShowTable }) => {
  // console.log(setShowTable,showTable)
  const [masterEvents, setMasterEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [currentDate, setCurrentDate] = useState(new Date());
  const { authData } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterOption, setFilterOption] = useState("All");
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState()


  const id = authData?.loginResponse?.id || localStorage.getItem('loginUserId');
  const tokenFromStorage = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("loginUserId");

  const baseURL = process.env.REACT_APP_API_BASE_URL || "https://apptbackend.cercus.app";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        };

        // const response =
        //   (await axios.get(`${baseURL}/get-appointments/?id=${id}`, config)) ||
        //   (await axios.get(`${baseURL}/get-appointments/?id=${userId}`, config));
        // const fetchedAppointments = response.data;



        const response =
          (await axios.get(`${baseURL}/get-registred-users/`))



        const fetchedAppointments = response?.data;


        const mappedAppointments = fetchedAppointments?.map(user => ({
          id: user?.user?.id,
          artist: user?.user?.username,
          email: user?.user?.email,
          // appointments: user?.user?.session_count,
          appointments: user?.session_count,
          completed_count: user?.completed_count,
          upcoming_count: user?.upcoming_count,
          completed_appointments: user?.completed_appointments,
          upcoming_appointments: user?.upcoming_appointments
        }));



        setMasterEvents(mappedAppointments);
        setEvents(mappedAppointments);
        setFilteredEvents(mappedAppointments); // Initialize filtered events
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [filterOption, id, userId, tokenFromStorage, baseURL]);



  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const EventRenderer = ({event, selectedNames, handleEventClick  }) => {
    console.log("Rendering event:", event);
    console.log("Selected Names:", selectedNames);
    return(
    <div
    className="custom-event rbc-row-content"
    onClick={(e) => {
      e.stopPropagation();
      handleEventClick(event);
    }}
    key={event.id}
    // style={{ cursor: "pointer", position: "relative", zIndex: 999 }}
    style={{
      cursor: "pointer",
      position: "relative",
      zIndex: 999,
      display: "flex",
        flexDirection: "column", // Ensure time is above the title
        justifyContent: 'center',
        alignItems: "flex-start",
      }}
      >
    

      {/* Display selected artists' names at the top */}
      {selectedNames && selectedNames.length > 0 && (
        <div className="selected-artists rbc-row">
          <strong>Selected Artists: {selectedNames.join(", ")}</strong>
        </div>
      )}

      <div className="event-title">
        <strong>{event.title}</strong>
      </div>
      <div className="event-time">
        {moment(event.start).format("hh:mm A")} - {moment(event.end).format("hh:mm A")}
        {moment(event.start).format("hh:mm A")}
      </div>
    </div>
    )
  };



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




  const daysInMonth = moment(currentDate).daysInMonth();
  const monthYearLabel = moment(currentDate).format("MMMM YYYY");

  // const handleNameClick = (name) => {
  //   // Add the name to the selected list
  //   setSelectedNames((prevNames) => [...prevNames, name]);
  // };

  // const handleRemoveName = (name) => {
  //   // Remove the name from the selected list
  //   setSelectedNames((prevNames) => prevNames.filter((n) => n !== name));
  // };


  // Handle adding a name to selectedNames and filter events
  // Handle adding a name to selectedNames and filter events


  // Handle removing a name from selectedNames and filter events again
  const handleRemoveName = (name) => {
    setSelectedNames((prevNames) => {
      const newNames = prevNames.filter((n) => n !== name);

      // If there are no selected names, show all events
      const filtered = newNames.length > 0
        ? events.filter((event) =>
          newNames.some((selectedName) => event.client === selectedName)
        )
        : events; // Show all events if no names are selected

      setFilteredEvents(filtered); // Update filtered events
      return newNames;
    });
  };

  const handleNavigate = (action) => {
    let newDate = moment(currentDate);

    if (action === "TODAY") {
      newDate = moment(); // Set to today's date
    } else if (action === "PREV") {
      newDate = newDate.subtract(1, "days");
    } else if (action === "NEXT") {
      newDate = newDate.add(1, "days");
    }

    setCurrentDate(newDate.toDate());
  };

  useEffect(() => {
    if (selectedNames.length > 0) {
      // Fetch upcoming appointments for the selected names
      const fetchUpcomingAppointments = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${tokenFromStorage}`,
            },
          };

          const response = await axios.get(
            // `${baseURL}/get-upcoming-appointments-by-artist/?id=${id}&status=upcoming`,
            `${baseURL}/get-upcomming-appointments-by-artist/?id=${selectedArtistId}&status=upcoming`
          );
          const upcomingAppointments = response.data;

          // Map the response to the desired structure
          const mappedUpcomingAppointments = upcomingAppointments?.map(appointment => {
            // Flatten sessions to events
            return appointment?.sessions?.map(session => ({
              id: appointment?.id,
              title: appointment?.appointment_title, // Appointment title
              start: moment(`${session?.session_date} ${session?.start_time}`).toDate(),
              end: moment(`${session?.session_date} ${session?.end_time}`).toDate(),
              artist: appointment?.assigned_user?.username, // Assigned artist
              email: appointment?.assigned_user?.email, // Artist email
              user: appointment?.user?.username, // User name
              userEmail: appointment?.user?.email, // User email
              location: appointment?.appointment_location?.name, // Appointment location
              tattooIdea: appointment?.tatto_idea, // Tattoo idea
              appointmentCount: appointment?.appointment_count, // Appointment count
              ghlEmail: appointment?.ghl_user_email, // GHL user email
              hasPreviousTattoos: appointment?.has_previous_tattoos, // Has previous tattoos
              tattooedAtCertifiedStudios: appointment?.tattooed_at_certified_studios, // Tattooed at certified studios
              tattooStyle: appointment?.tattoo_style, // Tattoo style
              tattooBodyPart: appointment?.tattoo_body_part, // Tattoo body part
              tattooSize: appointment?.tattoo_size, // Tattoo size
              colorOrBlackGrey: appointment?.color_or_black_grey, // Tattoo color or black/grey
              coverUpOrRework: appointment?.cover_up_or_rework, // Cover-up or rework
              preferredTattooer: appointment?.preferred_tattooer, // Preferred tattooer
              preferredLocation: appointment?.preferred_location, // Preferred location
              specificDates: appointment?.specific_dates, // Specific dates
              isTraveling: appointment?.is_traveling, // Is traveling
              depositAmount: appointment?.deposite_amount, // Deposit amount
              totalProjectCost: appointment?.total_project_cost, // Total project cost
              sessionNo: session?.session_no, // Session number
            }));
          }).flat(); // Flatten the array of sessions

          setEvents(mappedUpcomingAppointments);
          setFilteredEvents(mappedUpcomingAppointments); // Update the filtered events with the mapped appointments

        } catch (error) {
          console.error("Error fetching upcoming appointments:", error);
        }
      };

      fetchUpcomingAppointments();
    }
  }, [selectedArtistId, tokenFromStorage, baseURL]);

  const handleNameClick = (name, artistId) => {
    setSelectedArtistId(artistId); // Store the artistId
    console.log('clicked called')
    console.log('id', artistId)
    setSelectedNames((prevNames) => {
      const newNames = [...prevNames, name];

      // Filter events for the selected names
      const filtered = events.filter((event) =>
        newNames.some((selectedName) => event.artist === selectedName)
      );
      setFilteredEvents(filtered); // Update filtered events

      // Fetch upcoming appointments for the selected artist

      return newNames;
    });
  };

  const artistIds = events.reduce((acc, event) => {
    if (event?.artist && event?.id) {
      acc[event.artist] = event.id;
    }
    return acc;
  }, {});

  //   const artistIdss = {};

  // events.forEach(event => {
  //   if (event?.artist && event?.id) {
  //     artistIdss[event.artist] = event.id;
  //   }
  // });

  // console.log('Artist IDs:', artistIdss);

  // console.log("CustomCalendar rendered");
  return (
    <div className="custom-calendar-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="menu-button">☰</button>
          <h3>Calendar</h3>
        </div>

        <div class="names-list">
          <h4>Artists</h4>

          <ul>
            {Array.from(new Set(masterEvents.map(event => event?.artist))) // Ensure unique names from master data
              .map((name, index) => {
                const artistId = artistIds[name]; // Get the correct artistId for each name
                return (
                  <li
                    className="artistName"
                    key={index}
                    onClick={() => handleNameClick(name, artistId)} // Pass both name and artistId
                  >
                    {formatAssignedUser(name)} {/* Format the artist name */}
                  </li>
                );
              })}
          </ul>
        </div>


      </div>




      <div className="calendar">

        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          date={currentDate}
          endAccessor="end"
          views={["day"]}
          defaultView="day"
          currentTimeIndicator={true}
          // components={{
          //   event: eventRenderer,
          // }}

          //  <EventRenderer {...props} selectedNames={selectedNames} handleEventClick={handleEventClick}/>,
          components={{
            // event: eventRenderer,
            event: (props) => {
              console.log("Event props:", props);  // This will log the props passed to the event
              return (
                <EventRenderer
                  {...props}
                  selectedNames={selectedNames}
                  handleEventClick={handleEventClick}
                />
              );
            },
            
            toolbar: (props) => (
              <CustomToolbar
                {...props}

                showTable={showTable}
                setShowTable={setShowTable}
                selectedNames={selectedNames}
                onRemoveName={handleRemoveName}
                onNavigate={handleNavigate}
              />
            ),
          }}

          onSelectEvent={(event) => setSelectedEvent(event)}
        />
      </div>


    </div>
  );
};

export default CustomCalendar;


const CustomToolbar = React.memo(({ label, onView, onNavigate, showTable, setShowTable, selectedNames, onRemoveName }) => {



  const handleToday = () => {
    onNavigate("TODAY");
  };



  return (
    <div>
      <div className="calendar-toolbar">
        <button onClick={handleToday} className="today-button">
          Today
        </button>
        <div className="toolbar-left">
          <button onClick={() => onNavigate("PREV")}>←</button>
          <span className="toolbar-label">{label}</span>
          <button onClick={() => onNavigate("NEXT")}>→</button>
        </div>



        <div className="toolbar-right">
          <button className="list-view-button"
            onClick={() => { setShowTable(!showTable) }}>
            {showTable ? "List" : "Calender"}
            {/* {showTable ? "Calender" : "List"} */}

          </button>

          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("loginUserId");
              window.location.href = "/login";
            }}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>

      
    </div>
  );
});




{/* <div className="toolbar-middle">
        <div className="names-container">
          {selectedNames.map((name, index) => (
            <div key={index} className="selected-name">
              <span>{name}</span>
              <button onClick={() => onRemoveName(name)} className="cancel-button">
                ✖
              </button>
            </div>
          ))}
        </div>
      </div> */}