const { body, validationResult } = require("express-validator");
const Team = require('../models/teams.model.js');
const util = require('./controller.util.js');

// get all teams
exports.list = async (req, res) => {
  let params = util.getQueryParams(req);
  try {
    res.send(await Team.list(params));
  }
  catch(ex) {
    throw(ex);
  }
};

// get a single team with teamId
exports.read = async (req, res) => {
  try {
    let result = await Team.read(req.params.teamId);
    res.send(result);
  }
  catch(err) {
    if(err) {
      if(err.message === "not_found") {
        res.status(404).send({
          message: `Team not found with id ${req.params.teamId}.`
        });
      }
      else {
        res.status(500).send({
          message: `Error retrieving team with id ${req.params.teamId}.`
        });
      }
    }
  }
};

// update a single team with teamId
exports.update = async (req, res) => {
  if (!util.processValidation(req, res, validationResult)) {
    return;
  }
  try {
    res.send(await Team.update(req.params.teamId, new Team(req.body)));
  }
  catch(err) {
    if(err) {
      if(err.message === "not_found") {
        res.status(404).send({
          message: `Team not found with id ${req.params.teamId}.`
        });
      }
      else {
        res.status(500).send({
          message: `Error retrieving team with id ${req.params.teamId}.`
        });
      }
    }
  }
};

// create a team
exports.create = async (req, res) => {
  if (!util.processValidation(req, res, validationResult)){
    return;
  }
  const team = new Team({
    name: req.body.name,
    coach_id: req.body.coach_id,
    league_id: 1,
    notes: req.body.notes || ""
  });
  try {
    let result = await Team.create(team);
    res.status(201).send(result);
  }
  catch(err) {
    throw(err);
  }
};

// delete a team with based on teamId
exports.delete = async (req, res) => {
  try {
    await Team.delete(req.params.teamId);
    res.status(200).send(); //success code with no body
  }
  catch(err) {
    if(err) {
      if(err.message === "not_found") {
        res.status(404).send({
          message: `Team not found with id ${req.params.teamId}.`
        });
      }
      else {
        res.status(500).send({
          message: `Error deleting team with id ${req.params.teamId}.`
        });
      }
    }
  }
};

exports.validate = (method) => {
  let rules = [
    body("name", "name cannot be empty").not().isEmpty().trim().escape(),
    body("coach_id", "coach id cannot be empty").not().isEmpty(),
    body("league_id", "league id cannot be empty").not().isEmpty(),
    body("notes").trim().escape()
  ];
  switch (method) {
    case "updateTeam":
      return rules;
    case "createTeam": {
      let createRules = [...rules];
      createRules.push(
        body("name").custom(async (value) => {
          return await Team.checkDuplicateName(value); //custom validation to check if team exists
        }));
      return createRules;
    }
  }
};
