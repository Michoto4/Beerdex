import React from "react";
import './Home.module.css';
import '../../App.css';

function Home(){

    return(
        <div>
            <h1>Home Page</h1><br /><hr />
            <a href="/"><button className="tempButton">LOG OUT</button></a>
        </div>
    )
}

export default Home