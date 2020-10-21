const dotenv = require('dotenv');

const express = require('express');

const compression = require('compression');
const session = require('session');

const graphQL = require('graphQL');
const schema = require('./src/schema.js');

const path = require('path');
const http = require('http');

dotenv.config();

const ports = {
  http: process.env.PORT || 3002,
}

// Starting Server's
// Page Routing
const app = express();

// Trust https proxys in production
if(app.get('env') === 'production'){
  app.set('trust proxy', 1);
};

// Enable compression
app.use(compression({ filter: (req, res) => {
  if (req.headers['x-no-compression']){ return false };
  return compression.filter(req, res);
}}));
// Create session
app.use(session({
  secret: process.env.SESSION_SECRET || 'password',
  cookie: { secure: true },
  resave: false,
  saveUninitialized: false,
}));

// Make the graphql api avalible
app.use('/api/v1/', graphQL({
  schema: schema,
  // Have a debugger in development
  graphiql: app.get('env') !== 'production',
}));

// Static routes for files
app.use(express.static(path.join(__dirname, 'static')));
if(app.get('env') === 'production'){
  app.use(express.static(path.join(__dirname, 'react-ui', 'build')));
}

// Start the server
const httpServer = http.createServer(app);
httpServer.listen(ports.http, () => {
  console.log(`http server started on port ${ports.http}`);
});
// TODO: https server

if(app.get('env') === 'production'){
  // Send the default page
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'react-ui', 'build', 'index.html'));
  });
  // redirect any request that don't go anywhere to the home page
  app.get('*', (req, res) => {
    res.redirect('/');
  });
}
