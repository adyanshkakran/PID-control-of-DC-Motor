import  JSONdb  from 'simple-json-db';
import nodemailer from 'nodemailer';
import generator from 'generate-password';
import { createClient } from 'redis';
import sessions from 'express-session';
import ensureAuthenticated  from 'connect-ensure-authenticated';
import cookieParser from 'cookie-parser';
import  Express  from 'express';
import http from 'https';