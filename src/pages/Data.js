import React, { useState } from 'react'
import TableList from '../components/TableList'
import CustomCalendar from '../components/calender/Calender';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Data.css'

const Data = () => {
    const [showTable, setShowTable] = useState(true);
    const { authData, setAuthData } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("loginUserId");
        setAuthData(null); // Clear context or state
        navigate('/login')
    };
    return (
        <div>
            {/* <div className='btn-header'>
                <button onClick={() => { setShowTable(!showTable) }}>{showTable ? "Calender" : "List"}</button>
                {showTable ? "" : <button className="btn-logout" onClick={handleLogout}>
                    Log Out
                </button>}
            </div> */}
            {showTable ? <TableList showTable={showTable} setShowTable={setShowTable}/> : <CustomCalendar showTable={showTable} setShowTable={setShowTable}/>}
        </div>
    )
}

export default Data