import axios from "axios";
import ENV from '../config';

axios.defaults.baseURL = ENV.BASE_URL;


/** make API requests */


/** authenticate function */
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', {username})
    } catch (error) {
        return {error: "Username doesn't exist"}
    }
}

/** get User details */
export async function getUser({username}){
    try {
        const {data} = await axios.get(`/api/user/${username}`);
        return {data};
    } catch (error) {
        return {error: "Password dosen't match"}
    }
}

/** register user function */
export async function registerUser(credentials){
    try {
        const {data: {msg}, status} = await axios.post(`/api/register`, credentials)

        let {username, email} = credentials;

        let html = `<h1>Welcome to Beerdex, ${username}</h1></br><p>Your account has been successfully created!</p></br><p>We hope you'll have a wonderfull experience using beerdex! ❤</p>`;

        if(status === 201){                                           
            await axios.post('/api/sendMail', {username, userEmail: email, subject: msg, html});
        } 
        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject({error})
    }
}

/** login function */
export async function loginUser({username, password}){
    try {
        if(username){
            const {data} = await axios.post('/api/login', {username, password});
            return Promise.resolve({data});
        }
    } catch (error) {
        return Promise.reject({error: "Password doesn't match"});
    }
}

/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, {headers: {"Authorization" : `bearer ${token}`}});

        return Promise.resolve({data});

    } catch (error) {
        return Promise.reject({error: "Couldn't update profile"})
    }
}

/** generate OTP */
export async function generateOTP(username){
    try {
        const {data: {code}, status} = await axios.get('/api/generateOTP', {params: {username}});

        let html = `<h1>Beerdex Password Reset</h1></br><hr></br><h3>Your Code is: ${code}</h3></br><p>If You didn't request a password reset, consider changing your Beerdex and E-Mail passwords to prevent any malicious activity.</p>`;

        let subject = `Password Reset`;

        // SEND MAIL WITH THE OTP
        if(status === 201){
            let {data: {email}} = await getUser({username})
            
            await axios.post('/api/sendMail', {username, userEmail: email, subject, html});
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject ({error});
    }
}

/** verify OTP */
export async function verifyOTP({username, code}){

    try {
        const {data, status} = await axios.get('/api/verifyOTP', {params: {username, code}});
        return {data, status};
    } catch (error) {
        return Promise.reject(error);
    }

}

/** reset password */
export async function resetPassword({username, password}){
    try {
        const {data, status} = await axios.put('/api/resetPassword', {username, password});
        return Promise.resolve({data, status});
    } catch (error) {
        return Promise.reject({error});
    }
}