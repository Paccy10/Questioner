import Joi from 'joi';

function validateRsvp(rsvp) {
  const schema = Joi.object({
    meetup: Joi.number().integer().min(1),
    user: Joi.number().integer().min(1),
    response: Joi.string().required(),
  }).unknown();

  return Joi.validate(rsvp, schema);
}

export default validateRsvp;
