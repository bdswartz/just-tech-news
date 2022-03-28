const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const app = express();
const PORT = process.env.PORT || 3001;
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

// create the session object to set up 
const sess = {
  // secret to authenticate cookie (not modified by client)
  secret: 'Super secret secret',
  // cookie object
  cookie: {},
  // recommneded setting false
  resave: false,
  saveUninitialized: true,
  // create session by connecting with db, set up session table, and save session in db
  store: new SequelizeStore({
    db: sequelize
  })
};

// turn on session on server by calling middleware and passing session obj
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// access static html/css files
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});