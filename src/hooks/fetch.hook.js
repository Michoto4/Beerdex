import axios from "axios";
import { useState, useEffect } from "react";
import ENV from '../config';
import { getUsername } from "../helper/helper";

axios.defaults.baseURL = ENV.BASE_URL;


/** custom hook (just some notes for myself)

to po prostu wysyła geta na /api/user/username i to całe query to wlasnie "/user/username" wiec jak wyslesz do tego hooka nazwe uzytkownika to ta funkcja go sfetchuje i zreturnuje dane tego uzytkownika
ale podstawowo ta funkcja bierze dane z twojego jwt tokena i wyciąga z niego username i potem fetchuje te informacje no tak normalnie po prostu tylko ze nick bierze z twojego tokena nie musisz nic tutaj przesyłać temu hookowi

no ale w skrócie to po prostu fetchuje informacje o uzytkowniku którego nick podasz dla tego hooka

*/
export default function useFetch(query){
    const [getData, setData] = useState({isLoading: false, apiData: undefined, status: null, serverError: null});

    useEffect(() => {

        const fetchData = async () => {
            try {
                setData(prev => ({...prev, isLoading: true}));

                const {username} = !query ? await getUsername() : '';
                const {data, status} = !query ? await axios.get(`api/user/${username}`) : await axios.get(`/api/${query}`);

                if(status === 201){
                    setData(prev => ({...prev, isLoading: false}));
                    setData(prev => ({...prev, apiData: data, status: status}));
                }
                setData(prev => ({...prev, isLoading: false}));

            } catch (error) {
                setData(prev => ({...prev, isLoading: false, serverError: error}));
            }
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}