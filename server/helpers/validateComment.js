import Joi from 'joi';

function validateComment(question) {
  const schema = Joi.object({
    meetup_id: Joi.number().integer().min(1).required(),
    question_id: Joi.number().integer().min(1).required(),
    user_id: Joi.number().integer().min(1).required(),
    comment: Joi.string().empty().trim().required(),
  }).unknown();

  return Joi.validate(question, schema);
}

export default validateComment;
