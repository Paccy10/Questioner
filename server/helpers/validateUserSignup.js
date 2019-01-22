import Joi from 'joi';

function validateUserSignup(user) {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    phone_number: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    registered: Joi.required(),
  }).unknown();

  return Joi.validate(user, schema);
}

export default validateUserSignup;
