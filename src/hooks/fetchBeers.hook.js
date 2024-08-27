import axios from "axios";
import { useState, useEffect } from "react";
import ENV from '../config';
import { getUsername } from "../helper/helper";

axios.defaults.baseURL = ENV.BASE_URL;


/** custom hook (just some notes for myself)

to samo co fetch hook ale do piw czyli fetchuje piwa z bazy danych i dajesz tu nick tylko i to robi geta na /api/getBeers/username

*/
export default function fetchBeers(query){
    const [getData, setData] = useState({isLoading: false, beerData: undefined, status: null, serverError: null});

    useEffect(() => {

        const fetchData = async () => {
            try {
                setData(prev => ({...prev, isLoading: true}));

                const {username} = await getUsername();
                const {data, status} = await axios.get(`api/getBeers/${username}`);

                if(status === 201){
                    setData(prev => ({...prev, isLoading: false}));
                    setData(prev => ({...prev, beerData: data, status: status}));
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