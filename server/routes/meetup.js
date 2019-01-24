import express from 'express';
import Meetup from '../controllers/meetup';
import userAuthentication from '../middlewares/authentication';

const router = express.Router();

router.post('/api/v1/meetups', userAuthentication.verifyToken, userAuthentication.verifyIsAdmin, Meetup.create);
router.get('/api/v1/meetups/', userAuthentication.verifyToken, Meetup.getAll);
router.get('/api/v1/meetups/upcoming', userAuthentication.verifyToken, Meetup.getUpcoming);
router.get('/api/v1/meetups/:id', userAuthentication.verifyToken, Meetup.getOne);
router.post('/api/v1/meetups/:id/rsvps', userAuthentication.verifyToken, Meetup.createRsvp);
router.delete('/api/v1/meetups/:id', userAuthentication.verifyToken, userAuthentication.verifyIsAdmin, Meetup.delete);


export default router;
