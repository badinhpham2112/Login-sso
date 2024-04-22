import express from "express";
import homeController from '../controller/homeController';
import apiController from '../controller/apiController';
import LoginController from '../controller/LoginController'
import passport from 'passport';
import checkLogin from "../middleware/checkUser";
import passportController from '../controller/passportController'
const router = express.Router();

/**
 * 
 * @param {*} app : express app
 */

const initWebRoutes = (app) => {
    //path, handler
    router.get("/", checkLogin.isLogin, homeController.handleHelloWord);
    router.get("/user", homeController.handleUserPage);
    router.post("/users/create-user", homeController.handleCreateNewUser);
    router.post("/delete-user/:id", homeController.handleDelteUser)
    router.get("/update-user/:id", homeController.getUpdateUserPage);
    router.post("/user/update-user", homeController.handleUpdateUser);

    //rest api
    //GET - R, POST- C, PUT - U, DELETE - D
    router.get("/api/test-api", apiController.testApi);

    //Login
    router.get("/login", checkLogin.isLogin, LoginController.getLoginPage)

    // router.post('/login', passport.authenticate('local', {
    //     successRedirect: '/',
    //     failureRedirect: '/login'
    // }));
    router.post('/login', function(req, res, next) {
        passport.authenticate('local', function(error, user, info) {
            if (error) {
                return res.status(500).json(error);
            }
            if (!user) {
                return res.status(401).json(info.message);
            }
            req.login(user, function(err) {
                console.log('>>check user: ', user, req.body.serviceURL)
                if (err) { return next(err); }
                return res.status(200).json({...user, redirectURL: req.body.serviceURL });
            });

        })(req, res, next);
    });
    router.post("/verify-token", LoginController.verifyToken)
    router.post('/logout', passportController.logout)


    router.get('/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/google/redirect',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            // console.log('>>check user Google Login: ', req.user)
            // console.log(req.user.code)
            // res.redirect('/');
            return res.render('social.ejs', { ssoToken: req.user.code })

        });


    router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

    router.get('/facebook/redirect',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            return res.render('social.ejs', { ssoToken: req.user.code })
        });
    return app.use("/", router);
}

export default initWebRoutes;