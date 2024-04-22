import passport from 'passport';
import LocalStrategy from 'passport-local';
import loginRegisterService from '../service/loginRegisterService'

const configPassport = (req, res) => {
    passport.use(new LocalStrategy({
            passReqToCallback: true
        },
        async(req, username, password, cb) => {
            console.log(username)
            const rawData = {
                valueLogin: username,
                password: password
            }

            let res = await loginRegisterService.handleUserLogin(rawData)

            if (res && +res.EC === 0) {
                return cb(null, res.DT);
            } else {
                return cb(null, false, { message: res.EM });
            }

        }
    ))

}

const logout = (req, res, next) => {
    req.session.destroy(function(err) {
        res.clearCookie('sid', { path: '/' });
        res.redirect('/');
    });
}

module.exports = {
    configPassport,
    logout
}