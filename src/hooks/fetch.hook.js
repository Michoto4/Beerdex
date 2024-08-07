import axios from "axios";
import { useState, useEffect } from "react";

axios.defaults.baseURL = 'http://localhost:8080'; // http://130.162.228.126:8080



export default function useFetch(query){
    const [getData, setData] = useState({isLoading: false, apiData: undefined, status: null, serverError: null});

    useEffect(() => {

        if(!query) return;

        const fetchData = async () => {
            try {
                setData(prev => ({...prev, isLoading: true}));

                const {data, status} = await axios.get(`/api/${query}`);

                if(status === 201){
                    setData(prev => ({...prev, isLoading: false}));
                    setData(prev => ({...prev, apiData: data, status: status}));
                }
                setData(prev => ({...prev, isLoading: false}));

            } catch (error) {
                setData(prev => ({...prev, isLoading: false, serverError: error}));
            }
        }

    }, [query]);

    return [getData, setData];
}