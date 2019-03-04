import Joi from 'joi';

function validateUserLogin(user) {
  const schema = Joi.object({
    username: Joi.string().empty().trim().required(),
    password: Joi.string().empty().trim().min(6)
      .required(),
  }).unknown();

  return Joi.validate(user, schema);
}

export default validateUserLogin;
