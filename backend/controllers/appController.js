import UserModel from '../model/User.model.js';
import BeerModel from '../model/Beer.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';
import { v2 as cloudinary } from 'cloudinary';

if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
        api_key: ENV.CLOUDINARY_API_KEY,
        api_secret: ENV.CLOUDINARY_API_SECRET,
    });
}


/** middleware for verifying the user */
export async function verifyUser(req, res, next) {
    try {

        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "User does not exist!" });
        next();

    } catch (error) {
        return res.status(500).send({ error: "authentication Error" });
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
export async function login(req, res) {
    const { username, password } = req.body;
    try {
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(correctPassword => {

                        if (!correctPassword) return res.status(400).send({ error: "Incorrect Password" });

                        // create JWT token
                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username
                        }, ENV.JWT_SECRET, { expiresIn: "24h" });
                        return res.status(200).send({
                            msg: "Login Successful",
                            username: user.username,
                            token
                        });

                    }).catch(error => {
                        return res.status(400).send({ error: "Password does not match" })
                    });
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not found" })
            })

    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {

    const { username } = req.params;

    try {
        if (!username) return res.status(501).send({ error: "Invalid username" });

        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(401).send({ error: "User doesn't exist" });
        } else {
            /** remove password and convert to json so we don't return any unnecessary data */
            const { password, ...rest } = Object.assign({}, user.toJSON());
            return res.status(201).send(rest);
        }


    } catch (error) {
        return res.status(404).send({ error: "Cannot find user data" });
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
export async function updateUser(req, res) {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(401).send({ error: "User not found" });
        }

        const body = { ...req.body };

        // If profile avatar is base64, upload to Cloudinary
        if (body.profile && typeof body.profile === 'string' && !body.profile.startsWith('http') && ENV.CLOUDINARY_CLOUD_NAME) {
            try {
                const uploadRes = await cloudinary.uploader.upload(body.profile, {
                    folder: "beerdex/avatars",
                    resource_type: "image",
                });
                body.profile = uploadRes.secure_url;
            } catch (uploadErr) {
                console.error("Avatar Cloudinary upload error:", uploadErr);
            }
        }

        const update = await UserModel.updateOne({ _id: userId }, body);
        if (!update) {
            return res.status(501).send({ error: "Couldn't update the data" });
        } else {
            return res.status(201).send({ msg: "Successfully updated the data" });
        }
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    try {
        const { username } = req.query;
        if (!username) return res.status(400).send({ error: "Username required" });

        const otp = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

        await UserModel.updateOne({ username }, { resetOtp: otp, resetOtpExpires: expiresAt, resetSession: false });
        return res.status(201).send({ code: otp });
    } catch (error) {
        return res.status(500).send({ error: "Could not generate OTP" });
    }
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    try {
        const { username, code } = req.query;
        if (!username || !code) return res.status(400).send({ error: "Username and code required" });

        const user = await UserModel.findOne({ username });
        if (!user || !user.resetOtp || user.resetOtp !== code.toString() || !user.resetOtpExpires || new Date() > user.resetOtpExpires) {
            return res.status(400).send({ error: "Invalid or expired OTP" });
        }

        await UserModel.updateOne({ username }, { resetOtp: null, resetOtpExpires: null, resetSession: true });
        return res.status(201).send({ msg: "Verify success" });
    } catch (error) {
        return res.status(500).send({ error: "OTP verification failed" });
    }
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    return res.status(201).send({ msg: "Access granted." });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send({ error: "Username and password required" });

        const findUser = await UserModel.findOne({ username });
        if (!findUser) return res.status(404).send({ error: "Username not found" });

        if (!findUser.resetSession) {
            return res.status(403).send({ error: "Session expired or not verified." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.updateOne({ username: findUser.username }, { password: hashedPassword, resetSession: false });
        return res.status(201).send({ msg: "Password reset successfully" });
    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
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
    const { beerName, beerVariant, beerDescription, beerRating, beerPhoto, beerVerticalStyle, beerHorizontalStyle, beerWidthStyle } = req.body;
    const beerOwner = req.user?.username || req.body.beerOwner;

    try {
        if (!beerOwner || !beerName || !beerVariant || !beerDescription || !beerRating) {
            return res.status(400).send({ error: "You haven't specified some information" });
        }

        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;

        let finalPhotoUrl = "";
        if (beerPhoto && typeof beerPhoto === "string" && beerPhoto.trim().length > 0) {
            if (beerPhoto.startsWith("http://") || beerPhoto.startsWith("https://")) {
                finalPhotoUrl = beerPhoto;
            } else if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
                try {
                    const uploadRes = await cloudinary.uploader.upload(beerPhoto, {
                        folder: "beerdex/beers",
                        resource_type: "image",
                    });
                    finalPhotoUrl = uploadRes.secure_url;
                } catch (uploadErr) {
                    console.error("Cloudinary beer upload error:", uploadErr);
                    finalPhotoUrl = beerPhoto;
                }
            } else {
                finalPhotoUrl = beerPhoto;
            }
        }

        const beer = new BeerModel({
            beerOwner,
            beerName,
            beerVariant,
            beerDescription,
            beerRating,
            beerPhoto: finalPhotoUrl,
            beerDate: `${currentDate}`,
            beerVerticalStyle,
            beerHorizontalStyle,
            beerWidthStyle
        });

        await beer.save();
        return res.status(201).send({ msg: "Beer Added successfully" });
    } catch (error) {
        console.error("createBeer error:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
}

/** GET: http://localhost:8080/api/getBeers/example123 
 * Get all user beers from database
*/
export async function getBeers(req, res) {
    const username = req.user?.username || req.params.username;

    try {
        if (!username) return res.status(400).send({ error: "Invalid username" });

        const beers = await BeerModel.find({ beerOwner: username });
        return res.status(201).send(beers || []);
    } catch (error) {
        return res.status(500).send({ error: "Cannot find user beers" });
    }
}

/** PUT: http://localhost:8080/api/removeBeer
 * beerName
 * beerVariant
 * 
 * removes specific beer from database for authenticated user
 */
export async function removeBeer(req, res) {
    const { beerName, beerVariant } = req.body;
    const beerOwner = req.user?.username || req.body.beerOwner;

    if (beerName && beerVariant && beerOwner) {
        const remove = await BeerModel.deleteOne({ beerName, beerVariant, beerOwner });
        if (!remove || remove.deletedCount === 0) {
            return res.status(404).send({ error: "Beer not found or invalid" });
        } else {
            return res.status(200).send({ msg: "Beer removed successfully!" });
        }
    } else {
        return res.status(400).send({ error: "Some information is missing" });
    }
}

/** GET: http://localhost:8080/api/searchBeers/exampleUsername/exampleBeerName 
 * search for a beer in database
*/
export async function searchBeers(req, res) {
    const username = req.user?.username || req.params.username;
    const { beerSearch } = req.params;

    try {
        if (!username || !beerSearch) return res.status(400).send({ error: "username or beerSearch is empty" });

        // Database-level filtering for fast and case-insensitive search
        const beers = await BeerModel.find({
            beerOwner: username,
            $or: [
                { beerName: { $regex: beerSearch, $options: 'i' } },
                { beerVariant: { $regex: beerSearch, $options: 'i' } },
                { beerDescription: { $regex: beerSearch, $options: 'i' } }
            ]
        });

        return res.status(201).send(beers);
    } catch (error) {
        return res.status(500).send({ error: "An error occurred during search" });
    }
}


// TEST
export async function test(req, res) {
    return res.status(200).send(`If you can see this message, that means the server backend responded to your request and its working :)`);
}