import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getUsername } from "../helper/helper";

// check if user is logged in and decide where to redirect them

export default function Intersection(){
    const navigate = useNavigate()
    let checkToken = localStorage.getItem('token');
    if(!checkToken){
        useEffect(() => {
            navigate('/login');
        });
    } else {
        let username = getUsername();
        if(!username){
            useEffect(() => {
                navigate('/login');
            });
        } else {
            useEffect(() => {
                navigate('/home');
            });
        }
    }

    return <></>;
}