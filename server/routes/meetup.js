import express from 'express';
import Meetup from '../controllers/meetup';

const router = express.Router();

router.post('/api/v1/meetups', Meetup.create);
router.get('/api/v1/meetups/', Meetup.getAll);
router.get('/api/v1/meetups/upcoming', Meetup.getUpcoming);
router.get('/api/v1/meetups/:id', Meetup.getOne);
router.post('/api/v1/meetups/:id/rsvps', Meetup.createRsvp);
router.delete('/api/v1/meetups/:id', Meetup.delete);


export default router;
