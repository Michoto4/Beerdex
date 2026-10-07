import { Router } from "express";
const router = Router();


// import all controllers
import * as controller from '../controllers/appController.js'
import Auth, {localVariables} from '../middleware/auth.js';
import { sendMail } from "../controllers/mailer.js";

/** POST Methods */
router.route('/register').post(controller.register); // register user
router.route('/sendMail').post(sendMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req,res) => res.end()); // authenticate the user
router.route('/login').post(controller.verifyUser, controller.login); // login to app
router.route('/createBeer').post(Auth, controller.createBeer); // create a new beer (protected)


/** GET Methods */
router.route('/user/:username').get(controller.getUser); // user with username
router.route('/generateOTP').get(controller.verifyUser, controller.generateOTP); // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables
router.route('/getBeers/:username').get(Auth, controller.getBeers); // get all beers from user beer database (protected)
router.route('/searchBeer/:username/:beerSearch').get(Auth, controller.searchBeers); // search for a specific beer (protected)


/** PUT Methods */
router.route('/updateuser').put(Auth, controller.updateUser); // used to update the user profile (protected)
router.route('/changePassword').put(Auth, controller.changePassword); // used to change password while logged in (protected)
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // used to reset password
router.route('/removeBeer').put(Auth, controller.removeBeer); // used to remove the beer from database (protected)

// TEST 
router.route('/test').get(controller.test); // TEST IF BACKEND IS WORKING


export default router;