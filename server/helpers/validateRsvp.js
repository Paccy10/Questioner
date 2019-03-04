import Joi from 'joi';

function validateRsvp(rsvp) {
  const schema = Joi.object({
    meetup_id: Joi.number().integer().min(1).required(),
    user_id: Joi.number().integer().min(1).required(),
    response: Joi.string().empty().trim().required(),
  }).unknown();

  return Joi.validate(rsvp, schema);
}

export default validateRsvp;
