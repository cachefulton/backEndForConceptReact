//no controller here, just made the sql call here to simplify.
//Implemented Teams as well for later when we have a player form
//Example call:   /lookups/coaches

const sql = require("../models/db.js");

module.exports = (app) => {
  app.get("/lookups/:lookupTable", async (req, res) => {
        try {
            let query = "";
            switch (req.params.lookupTable) {
                case "coaches":
                    query = "SELECT CONCAT(first_name, ' ', last_name) as label, id as value FROM people WHERE person_type='coach'";
                    break;
                case "teams":
                    query = "SELECT name as label, id as value FROM teams";
                    break;
            }
            let result = await sql.query(query);
            res.send(result);
        } 
        catch (err) {
            res.send(err);
            console.log(err.message);
        }
    });
};
