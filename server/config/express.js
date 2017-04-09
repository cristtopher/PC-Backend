/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import lusca from 'lusca';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import cors from 'cors';

var MongoStore = connectMongo(session);

export default function(app) {
  var env = app.get('env');

  if(env === 'development' || env === 'test') {
    //app.use(express.static(path.join(config.root, '.tmp')));
  }

  if(env === 'production') {
    //app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
  }

  app.set('appPath', path.join(config.root, 'client'));
  app.use(express.static(app.get('appPath')));
  app.use(morgan('dev'));

  app.set('views', `${config.root}/server/views`);
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  // Enable CORS
  app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: 'X-Pagination-Count,X-Pagination-Pages,X-Pagination-Page,X-Pagination-Limit'
  }));
  
  // Persist sessions with MongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'nav'
    })
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if(env !== 'test' && !process.env.SAUCE_USERNAME) {
    app.use(lusca({
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  if(env === 'development') {

  }

  if(env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
