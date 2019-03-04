import moment from 'moment';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import validateQuestion from '../helpers/validateQuestion';
import validateVote from '../helpers/validateVote';
import validateComment from '../helpers/validateComment';
import queries from '../db/queries';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Question {
  getAll(req, res) {
    const meetupQuery = queries.getOneMeetup;
    const meetupValues = [parseInt(req.params.meetup_id)];

    pool.connect((error, client, done) => {
      if (error) throw error;
      client.query(meetupQuery, meetupValues, (err, res1) => {
        done();
        if (err) {
          res.status(400).json({ status: 400, error: err.detail });
        }
        if (res1.rowCount == 0) {
          res.status(404).json({ status: 404, data: 'The Meetup with given ID is not found' });
        }
        const userQuery = queries.getOneUser;
        const userValues = [req.user.id];

        pool.connect((err1, client1, done1) => {
          if (err1) throw err;
          client1.query(userQuery, userValues, (error2, res2) => {
            done1();
            if (error2) {
              res.status(400).json({ status: 400, error: error2.detail });
            } else {
              if (res2.rowCount == 0) {
                res.status(404).json({ status: 404, data: 'The User with given ID is not found' });
              } else {
                const questionsQuery = queries.getAllQuestions;
                const questionsValues = [parseInt(req.params.meetup_id), parseInt(req.user.id)];
                pool.connect((error1, client2, done2) => {
                  if (error1) throw error1;
                  client2.query(questionsQuery, questionsValues, (err2, res3) => {
                    done2();
                    if (err2) {
                      res.status(400).json({ status: 400, error: err2.detail });
                    }

                    res.status(200).json({ status: 200, data: res3.rows });
                  });
                });
              }
            }
          });
        });
      });
    });
  }

  create(req, res) {
    const question = {
      created_on: moment(new Date()),
      user_id: req.body.user,
      meetup_id: req.params.meetup_id,
      title: req.body.title,
      body: req.body.body,
    };

    const { error } = validateQuestion(question);

    if (error) {
      res.status(400).json({ status: 400, error: error.details[0].message });
    } else {
      const query = queries.createQuestion;
      const values = [question.created_on, question.user_id, question.meetup_id, question.title.trim().replace(/\s+/g, ' '), question.body.trim().replace(/\s+/g, ' ')];
      pool.connect((er, client, done) => {
        if (er) throw er;
        client.query(query, values, (e, r) => {
          done();
          if (e) {
            res.status(400).json({ status: 400, error: e.detail });
          } else {
            res.status(201).json({ status: 201, data: r.rows });
          }
        });
      });
    }
  }

  upvote(req, res) {
    const upvote = {
      meetup_id: req.params.meetup_id,
      question_id: req.params.question_id,
      user_id: req.body.user,
    };

    const { error } = validateVote(upvote);

    if (error) {
      res.status(400).json({ status: 400, error: error.details[0].message });
    } else {
      const meetupQuery = queries.getOneMeetup;
      const meetupValues = [parseInt(upvote.meetup_id)];
      pool.connect((er6, client6, done6) => {
        if (er6) throw er6;
        client6.query(meetupQuery, meetupValues, (error7, res7) => {
          done6();
          if (error7) {
            res.status(404).json({ status: 404, error: error7.detail });
          } else {
            if (res7.rowCount == 0) {
              res.status(404).json({ status: 404, data: 'The Meetup with given ID is not found' });
            } else {
              const checkUpvoteQuery = queries.checkUpvote;
              const checkUpvoteValues = [upvote.user_id, parseInt(upvote.question_id)];
              const checkDownvoteQuery = queries.checkDownvote;
              const checkDownvoteValues = [upvote.user_id, parseInt(upvote.question_id)];
              pool.connect((er, client, done) => {
                if (er) throw er;
                client.query(checkUpvoteQuery, checkUpvoteValues, (error1, res1) => {
                  done();
                  if (error1) {
                    res.status(404).json({ status: 404, error: error1.detail });
                  } else {
                    if (res1.rowCount > 0) {
                      res.status(400).json({ status: 400, error: 'The User has already upvoted the question' });
                    } else {
                      pool.connect((er1, client1, done1) => {
                        if (er1) throw er1;
                        client1.query(checkDownvoteQuery, checkDownvoteValues, (error2, res2) => {
                          done1();
                          if (error2) {
                            res.status(404).json({ status: 404, error: error2.detail });
                          } else {
                            if (res2.rowCount > 0) {
                              const deleteDownvoteQuery = queries.deleteDownvote;
                              const deleteDownvoteValues = [upvote.user_id, parseInt(upvote.question_id)];
                              pool.connect((er2, client2, done2) => {
                                if (er2) throw er2;
                                client2.query(deleteDownvoteQuery, deleteDownvoteValues, (error3, res3) => {
                                  done2();
                                  if (error3) {
                                    res.status(404).json({ status: 404, error: error3.detail });
                                  } else {
                                    const saveUpvoteQuery = queries.saveUpvote;
                                    const saveUpvoteValues = [upvote.user_id, parseInt(upvote.question_id)];
                                    pool.connect((er3, client3, done3) => {
                                      if (er3) throw er3;
                                      client.query(saveUpvoteQuery, saveUpvoteValues, (error4, res4) => {
                                        done3();
                                        if (error4) {
                                          res.status(404).json({ status: 404, error: error4.detail });
                                        } else {
                                          const getQuestionQuery = queries.getQuestion;
                                          const getQuestionValues = [parseInt(upvote.question_id)];

                                          pool.connect((er4, client4, done4) => {
                                            if (er4) throw er4;
                                            client4.query(getQuestionQuery, getQuestionValues, (error5, res5) => {
                                              done4();
                                              if (error5) {
                                                res.status(404).json({ status: 404, error: error5.detail });
                                              } else {
                                                const upvoteQuestionQuery = queries.upvoteQuestion;
                                                const upvoteQuestionValues = [res5.rows[0].upvotes + 1, res5.rows[0].downvotes - 1, res5.rows[0].id];
                                                pool.connect((er5, client5, done5) => {
                                                  if (er5) throw er5;
                                                  client5.query(upvoteQuestionQuery, upvoteQuestionValues, (error6, res6) => {
                                                    done5();
                                                    if (error6) {
                                                      res.status(404).json({ status: 404, error: error6.detail });
                                                    } else {
                                                      res.status(200).json({ status: 200, data: res6.rows });
                                                    }
                                                  });
                                                });
                                              }
                                            });
                                          });
                                        }
                                      });
                                    });
                                  }
                                });
                              });
                            } else {
                              const saveUpvoteQuery = queries.saveUpvote;
                              const saveUpvoteValues = [upvote.user_id, parseInt(upvote.question_id)];
                              pool.connect((er3, client3, done3) => {
                                if (er3) throw er3;
                                client.query(saveUpvoteQuery, saveUpvoteValues, (error4, res4) => {
                                  done3();
                                  if (error4) {
                                    res.status(404).json({ status: 404, error: error4.detail });
                                  } else {
                                    const getQuestionQuery = queries.getQuestion;
                                    const getQuestionValues = [parseInt(upvote.question_id)];

                                    pool.connect((er4, client4, done4) => {
                                      if (er4) throw er4;
                                      client4.query(getQuestionQuery, getQuestionValues, (error5, res5) => {
                                        done4();
                                        if (error5) {
                                          res.status(404).json({ status: 404, error: error5.detail });
                                        } else {
                                          const upvoteQuestionQuery = queries.upvoteQuestion;
                                          const upvoteQuestionValues = [res5.rows[0].upvotes + 1, res5.rows[0].downvotes, res5.rows[0].id];
                                          pool.connect((er5, client5, done5) => {
                                            if (er5) throw er5;
                                            client5.query(upvoteQuestionQuery, upvoteQuestionValues, (error6, res6) => {
                                              done5();
                                              if (error6) {
                                                res.status(404).json({ status: 404, error: error6.detail });
                                              } else {
                                                res.status(200).json({ status: 200, data: res6.rows });
                                              }
                                            });
                                          });
                                        }
                                      });
                                    });
                                  }
                                });
                              });
                            }
                          }
                        });
                      });
                    }
                  }
                });
              });
            }
          }
        });
      });
    }
  }

  downvote(req, res) {
    const downvote = {
      meetup_id: req.params.meetup_id,
      question_id: req.params.question_id,
      user_id: req.body.user,
    };

    const { error } = validateVote(downvote);

    if (error) {
      res.status(400).json({ status: 400, error: error.details[0].message });
    } else {
      const meetupQuery = queries.getOneMeetup;
      const meetupValues = [parseInt(downvote.meetup_id)];
      pool.connect((er6, client6, done6) => {
        if (er6) throw er6;
        client6.query(meetupQuery, meetupValues, (error7, res7) => {
          done6();
          if (error7) {
            res.status(404).json({ status: 404, error: error7.detail });
          } else {
            if (res7.rowCount == 0) {
              res.status(404).json({ status: 404, data: 'The Meetup with given ID is not found' });
            } else {
              const checkUpvoteQuery = queries.checkUpvote;
              const checkUpvoteValues = [downvote.user_id, parseInt(downvote.question_id)];
              const checkDownvoteQuery = queries.checkDownvote;
              const checkDownvoteValues = [downvote.user_id, parseInt(downvote.question_id)];
              pool.connect((er, client, done) => {
                if (er) throw er;
                client.query(checkDownvoteQuery, checkDownvoteValues, (error1, res1) => {
                  done();
                  if (error1) {
                    res.status(404).json({ status: 404, error: error1.detail });
                  } else {
                    if (res1.rowCount > 0) {
                      res.status(400).json({ status: 400, error: 'The User has already upvoted the question' });
                    } else {
                      pool.connect((er1, client1, done1) => {
                        if (er1) throw er1;
                        client1.query(checkUpvoteQuery, checkUpvoteValues, (error2, res2) => {
                          done1();
                          if (error2) {
                            res.status(404).json({ status: 404, error: error2.detail });
                          } else {
                            if (res2.rowCount > 0) {
                              const deleteUpvoteQuery = queries.deleteUpvote;
                              const deleteUpvoteValues = [downvote.user_id, parseInt(downvote.question_id)];
                              pool.connect((er2, client2, done2) => {
                                if (er2) throw er2;
                                client2.query(deleteUpvoteQuery, deleteUpvoteValues, (error3, res3) => {
                                  done2();
                                  if (error3) {
                                    res.status(404).json({ status: 404, error: error3.detail });
                                  } else {
                                    const saveDownVoteQuery = queries.saveDownvote;
                                    const saveDownVoteValues = [downvote.user_id, parseInt(downvote.question_id)];
                                    pool.connect((er3, client3, done3) => {
                                      if (er3) throw er3;
                                      client.query(saveDownVoteQuery, saveDownVoteValues, (error4, res4) => {
                                        done3();
                                        if (error4) {
                                          res.status(404).json({ status: 404, error: error4.detail });
                                        } else {
                                          const getQuestionQuery = queries.getQuestion;
                                          const getQuestionValues = [parseInt(downvote.question_id)];

                                          pool.connect((er4, client4, done4) => {
                                            if (er4) throw er4;
                                            client4.query(getQuestionQuery, getQuestionValues, (error5, res5) => {
                                              done4();
                                              if (error5) {
                                                res.status(404).json({ status: 404, error: error5.detail });
                                              } else {
                                                const downvoteQuestionQuery = queries.downvoteQuestion;
                                                const downvoteQuestionValues = [res5.rows[0].downvotes + 1, res5.rows[0].upvotes - 1, res5.rows[0].id];
                                                pool.connect((er5, client5, done5) => {
                                                  if (er5) throw er5;
                                                  client5.query(downvoteQuestionQuery, downvoteQuestionValues, (error6, res6) => {
                                                    done5();
                                                    if (error6) {
                                                      res.status(404).json({ status: 404, error: error6.detail });
                                                    } else {
                                                      res.status(200).json({ status: 200, data: res6.rows });
                                                    }
                                                  });
                                                });
                                              }
                                            });
                                          });
                                        }
                                      });
                                    });
                                  }
                                });
                              });
                            } else {
                              const saveDownVoteQuery = queries.saveDownvote;
                              const saveDownVoteValues = [downvote.user_id, parseInt(downvote.question_id)];
                              pool.connect((er3, client3, done3) => {
                                if (er3) throw er3;
                                client.query(saveDownVoteQuery, saveDownVoteValues, (error4, res4) => {
                                  done3();
                                  if (error4) {
                                    res.status(404).json({ status: 404, error: error4.detail });
                                  } else {
                                    const getQuestionQuery = queries.getQuestion;
                                    const getQuestionValues = [parseInt(downvote.question_id)];

                                    pool.connect((er4, client4, done4) => {
                                      if (er4) throw er4;
                                      client4.query(getQuestionQuery, getQuestionValues, (error5, res5) => {
                                        done4();
                                        if (error5) {
                                          res.status(404).json({ status: 404, error: error5.detail });
                                        } else {
                                          const downvoteQuestionQuery = queries.downvoteQuestion;
                                          const downvoteQuestionValues = [res5.rows[0].downvotes + 1, res5.rows[0].upvotes, res5.rows[0].id];
                                          pool.connect((er5, client5, done5) => {
                                            if (er5) throw er5;
                                            client5.query(downvoteQuestionQuery, downvoteQuestionValues, (error6, res6) => {
                                              done5();
                                              if (error6) {
                                                res.status(404).json({ status: 404, error: error6.detail });
                                              } else {
                                                res.status(200).json({ status: 200, data: res6.rows });
                                              }
                                            });
                                          });
                                        }
                                      });
                                    });
                                  }
                                });
                              });
                            }
                          }
                        });
                      });
                    }
                  }
                });
              });
            }
          }
        });
      });
    }
  }

  comment(req, res) {
    const comment = {
      meetup_id: req.params.meetup_id,
      question_id: req.params.question_id,
      user_id: req.body.user,
      comment: req.body.comment,
    };

    const { error } = validateComment(comment);

    if (error) {
      res.status(400).json({ status: 400, error: error.details[0].message });
    } else {
      const meetupQuery = queries.getOneMeetup;
      const meetupValues = [parseInt(comment.meetup_id)];
      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(meetupQuery, meetupValues, (error1, res1) => {
          done();
          if (error1) {
            res.status(400).json({ status: 400, error: error1.detail });
          } else {
            if (res1.rowCount == 0) {
              res.status(404).json({ status: 404, data: 'The Meetup with given ID is not found' });
            } else {
              const userQuery = queries.getOneUser;
              const userValues = [comment.user_id];

              pool.connect((err1, client1, done1) => {
                if (err1) throw err;
                client1.query(userQuery, userValues, (error2, res2) => {
                  done1();
                  if (error2) {
                    res.status(400).json({ status: 400, error: error2.detail });
                  } else {
                    if (res2.rowCount == 0) {
                      res.status(404).json({ status: 404, data: 'The User with given ID is not found' });
                    } else {
                      const commentQuery = queries.createComment;
                      const commentValues = [comment.question_id, comment.comment.trim().replace(/\s+/g, ' ')];

                      pool.connect((err2, client2, done2) => {
                        if (err2) throw err;
                        client2.query(commentQuery, commentValues, (error3, res3) => {
                          done2();
                          if (error3) {
                            res.status(400).json({ status: 400, error: error3.detail });
                          } else {
                            res.status(201).json({ status: 201, data: res3.rows });
                          }
                        });
                      });
                    }
                  }
                });
              });
            }
          }
        });
      });
    }
  }
}

const question = new Question();

export default question;
