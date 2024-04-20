const sql = require('./db.js');

const Team = function(team) {
    this.name = team.name;
    this.coach_id = team.coach_id;
    this.league_id = team.league_id;
    this.notes = team.notes;
};

Team.create = async (team) => {
    try{
        let result = await sql.query('INSERT INTO teams SET name = ?, coach_id = ?, league_id = ?, notes = ?',
        [team.name, team.coach_id, team.league_id, team.notes]);

        return { id: result.insertId, ...team };
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
};

Team.update = async (id, team) => {
    try{
        let result = await sql.query('UPDATE teams SET name = ?, coach_id = ?, league_id = ?, notes = ? WHERE id = ?',
        [team.name, team.coach_id, team.league_id, team.notes, id]);
        if(result.affectedRows == 0) { //didn't find team
            throw new Error("not_found");
        }
        console.log('updated team: ', { id: id, ...team });
        return { id: id, ...team };
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
};

Team.list = async (params) => {
    try {
        let result = await sql.query(Team.getListSql(params));
        return result;
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
}

Team.getListSql = (params) => {
    let query = `SELECT id, name, coachName, coachEmail, coachPhone, notes
    FROM (SELECT t.id, t.name, CONCAT(p.first_name, ' ', p.last_name) as coachName, p.email as coachEmail, p.phone as coachPhone, t.notes
    FROM teams t JOIN people p ON t.coach_id = p.id) as x`;

    if(params.filterCol != null) {
        query += ` WHERE x.${params.filterCol} like '%${params.filterStr}%'`;
    }
    if(params.sortCol != null) {
        query += ` ORDER BY x.${params.sortCol} ${params.sortDir=='dsc' ? 'DESC' : 'ASC'}`;
    }
    if(params.limit != null) {
        query += ` LIMIT ${params.offset}, ${params.limit}`;
    }
    // console.log(query);
    return query;
}

Team.read = async (teamId) => {
    try{
        let result = await sql.query('SELECT * FROM teams WHERE id = ?', [teamId]);
        if(result.length == 0) { //didn't find team
            throw new Error("not_found");
        }
        return result[0];
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
};

Team.delete = async (teamId) => {
    try{
        let result = await sql.query('DELETE FROM teams WHERE id = ?', [teamId]);
        if(result.affectedRows == 0) { //didn't find team
            throw new Error("not_found");
        }
        return; //don't need a response
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
};

Team.checkDuplicateName = async (name) => {
    try {
        let result = await sql.query('SELECT * FROM teams WHERE name = ?', [name]);
        if(result.length) {
            return Promise.reject("duplicate team name");
        }
        else {
            return Promise.resolve("we're good")
        }
    }
    catch(err) {
        console.log(err);
        throw(err);
    }
}

module.exports = Team;