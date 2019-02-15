import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './server/routes/user';
import meetupRoutes from './server/routes/meetup';
import questionRoutes from './server/routes/question';

const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(userRoutes);
app.use(meetupRoutes);
app.use(questionRoutes);

// Invalid routes
app.use(function (req, res) {
  res.status(400).json({ status: 400, error: 'Invalid URL' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

export default app;
