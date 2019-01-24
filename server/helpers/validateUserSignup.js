import Joi from 'joi';

function validateUserSignup(user) {
  const schema = Joi.object({
    firstname: Joi.string().empty().trim().required(),
    lastname: Joi.string().empty().trim().required(),
    email: Joi.string().empty().trim().email({ minDomainAtoms: 2 })
      .required(),
    phone_number: Joi.string().empty().trim().required(),
    username: Joi.string().empty().trim().required(),
    password: Joi.string().min(6).empty().trim()
      .required(),
    registered: Joi.required(),
  }).unknown();

  return Joi.validate(user, schema);
}

export default validateUserSignup;
