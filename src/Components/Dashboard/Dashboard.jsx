import React from "react";
import './Dashboard.css';
import '../../App.css';

function Dashboard(){

    return(
        <div>
            <h1>Dashboard Page</h1><br /><hr />
            <a href="/"><button className="tempButton">LOG OUT</button></a>
        </div>
    )
}

export default Dashboard