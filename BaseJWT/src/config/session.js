import Sequelize from "sequelize";
import session from "express-session";
import passport from 'passport';
require("dotenv").config();
const configSession = (app) => {
    const SequelizeStore = require("connect-session-sequelize")(session.Store);

    // create database, ensure 'sqlite3' in your package.json
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
        timezone: "+07:00",
        define: {
            freezeTableName: true
        },

    });

    var myStore = new SequelizeStore({
        db: sequelize,
    });


    app.use(
        session({
            secret: "keyboard cat",
            store: myStore,
            resave: false, // we support the touch method so per the express-session docs this should be set to false
            proxy: true, // if you do SSL outside of node.
            saveUninitialized: false,
            expiration: 300 * 1000,
            cookie: { expires: 300 * 1000 }
        })
    );

    myStore.sync();

    app.use(passport.authenticate('session'));

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            //   cb(null, { id: user.id, username: user.username });
            cb(null, user);
        });
    });

    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
}

export default configSession;