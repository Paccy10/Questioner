const signup = 'INSERT INTO users(firstname, lastname, othername, email, phone_number, username,password, registered) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
const login = 'SELECT * FROM users WHERE username = $1';
const createMeetup = 'INSERT INTO meetups(created_on, location, images, topic, happening_on, tags) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
const getOneMeetup = 'SELECT * FROM meetups WHERE id = $1';
const getAllMeetups = 'SELECT * FROM meetups';
const getUpcomingMeetups = 'SELECT * FROM meetups WHERE happening_on >= $1';
const createRsvp = 'INSERT INTO rsvps(meetup_id, user_id, response) VALUES($1, $2, $3) RETURNING *';
const deleteMeetup = 'DELETE FROM meetups WHERE id = $1';

export default {
  signup,
  login,
  createMeetup,
  getOneMeetup,
  getAllMeetups,
  getUpcomingMeetups,
  createRsvp,
  deleteMeetup,
};
