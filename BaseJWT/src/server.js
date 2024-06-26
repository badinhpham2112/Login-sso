require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import configCors from "./config/cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectDB'
import configSession from "./config/session";
import { configPassport } from "./controller/passportController";
import flash from 'connect-flash';
import configloginWithGoogle from "./controller/social/GoogleController";
import configloginWithFacebook from "./controller/social/FacebookController";
// import connection from "./config/connectDB";

const app = express();
const PORT = process.env.PORT || 8080;

//message error

app.use(flash());

//config cors
configCors(app);
connectDB();

//config view engine
configViewEngine(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cookie -parser
app.use(cookieParser());
configSession(app)

//test connection db
// connection();


//init web routes
initWebRoutes(app);
initApiRoutes(app);

//req => middleware => res
app.use((req, res) => {
    return res.send('404 not found')
})

configPassport()
configloginWithGoogle();
configloginWithFacebook();

app.listen(PORT, () => {
    console.log(">>> JWT Backend is running on the port = " + PORT);
})