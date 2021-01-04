'use strict';

const { Sequelize } = require('sequelize');
const { sequelize } = require('./models');

// load modules
const express = require('express');
const morgan = require('morgan');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Test the database connection.
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();


// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// setup a user GET route
app.get('/api/users', (req,res) => {

});

// setup a user POST route
app.post('/api/users', (req,res) => {

});

// setup a course GET route that returns all courses including the User that owns each course and a 200 HTTP status code
app.get('/api/courses', (req, res) => {

});

// setup a course GET route that returns coresponding course with a 200 HTTP status code
app.post('/api/courses/:id', (req,res) => {

});

// setup a course POST route that will create a new course + 201 HTTP status code
app.post('/api/courses', (req, res) => {

});

// setup a course PUT route that will update course + 204 HTTP status code
app.put('/api/courses/:id', (req,res) => {

});

// setup a course DELETE route that will delete course + 204 HTTP status code
app.delete('/api/courses/:id', (req,res) => {

});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
