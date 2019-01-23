import Joi from 'joi';

function validateMeetup(meetup) {
  const schema = Joi.object({
    location: Joi.string().required(),
    topic: Joi.string().required(),
    happening_on: Joi.required(),
  }).unknown();

  return Joi.validate(meetup, schema);
}

export default validateMeetup;
