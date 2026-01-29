import axios from "axios";
import { useState, useEffect } from "react";
import ENV from '../config';
import { getUsername } from "../helper/helper";

axios.defaults.baseURL = ENV.BASE_URL;


/** custom hook (just some notes for myself)

useFetch() to samo wyciaga z tokena twoj username a potem robi geta zeby wziac twoje info z bazy danych a jesli dasz tu query czyli cokolwiek innego co bedzie po /api/ to wtedy zrobi geta na to co podasz i tyle cala filozofia

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
                if(status === 401){
                    setData(prev => ({...prev, isLoading: false, serverError: error}));
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