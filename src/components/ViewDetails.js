import { useState } from "react";
import './ViewDetails.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const ViewDetails = ({ appointment, onClose }) => {
  console.log(appointment,'')
  // const convertReferenceImageURL = (url) => {
  //   if (url.startsWith("/media/")) {
  //     const decodedURL = decodeURIComponent(url.replace("/media/", ""));
  //     return decodedURL;
  //   }
  //   return url;
  // };

  // const convertReferenceImageURL = (url) => {
  //   if (url.startsWith("/media/")) {
  //     const decodedURL = decodeURIComponent(url.replace("/media/", ""));
  //     // Ensure the URL starts with "https://"
  //     if (decodedURL.startsWith("https:/") && !decodedURL.startsWith("https://")) {
  //       return decodedURL.replace("https:/", "https://");
  //     }
  //     return decodedURL;
  //   }
  //   return url;
  // };

  function capitalizeWords(inputStr) {
      // Split the input string by spaces

      // if(!inputStr){
      //   return;
      // }
      
      const words = inputStr.split(" ");
  
      // Ensure the string has exactly two words
      // if (words.length !== 2) {
      //     throw new Error("Input must be two words separated by a space.");
      // }
  
      let [firstWord, secondWord] = words;
  
      // Capitalize the first word if it is 'test'
      if (firstWord.toLowerCase() === "test") {
          firstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
      }
  
      // Format the second word to show only the first letter followed by a dot
      secondWord = secondWord.charAt(0).toUpperCase() + '.';
  
      // Combine and return the formatted string
      return `${firstWord} ${secondWord}`;
}


  function formatAssignedUser(assignedUser) {
    if (!assignedUser) {
      return "Not Assigned";
    }

    // List of prefixes to remove
    const prefixesToRemove = ['WEST -', 'YALE -', 'WEBER -', 'EAST -', 'WEST-', 'EAST-', 'WEBER-', 'YALE-'];

    // Remove the prefix if it exists
    prefixesToRemove.forEach(prefix => {
      if (assignedUser.startsWith(prefix)) {
        assignedUser = assignedUser.slice(prefix.length);
      }
    });

    return assignedUser.trim();
  }

  const downloadImage = (url, fileName) => {
    fetch(url)
      .then((response) => response.blob()) // Fetch the image and convert it to a Blob
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); // Create a temporary URL for the Blob
        link.download = fileName; // Set the desired file name
        document.body.appendChild(link); // Append the link to the DOM
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up
      })
      .catch((error) => console.error('Download failed', error)); // Error handling
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // const referenceImageURL = appointment.reference_image ? convertReferenceImageURL(appointment.reference_image) : "";

  // const refImage= "https://links.tattooagency.com/conversations-assets/location/0rrNZinFkHbXD50u5nyq/conversations/R3B18mlq2q8zKMlT7SK3/d09112f8-b5bd-420b-b728-d0bcc9aa11ff.jpg"
  return (
    <div className="modal-overlay">
      <div className="modal-content-details scrollable">
        <h3>Appointment Details</h3>
        <div className="form-group">
          <label>Title:</label>
          <p>{appointment?.appointment_title || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Client:</label>
          {/* <p>{capitalizeWords(formatAssignedUser(appointment?.user?.username)) || "N/A"}</p> */}
          <p>{formatAssignedUser(appointment?.user?.username) || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Artist:</label>
          <p>{formatAssignedUser(appointment?.assigned_user?.username) || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Location:</label>
          <p>{appointment?.appointment_location || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Tattoo Idea:</label>
          <p>{appointment?.tatto_idea || "N/A"}</p>
        </div>

        {/* Session details */}
        <div className="form-group">
          <label>Sessions:</label>
          {appointment?.sessions && appointment?.sessions?.length > 0 ? (
            <div className="sessions">
              {appointment?.sessions?.map((session, index) => (
                <div key={session?.id} className="session-details">
                  <p><strong>Session {index + 1}:</strong></p>
                  <p>Session Date: {session?.session_date || "N/A"}</p>
                  <p>Start Time: {session?.start_time || "N/A"}</p>
                  <p>End Time: {session?.end_time || "N/A"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No sessions available.</p>
          )}
        </div>

        <div className="form-group">
          <label>Appointment Count:</label>
          <p>{appointment?.appointment_count || "N/A"}</p>
        </div>

        <div className="form-group">
          <label>Has Previous Tattoos? :</label>
          <p>{appointment?.has_previous_tattoos || "N/A"}</p>
        </div>

        <div className="form-group">
          <label>Tattooed At Certified Studios:</label>
          <p>{appointment?.tattooed_at_certified_studios || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Tattoo Style::</label>
          <p>{appointment?.tattoo_style || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Tattoo Body Part::</label>
          <p>{appointment?.tattoo_body_part || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Tattoo Size:</label>
          <p>{appointment?.tattoo_size || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Color or Black Grey:</label>
          <p>{appointment?.color_or_black_grey || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Cover up or Rework:</label>
          <p>{appointment?.cover_up_or_rework || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Preferred Tattooer:</label>
          <p>{appointment?.preferred_tattooer || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Preferred Location:</label>
          <p>{appointment?.preferred_location || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Specific Dates:</label>
          <p>{appointment?.specific_dates || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Is Traveling:</label>
          <p>{appointment?.is_traveling || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Deposite Amount:</label>
          <p>{appointment?.is_traveling || "N/A"}</p>
        </div>
        <div className="form-group">
          <label>Total Project Cost:</label>
          <p>{appointment?.total_project_cost || "N/A"}</p>
        </div>

        <div className="form-group">
          <label>Reference Image:</label>
          <div className="image-preview">
            {/* 
            {appointment.reference_image && appointment.reference_image.length > 0 ? (
              appointment.reference_image.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={`Reference ${image.id}`}
                  style={{ width: "100%", maxHeight: "200px", objectFit: "contain", marginBottom: "10px" }}
                />
              )) */}

            {appointment?.reference_images && appointment?.reference_images?.length > 0 ? (
              <div>
                <Slider {...settings}>
                  {appointment?.reference_images?.map((image) => (
                    <div className="image-and-download" key={image?.id}>
                      <div
                        className="download-button"
                        onClick={() => downloadImage(image.url, `reference-${image.id}.jpg`)}
                      >
                        <i className="fas fa-download download-icon" style={{ color: 'yellow' }}></i>
                      </div>
                      <div key={image?.id} className="carousel-slide">

                        <img
                          src={image?.url}
                          alt={`Reference ${image?.id}`}
                          className="reference-image"
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>



            ) : (
              <p>No reference images available.</p>
            )
            }

          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} type="button">Close</button>
        </div>
      </div>
    </div>
  );
};
