import axios from "axios";
import { useState, useEffect } from "react";
import ENV from '../config';

axios.defaults.baseURL = ENV.BASE_URL;


/** custom hook ------- PRZECZYTAJ TO UWAZNIE ------- (just some notes for myself)

ta funkcja robi tak
wysyłasz jej nazwe uzytkownika
i ona po prostu robi get request na /api/user/NAZWA-UZYTKOWNIKA
i to zrwaca informacje takie jak: email, username, /path/to/profile/photo wiesz ocb i do tego _id
tylko ze dla mnie to jest useless bo ja w sumie tego nie potrzebuje (chyba) 
a on to wszystko napisał bo u niego jest mozliwosc dodania imienia nazwiska itp itd
i to trafia do bazy danych a potem tą funkcją mozesz te dane sfetchowac np jak on po to zeby wyswietlic Hello {twoje imie} na stronie do logowania po podaniu nicku bo on ma odzdielnie nick a potem haslo

wiec u niego to dziala tak
podajesz nick na stronie username i on trafia do central store i przenosi cie dalej na strone password i na tej stronie fetchuje ten nick czyli bierze z central store nick ktory ty podales
i wysyła go na useFetch('/user/${username}') no i to potem leci przez tego jebanego hooka czyli w (query) jest zapisane to całe '/user/${username}' czyli na przykład: /user/example
no i wtedy tutaj jest jakies duzo dziwnych gówien chuj wie po co no ale ok ostatecznie co sie dzieje to get requestt na /api/query a query = user/example na przykład czyli ostatecznie leci request na /api/user/example który zwraca te dane co wyzej juz pisałem
no i w ten sposob on pobiera dane o uzytkowniku konkretnie jego imie i potem wyswietla na ekranie dlatego w jego h1 text to Hello {apiData.firstName} bo w apiData zapisuje się to co zwraca ten get request a to co zwraca to w jego przypadku miedzy innymi firstName

czy ja moge do czegos tego uzyc? chyba nie bynajmniej narazie nie ale nie usuwam bo moze sie przyda
a napisalem to po to zeby pamietac na przyszlosc co tu sie odjaniepawla bo chlop zamiast zwyklego geta zrobic to kurwa pisze jakies chuje muje dzikie węże XD

*/
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
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}