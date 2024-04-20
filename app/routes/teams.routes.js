module.exports = (app) => {
  const teams = require("../controllers/teams.controller.js");

  // Create a new team
  app.post("/teams", teams.validate("createTeam"), async (req, res) => {
    try {
      await teams.create(req, res);
    } 
    catch (err) {
      res.send(err);
      console.log(err.message);
    }
  });

  // Update a team with id
  app.put("/teams/:teamId", teams.validate("updateTeam"), async (req, res) => {
    try {
      await teams.update(req, res);
    } 
    catch (err) {
      res.send(err);
      console.log(err.message);
    }
  });

  // Retrieve all teams
  app.get("/teams", async (req, res)=>{
    try{
      await teams.list(req,res);
    }
    catch(err) {
      res.send(err);
      console.log(err.message);
    }
  });

  // Retrieve a single team with id
  app.get("/teams/:teamId", async (req, res)=>{
    try{
      await teams.read(req,res);
    }
    catch(err) {
      res.send(err);
      console.log(err.message);
    }
  });

  // Delete a team with id
  app.delete("/teams/:teamId", async (req, res)=>{
    try{
      await teams.delete(req,res);
    }
    catch(err) {
      res.send(err);
      console.log(err.message);
    }
  });
};
