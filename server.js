const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Cache's API." });
});

require("./app/routes/teams.routes.js")(app);
require("./app/routes/lookup.routes.js")(app);

app.listen(8080, ()=>{
    console.log('Server is running on port 8080');
});