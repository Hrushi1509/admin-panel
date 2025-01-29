import React from 'react';
import './AppointmentsListModal.css'; // Import the CSS file

function capitalizeWords(inputStr) {
    // Split the input string by spaces

    // if(!inputStr){
    //   return
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

export const AppointmentsListModal = ({ appointments, onSelect, onClose }) => (
    
  <div className="appointments-list-modal-overlay">
    <div className="appointments-list-modal">
      <h2>Select an Respective Client</h2>
      <ul>
        {appointments.map((appointment) => (
          <li
            key={appointment?.id}
            onClick={() => onSelect(appointment)}
            style={{ cursor: "pointer" }}
          >
            {/* {capitalizeWords(appointment?.user?.username)} */}
            {appointment?.user?.username}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);
