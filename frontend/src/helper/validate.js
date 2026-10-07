import toast from 'react-hot-toast';
import { authenticate } from './helper';

const lang = localStorage.getItem('i18nextLng');

// ------------ validate login -------------- 
function loginVerify(error = {}, values) {
  usernameVerify(error = {}, values);
  passwordVerify(error = {}, values);
  return error;
}
export async function loginValidate(values) {
  const errors = loginVerify({}, values);

  if (values.username) {
    // check user existance
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exist = toast.error(lang === 'pl' ? 'Użytkownik nie istnieje' : 'User does not exist');
    }
  }

  return errors;
}

// ------------ validate register ------------
function registerVerify(error = {}, values) {
  usernameVerify(error = {}, values);
  emailVerify(error = {}, values);
  passwordVerify(error = {}, values);
  passwordConfirmVerify(error = {}, values);
  return error;
}
export async function registerValidate(values) {
  const errors = registerVerify({}, values);

  return errors;
}

// -------- validate reset password ----------
function resetVerify(error = {}, values) {
  passwordVerify(error = {}, values);
  passwordConfirmVerify(error = {}, values);
  return error;
}
export async function resetValidate(values) {
  const errors = resetVerify({}, values);

  return errors;
}


// -------- validate add beer ----------
function addBeerVerify(error = {}, values) {
  beerVerify(error = {}, values);
  return error;
}
export async function addBeerValidate(values) {
  const errors = addBeerVerify({}, values);

  return errors;
}



// ************************ \\
// **validation functions** \\
// ************************ \\



// validate password
function passwordVerify(error = {}, values) {
  if (!values.password) {                                         // Password validation
    error.password = toast.error(lang === 'pl' ? 'Hasło Wymagane' : 'Password Required!');
  } else if (values.password.includes(" ")) {
    error.password = toast.error(lang === 'pl' ? 'Hasło nie może zawierać spacji' : `Can't use empty space!`);
  }
  return error;
}

// validate password confirm
function passwordConfirmVerify(error = {}, values) {
  if (!values.passwordConfirm) {                                  // Password confirm validation
    error.passwordConfirm = toast.error(lang === 'pl' ? 'Potwierdź Hasło' : 'Confirm your Password!');
  } else if (values.passwordConfirm !== values.password) {
    error.passwordConfirm = toast.error(lang === 'pl' ? 'Hasła nie są takie same' : `Password's doesn't match!`);
  }
  return error;
}

// validate E-Mail
function emailVerify(error = {}, values) {
  const currentLang = localStorage.getItem('i18nextLng') || 'en';
  if (!values.email) {                                             // E-Mail validation
    error.email = toast.error(currentLang.startsWith('pl') ? 'E-Mail Wymagany' : 'E-Mail Required!');
  } else if (!values.email.includes("@")) {
    error.email = toast.error(currentLang.startsWith('pl') ? 'Nieprawidłowy E-Mail' : 'Invalid E-Mail!');
  }
  return error;
}

// validate username
function usernameVerify(error = {}, values) {
  const currentLang = localStorage.getItem('i18nextLng') || 'en';
  if (!values.username) {                                               // Username validation
    error.username = toast.error(currentLang.startsWith('pl') ? 'Nazwa użytkownika wymagana' : 'Username Required!');
  } else if (values.username.includes(" ")) {
    error.username = toast.error(currentLang.startsWith('pl') ? 'Nazwa nie może zawierać spacji' : `Can't use empty space!`);
  }
  return error;
}

// validate add beer
function beerVerify(error = {}, values) {
  const currentLang = localStorage.getItem('i18nextLng') || 'en';
  if (values.beerRating > 10) {                                         // beer validation
    error.beerRating = toast.error(currentLang.startsWith('pl') ? 'Maksymalna ocena to 10' : 'Maximum rating is 10!');
  } else if (values.beerDescription && values.beerDescription.length > 1500) {
    error.beerDescription = toast.error(currentLang.startsWith('pl') ? 'Za długi opis (max 1500 znaków)' : 'Too long description (max 1500 chars)');
  }
  return error;
}

export async function changePasswordValidate(values) {
  const currentLang = localStorage.getItem('i18nextLng') || 'en';
  const errors = {};
  if (!values.currentPassword) {
    errors.currentPassword = toast.error(currentLang.startsWith('pl') ? 'Podaj aktualne hasło' : 'Current password required');
  } else if (!values.newPassword) {
    errors.newPassword = toast.error(currentLang.startsWith('pl') ? 'Podaj nowe hasło' : 'New password required');
  } else if (values.newPassword.length < 4) {
    errors.newPassword = toast.error(currentLang.startsWith('pl') ? 'Hasło musi mieć min. 4 znaki' : 'Password must be at least 4 characters');
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = toast.error(currentLang.startsWith('pl') ? 'Hasła nie są takie same' : "Passwords do not match");
  }
  return errors;
}
