import axios from "axios";
import { useState, useEffect } from "react";
import ENV from '../config';
import { getUsername } from "../helper/helper";

axios.defaults.baseURL = ENV.BASE_URL;


/** custom hook (just some notes for myself)

to samo co fetch hook ale do piw czyli fetchuje piwa z bazy danych i dajesz tu nick tylko i to robi geta na /api/getBeers/username

*/
export default function useFetchBeers(query){
    const [getData, setData] = useState({beerIsLoading: false, beerData: undefined, beerStatus: null, beerServerError: null});

    useEffect(() => {

        const fetchData = async () => {
            try {
                setData(prev => ({...prev, isLoading: true}));

                const {username} = await getUsername();
                const {data, status} = !query ? await axios.get(`api/getBeers/${username}`) : await axios.get(`/api/searchBeer/${username}/${query}`); // this second part with query isn't doing anything atm but might use it later or delete it

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