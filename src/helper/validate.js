import toast from 'react-hot-toast';
import { authenticate } from './helper';

const lang = localStorage.getItem('i18nextLng');

// ------------ validate login -------------- 
function loginVerify(error = {}, values){
    usernameVerify(error = {}, values);
    passwordVerify(error = {}, values);
    return error;
}
export async function loginValidate(values){
    const errors = loginVerify({}, values);

    if(values.username){
        // check user existance
        const {status} = await authenticate(values.username);

        if(status !== 200){
            errors.exist = toast.error(lang === 'pl' ? 'Użytkownik nie istnieje' : 'User does not exist');
        }
    }

    return errors;
}

// ------------ validate register ------------
function registerVerify(error = {}, values){
    usernameVerify(error = {}, values);
    emailVerify(error = {}, values);
    passwordVerify(error = {}, values);
    passwordConfirmVerify(error = {}, values);
    return error;
}
export async function registerValidate(values){
    const errors = registerVerify({}, values);

    return errors;
}

// -------- validate reset password ----------
function resetVerify(error = {}, values){
    passwordVerify(error = {}, values);
    passwordConfirmVerify(error = {}, values);
    return error;
}
export async function resetValidate(values){
    const errors = resetVerify({}, values);

    return errors;
}


// -------- validate add beer ----------
function addBeerVerify(error = {}, values){
    beerVerify(error = {}, values);
    return error;
}
export async function addBeerValidate(values){
    const errors = addBeerVerify({}, values);

    return errors;
}



// ************************ \\
// **validation functions** \\
// ************************ \\



// validate password
function passwordVerify(error = {}, values){
    if(!values.password){                                         // Password validation
        error.password = toast.error(lang === 'pl' ? 'Hasło Wymagane' : 'Password Required!');
    }else if(values.password.includes(" ")){
        error.password = toast.error(lang === 'pl' ? 'Hasło nie może zawierać spacji' : `Can't use empty space!`);
    }
    return error;
}

// validate password confirm
function passwordConfirmVerify(error = {}, values){
    if(!values.passwordConfirm){                                  // Password confirm validation
        error.passwordConfirm = toast.error(lang === 'pl' ? 'Potwierdź Hasło' : 'Confirm your Password!');
    }else if(values.passwordConfirm !== values.password){
        error.passwordConfirm = toast.error(lang === 'pl' ? 'Hasła nie są takie same' : `Password's doesn't match!`);
    }
    return error;
}

// validate E-Mail
function emailVerify(error = {}, values){
    if(!values.email){                                             // E-Mail validation
        error.email = toast.error(lang === 'pl' ? 'E-Mail Wymagany' : 'E-Mail Required!');
    }else if(!values.email.includes("@")){
        error.email = toast.error(lang === pl ? 'Nieprawidłowy E-Mail' : 'Invalid E-Mail!');
    }
    return error;
}

// validate username
function usernameVerify(error = {}, values){
    if(!values.username){                                               // Username validation
        error.username = toast.error(lang === 'pl' ? 'Nazwa użytkownika wymagana' : 'Username Required!');
    }else if(values.username.includes(" ")){
        error.username = toast.error(lang === 'pl' ? 'Nazwa nie może zawierać spacji' : `Can't use empty space!`);
    }
    return error;
}

// validate add beer
function beerVerify(error = {}, values){
    if(values.beerRating > 10){                                         // Password validation
        error.password = toast.error(lang === 'pl' ? 'Maksymalna ocena to 10' : 'Maximum rating is 10!');
    }
    return error;
}