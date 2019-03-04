import Joi from 'joi';

function validateTag(tag) {
  const schema = Joi.object({
    meetup_id: Joi.number().integer().min(1).required(),
  }).unknown();

  return Joi.validate(tag, schema);
}

export default validateTag;
