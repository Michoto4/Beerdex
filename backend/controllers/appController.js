import UserModel from '../model/User.model.js';
import BeerModel from '../model/Beer.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';


/** middleware for verifying the user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username});
        if(!exist) return res.status(404).send({error: "User does not exist!"});
        next();

    } catch (error) {
        return res.status(500).send({error: "authentication Error"});
    }
}


/** POST: http://localhost:8080/api/register
 : {
"username" : "example123",
"password" : "examplePassword",
"email" : "example@email.com",
"profile" : ""
}

*/
export async function register(req, res) {
    const { username, password, email, profile } = req.body;
    try {        

        // check the existing user
        const existUsername = UserModel.findOne({ username });
        const existEmail = UserModel.findOne({ email });

        // Wait for both checks to complete
        const [userWithSameUsername, userWithSameEmail] = await Promise.all([existUsername, existEmail]);

        if (userWithSameUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        if (userWithSameEmail) {
            return res.status(400).send({ error: "Please use a unique email" });
        }

        // If no users are found, hash the password and create a new user
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || '',
                email
            });

            // Save the user and return a success response
            await user.save();
            return res.status(201).send({ msg: "User registered successfully" });
        } else {
            return res.status(400).send({ error: "Password is required" });
        }

    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
}

/** POST: http://localhost:8080/api/login
 : {
"username" : "example123",
"password" : "examplePassword",
}

*/
export async function login(req,res){
    const { username, password } = req.body;
    try {
        UserModel.findOne({ username })
        .then(user => {
            bcrypt.compare(password, user.password)
                .then(correctPassword => {

                    if(!correctPassword) return res.status(400).send({error: "Incorrect Password"});

                    // create JWT token
                    const token = jwt.sign({
                            userId: user._id,
                            username: user.username
                        }, ENV.JWT_SECRET, {expiresIn: "24h"});
                    return res.status(200).send({
                        msg: "Login Successful",
                        username: user.username,
                        token
                    });

                }).catch(error => {return res.status(400).send({error: "Password does not match"})
            });
        })
        .catch(error => {
            return res.status(404).send({error: "Username not found"})
        })

    } catch (error) {
        return res.status(500).send({error : "Internal Server Error"});
    }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    
    const { username } = req.params;

    try {
        if(!username) return res.status(501).send({error: "Invalid username"});

            const user = await UserModel.findOne({ username });
            if(!user){
                return res.status(401).send({error: "User doesn't exist"});
            } else {
                /** remove password and convert to json so we don't return any unnecessary data */
                const {password, ...rest} = Object.assign({}, user.toJSON());
                return res.status(201).send(rest);
            }
        

    } catch (error) {
        return res.status(404).send({error: "Cannot find user data"});
    }

}

/** GET: http://localhost:8080/api/updateuser 
     : {
    "id": "<userid>"
    }
    body: {
    username: '',
    profile: ''
    }

*/
export async function updateUser(req,res){
    try {
        
        // const id = req.query.id;
        const {userId} = req.user;
        if(userId){
            const body = req.body;

            // update the data
            const update = await UserModel.updateOne({_id: userId}, body);
            if(!update){
                return res.status(501).send({error: "Couldn't update the data"});
            } else {
                return res.status(201).send({msg: "Successfully updated the data"});
            }
            


        } else {
            return res.status(401).send({error: "User not found"});
        }

    } catch (error) {
        return res.status(404).send({error: "Internal Server Error"});
    }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    res.status(201).send({code: req.app.locals.OTP});
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({msg: "Verify success"});
    }
    return res.status(400).send({error: "invalid OTP"});
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
    if(req.app.locals.resetSession){
        req.app.locals.resetSession = false; // allow acces to this route only once
        return res.status(201).send({msg: "Access granted."});
    }
    return res.status(404).send({error: "Session expired."})
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        if(!req.app.locals.resetSession) return res.status(404).send({error: "Session expired."}); // check if user is in reset session, if not - deny the access

        const { username, password } = req.body;

        const findUser = await UserModel.findOne({username});
        if(!findUser) return res.status(404).send({error: "Username not found"}); // check if user was found, if not - throw error

        if (password) { // check if password was provided
            const hashedPassword = await bcrypt.hash(password, 10) // hash the password
            await UserModel.updateOne({username: findUser.username}, {password: hashedPassword}) // update the password
            return res.status(201).send({ msg: "Password reseted successfully" }); // if no error, return success
        } else {
            return res.status(400).send({ error: "Password wasn't provided" }); // if password wasn't provided, throw error
        }
    } catch (error) {
        return res.status(401).send(`TryCatch error: ${error}`);
    }
}

/** POST: http://localhost:8080/api/createBeer
 : {
"beerName" : "Desperados",
"beerVariant" : "Mohito",
"beerDescription" : "Pyszne piwko",
"beerRating" : "8",
"beerPhoto" : ""
}

*/
export async function createBeer(req, res) {
    const { beerOwner, beerName, beerVariant, beerDescription, beerRating, beerPhoto, beerVerticalStyle, beerHorizontalStyle, beerWidthStyle } = req.body;
    try {        

        const date = new Date()
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day.toString().padStart(2, 0)}.${month.toString().padStart(2, 0)}.${year}`;

        // check if user gave all the required information to create a beer and then create it
        if (beerOwner && beerName && beerVariant && beerDescription && beerRating) {

            const beer = new BeerModel({
                beerOwner,
                beerName,
                beerVariant,
                beerDescription,
                beerRating,
                beerPhoto,
                beerDate: `${currentDate}`,
                beerVerticalStyle,
                beerHorizontalStyle,
                beerWidthStyle
            });

            // Save the beer and return a success response
            await beer.save();
            return res.status(201).send({ msg: "Beer Added successfully" });
        } else {
            return res.status(400).send({ error: "You haven't specified some information" });
        }

    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
}

/** GET: http://localhost:8080/api/getBeers/example123 
 * Get all user beers from database
*/
export async function getBeers(req,res){
    
    const { username } = req.params;
    

    try {
        if(!username) return res.status(501).send({error: "Invalid username"});

        const beers = await BeerModel.find({ beerOwner: username });
        if(!beers){
            return res.status(501).send({error: "You don't have any beers!"});
        } else {
            return res.status(201).send(beers);
        }
        

    } catch (error) {
        return res.status(404).send({error: "Cannot find user beers"});
    }

}

/** PUT: http://localhost:8080/api/removeBeer
 * beerName
 * beerVariant
 * beerOwner
 * 
 * removes specific beer from database
 */
export async function removeBeer(req,res){
    const { beerName, beerVariant, beerOwner } = req.body;

    console.log({ beerName, beerVariant, beerOwner })
    
    if(beerName && beerVariant && beerOwner){
        const remove = await BeerModel.deleteOne({beerName: `${beerName}`, beerVariant: `${beerVariant}`, beerOwner: `${beerOwner}`})
        if(!remove){
            return res.status(404).send({error: "Given beer was invalid"})
        } else {
            return res.status(200).send({msg: "Beer removed successfully!"})
        }
    } else {
        return res.status(404).send({error: "Some Information is missing"})
    }
}

/** GET: http://localhost:8080/api/searchBeers/exampleUsername/exampleBeerName 
 * search for a beer in database
*/
export async function searchBeers(req,res){
    
    const { username, beerSearch } = req.params;
    console.log(username, beerSearch);

    try {
        if(!username || !beerSearch) return res.status(501).send({error: "username or beerName is empty"});

        const beersSearchResults = await BeerModel.find({ $text: { $search: `${beerSearch}` } }, {}); // to gowno szuka wszystkie piwa, nie konkretnego uzytkownika tylko WSZYSTKIE i dziala normalnie a ja myslalem ze to daje tylko id kurwa szkoda gadac szczerze jestem kretynem po prostu XD

        const finalBeerSearchResults = [];

        for (let index = 0; index < beersSearchResults.length; index++) {

            const beer = beersSearchResults[index]; // bierze jedno piwo z arrayu piw

            const {beerOwner} = beer; // wyciaga z tego piwa nazwe uzytkownikia

            if(beerOwner == username){
                finalBeerSearchResults.push(beer); // jesli nazwa uzytkownika zgadza się z tą która została tu wysłana to git a jesli nie to skip
            }
        }

        console.log(finalBeerSearchResults);
        
        if(!finalBeerSearchResults){
            return res.status(401).send({error: "Couldn't find that beer!"});
        } else {
            return res.status(201).send(finalBeerSearchResults);
        }
    } catch (error) {
        return res.status(404).send({error: "An error occured"});
    }

}

// TEST
export async function test(req,res){
    return res.status(200).send(`If you can see this message, that means the server backend responded to your request and its working :)`);
}