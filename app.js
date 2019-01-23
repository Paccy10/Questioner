import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './server/routes/user';

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(userRoutes);

// Invalid routes
app.use(function (req, res) {
  res.json({ status: 404, error: 'Invalid URL' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

export default app;
