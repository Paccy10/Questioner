import express from 'express';
import Question from '../controllers/question';
import userAuthentication from '../middlewares/authentication';

const router = express.Router();

router.post('/api/v1/meetups/:meetup_id/questions', userAuthentication.verifyToken, Question.create);
router.patch('/api/v1/meetups/:meetup_id/questions/:question_id/upvote', userAuthentication.verifyToken, Question.upvote);
router.patch('/api/v1/meetups/:meetup_id/questions/:question_id/downvote', userAuthentication.verifyToken, Question.downvote);
router.post('/api/v1/meetups/:meetup_id/questions/:question_id/comments', userAuthentication.verifyToken, Question.comment);


export default router;
