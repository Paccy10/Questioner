const signup = 'INSERT INTO users(firstname, lastname, othername, email, phone_number, username,password, registered) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
const login = 'SELECT * FROM users WHERE username = $1';
const getOneUser = 'SELECT * FROM users WHERE id = $1';

const createMeetup = 'INSERT INTO meetups(created_on, location, images, topic, happening_on, tags) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
const getOneMeetup = 'SELECT * FROM meetups WHERE id = $1';
const getAllMeetups = 'SELECT * FROM meetups';
const getUpcomingMeetups = 'SELECT * FROM meetups WHERE happening_on >= $1';
const createRsvp = 'INSERT INTO rsvps(meetup_id, user_id, response) VALUES($1, $2, $3) RETURNING *';
const deleteMeetup = 'DELETE FROM meetups WHERE id = $1';
const addTagToMeetup = 'UPDATE meetups SET tags = $1 WHERE id = $2';
const addImageToMeetup = 'UPDATE meetups SET images = $1 WHERE id = $2';

const createQuestion = 'INSERT INTO questions(created_on, user_id, meetup_id, title, body) VALUES($1, $2, $3, $4, $5) RETURNING *';
const getAllQuestions = 'SELECT * FROM questions WHERE meetup_id = $1 AND user_id = $2';
const checkUpvote = 'SELECT * FROM upvotes WHERE user_id = $1 AND question_id = $2';
const checkDownvote = 'SELECT * FROM downvotes WHERE user_id = $1 AND question_id = $2';
const upvoteQuestion = 'UPDATE questions SET upvotes = $1, downvotes = $2 WHERE id = $3 RETURNING *';
const downvoteQuestion = 'UPDATE questions SET downvotes = $1, upvotes = $2  WHERE id = $3 RETURNING *';
const getQuestion = 'SELECT * FROM questions WHERE id = $1';
const deleteUpvote = 'DELETE FROM upvotes WHERE user_id = $1 AND question_id = $2';
const deleteDownvote = 'DELETE FROM downvotes WHERE user_id = $1 AND question_id = $2';
const saveUpvote = 'INSERT INTO upvotes(user_id, question_id) VALUES($1, $2)';
const saveDownvote = 'INSERT INTO downvotes(user_id, question_id) VALUES($1, $2)';
const createComment = 'INSERT INTO comments(question_id, comment) VALUES($1, $2) RETURNING *';

export default {
  signup,
  login,
  getOneUser,

  createMeetup,
  getOneMeetup,
  getAllMeetups,
  getUpcomingMeetups,
  createRsvp,
  deleteMeetup,
  addTagToMeetup,
  addImageToMeetup,

  createQuestion,
  getAllQuestions,
  checkUpvote,
  checkDownvote,
  upvoteQuestion,
  downvoteQuestion,
  getQuestion,
  deleteUpvote,
  deleteDownvote,
  saveUpvote,
  saveDownvote,
  createComment,
};
