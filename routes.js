'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// setup a friendly greeting for the root route
router.get('/',   (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

// USERS ROUTES
// setup a user GET route
router.get('/api/users', authenticateUser, asyncHandler( async (req,res) => {
    const user = req.currentUser;

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });

  //  res.status(200).json({ "message": "Currently authenticated user returned!" });
}));

// setup a user POST route
router.post('/api/users', (req,res) => {

});

// COURSES ROUTES
// setup a course GET route that returns all courses including the User that owns each course and a 200 HTTP status code
router.get('/api/courses', (req, res) => {

});

// setup a course GET route that returns coresponding course with a 200 HTTP status code
router.post('/api/courses/:id', (req,res) => {

});

// setup a course POST route that will create a new course + 201 HTTP status code
router.post('/api/courses', (req, res) => {

});

// setup a course PUT route that will update course + 204 HTTP status code
router.put('/api/courses/:id', (req,res) => {

});

// setup a course DELETE route that will delete course + 204 HTTP status code
router.delete('/api/courses/:id', (req,res) => {

});

// send 404 if no other route matched
router.use((req, res) => {
    res.status(404).json({
        message: 'Route Not Found',
    });
});

module.exports = router;