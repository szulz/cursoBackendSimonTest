import 'dotenv/config';
import fetch from 'node-fetch';
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import local from 'passport-local';
import { CartModel } from '../DAO/mongo/models/carts.model.js';
import { UserSchema } from '../DAO/mongo/models/users.model.js';
import { userModelLogic } from '../DAO/mongo/users.mongo.js';
import { createHash, isValidPassword, logger } from '../utils.js';

const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done,req,res) => {
        try {
          const user = await UserSchema.findOne({ email: username });
          if (!user) {
            console.log('User Not Found with username (email) ' + username);
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            console.log('Invalid Password');
            return done(null, false);
          }
          logger.info('User logged in');
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, first_name, last_name, age, password } = req.body;
          let user = await UserSchema.findOne({ email: username });
          if (user) {
            console.log('User already exists');
            return done(null, false);
          }
          const cart = await CartModel.create({});
          const cartId = cart._id;
          const newUser = {
            email,
            first_name,
            last_name,
            age,
            role: 'user',
            password: createHash(password),
            cart: cartId,
          };
          let userCreated = await userModelLogic.create(newUser);
          console.log(userCreated);
          console.log('User Registration successful');
          req.session.user = {
            _id: userCreated._id,
            email: userCreated.email,
            first_name: userCreated.first_name,
            last_name: userCreated.last_name,
            age: userCreated.age,
            role: userCreated.role,
            cart: userCreated.cart,
          };
          return done(null, userCreated);
        } catch (e) {
          logger.alert('Error registering new user');
          console.log('Error in register');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_clientID,
        clientSecret: process.env.GITHUB_clientSecret,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accesToken, _, profile, done, req, res) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;

          let user = await UserSchema.findOne({ email: profile.email });
          const fullname = profile._json.name.split(' ');

          if (!user) {
            const cart = await CartModel.create({});
            const cartId = cart._id;
            const newUser = {
              email: profile.email,
              first_name: fullname[0] || profile._json.login || 'noname',
              last_name: fullname[fullname.length - 1],
              role: 'user',
              age: '',
              password: 'nopass',
              cart: cartId,
            };
            let userCreated = await userModelLogic.create(newUser);
            console.log('User Registration successful');
            req.session.user = {
              _id: userCreated._id,
              email: userCreated.email,
              first_name: userCreated.first_name,
              last_name: userCreated.last_name,
              age: userCreated.age,
              role: userCreated.role,
              cart: userCreated.cart,
            };
            console.log(req.session.user);
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModelLogic.findById(id);
    done(null, user);
  });
}
