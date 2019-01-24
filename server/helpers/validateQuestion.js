import Joi from 'joi';

function validateQuestion(question) {
  const schema = Joi.object({
    user_id: Joi.number().integer().min(1).required(),
    meetup_id: Joi.number().integer().min(1).required(),
    title: Joi.string().empty().trim().required(),
    body: Joi.string().empty().trim().required(),
  }).unknown();

  return Joi.validate(question, schema);
}

export default validateQuestion;
