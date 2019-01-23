import Joi from 'joi';

function validateUserLogin(user) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }).unknown();

  return Joi.validate(user, schema);
}

export default validateUserLogin;
