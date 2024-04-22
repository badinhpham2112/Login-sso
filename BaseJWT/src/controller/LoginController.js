import { v4 as uuidv4 } from 'uuid';
import loginRegisterService from '../service/loginRegisterService'
import { createJWT } from '../middleware/JWTAction';
import 'dotenv/config'
const getLoginPage = (req, res) => {
    const serviceURL = req.query.serviceURL;
    // console.log('>>check serviceUR: ', serviceURL)
    return res.render("login.ejs", { redirectURL: serviceURL })

}

const verifyToken = async(req, res) => {
    try {
        const ssoToken = req.body.ssoToken

        //check token
        if (req.user && req.user.code && req.user.code === ssoToken) {
            const refreshToken = uuidv4();
            //update user
            await loginRegisterService.refreshToken(req.user.email, req.user.code)
                //create token
            let payload = {
                email: req.user.email,
                groupWithRoles: req.user.groupWithRoles,
                username: req.user.username,
            }
            let token = createJWT(payload);
            //set Cookie
            res.cookie('refresh_token', refreshToken, {
                maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
                path: '/'

            })

            res.cookie('access_token', token, {
                maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
                path: '/'

            })



            const resData = {
                access_token: token,
                refreshToken: refreshToken,
                email: req.user.email,
                groupWithRoles: req.user.groupWithRoles,
                username: req.user.username,

            }

            //distroy session

            req.session.destroy(function(err) {
                req.logout()

            });

            return res.status(200).json({
                EM: "ok",
                EC: 0,
                DT: resData


            })

        } else {
            return res.status(401).json({
                EM: "not match ssoToken",
                EC: 1,
                DT: ''
            })

        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: "something wrong in the server...",
            EC: -1,
            DT: ''
        })

    }
    //validate domains

    //return jwt, refresh token

}

module.exports = { getLoginPage, verifyToken }