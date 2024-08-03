import toast from 'react-hot-toast';

// validate login page username and password
export async function loginValidate(values){
    const errors = loginVerify({}, values);

    return errors;
}

// validate register page username passwords and E-Mail
export async function registerValidate(values){
    const errors = registerVerify({}, values);

    return errors;
}

// validate login
function loginVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required!');
    }else if(values.username.includes(" ")){
        error.username = toast.error('Invalid Username!');
    }else if(!values.password){
        error.password = toast.error('Password Required!');
    }else if(values.password.includes(" ")){
        error.username = toast.error('Invalid Password!');
    }
    return error;
}

// validate register
function registerVerify(error = {}, values){

    if(!values.username){                                               // Username validation
        error.username = toast.error('Username Required!');
    }else if(values.username.includes(" ")){
        error.username = toast.error(`Can't use empty space!`);

    }
    if(!values.mail){                                             // E-Mail validation
        error.mail = toast.error('E-Mail Required!');
    }else if(!values.mail.includes("@")){
        error.mail = toast.error('Invalid E-Mail!');

    }
    if(!values.password){                                         // Password validation
        error.password = toast.error('Password Required!');
    }else if(values.password.includes(" ")){
        error.password = toast.error(`Can't use empty space!`);

    }else if(!values.passwordConfirm){                                  // Password confirm validation
        error.passwordConfirm = toast.error('Confirm your Password!');
    }else if(values.passwordConfirm !== values.password){
        error.passwordConfirm = toast.error(`Password's doesn't match!`);

    }
    return error;
}