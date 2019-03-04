import jwt from 'jsonwebtoken';
import auth_key from './keys';

const userAuthentication = {

  verifyToken: (req, res, next) => {
    // get auth header value
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({
        status: 401,
        message: 'Please enter a token',
      });
    }

    jwt.verify(token, auth_key, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          status: 403,
          message: 'Authentication failed. Please enter a valid token.',
        });
      }
      req.user = decoded;
      next();
    });
  },

  verifyIsAdmin: (req, res, next) => {
    if (req.user && req.user.username === 'Paccy10') {
      return next();
    }
    return res.status(403).send({
      status: 403,
      message: 'Not authorized to access this route.',
    });
  },
};

export default userAuthentication;
