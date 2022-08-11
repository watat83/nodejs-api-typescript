import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as favicon from 'serve-favicon';
import * as cors from 'cors';
import * as methodOverride from 'method-override';

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// Set API Request Limiter
import rateLimit from 'express-rate-limit';

import environment from "../environment";
import { TestRoutes } from "../routes/test_routes";
import { CommonRoutes } from "../routes/common_routes";
import { UserRoutes } from "../routes/user_routes";

class App {
    public app: express.Application;
    public mongoUrl: string = process.env.MONGODB_ATLAS_URL ||
        'mongodb://localhost/' + environment.getDBName();

    private test_routes: TestRoutes = new TestRoutes();
    private common_routes: CommonRoutes = new CommonRoutes();
    private user_routes: UserRoutes = new UserRoutes();

    constructor() {
        this.app = express();
        this.config();

        // Setup MongoDB
        this.mongoSetup();

        this.app.use(morgan('dev'));
        this.app.use(favicon('favicon.ico' || 'public/favicon.ico' || 'https://via.placeholder.com/32'));
        this.app.use(cors());

        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json({
            type: 'application/vnd.api+json'
        })); // parse application/vnd.api+json as json
        this.app.use(bodyParser.json({
            type: 'application/*+json'
        })); // parse application/vnd.api+json as json
        this.app.use(methodOverride()); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

        this.app.use(function (req, res, next) {
            var pattern = /.(ttf|otf|eot|woff|jpg|png|jpeg|gif|js|json|html|css|pdf)/
            if (pattern.test(req.url)) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,  Accept ,Origin,Authorization,User-Agent, DNT,Cache-Control, X-Mx-ReqToken, Keep-Alive, If-Modified-Since');
                res.setHeader('Access-Control-Allow-Credentials', 1);
            }
            next();
        });

        this.app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 
        const apiLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        });

        //  apply to all requests
        // Apply the rate limiting middleware to API calls only
        this.app.use('/api', apiLimiter);


        // Set static folders
        this.app.use(express.static(path.join(__dirname, 'public')));

        // add routes
        this.user_routes.route(this.app);

        this.test_routes.route(this.app);

        this.common_routes.route(this.app);


    }
    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private mongoSetup() {
        mongoose.connect(this.mongoUrl).then((db: any) => {
            // console.log(db.connection.host);
            console.log('Connected to database... ' + (db.connection.name) + ' on PORT ' + (db.connection.port));
        }).catch((err: any) => {
            console.log(err);
        });
    }
}
export default new App().app;