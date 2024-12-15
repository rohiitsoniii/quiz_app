const express = require('express');
const router = express.Router();
const userRoute = require('./user.routes');
const quizRoute = require('./quiz.routes');
const SubmissionRoute = require('./submission.routes');

router.use('/user', userRoute);
router.use('/quiz', quizRoute);
router.use('/submission', SubmissionRoute);


module.exports = router;
