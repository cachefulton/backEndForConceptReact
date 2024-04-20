exports.processValidation = (req, res, validationResult) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return false;
    }
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty."
        });
        return false;
    }
    return true;
};

exports.getQueryParams = (req) => {
    let params = {
        sortCol: null,
        sortDir: null,
        limit: null,
        offset: 0,
        filerCol: null,
        filterStr: null,
        is_lookup: null
    };
    if("sortCol" in req.query) {
        params["sortCol"] = req.query.sortCol;
    }
    if("sortDir" in req.query) {
        params["sortDir"] = req.query.sortDir;
    }
    if("limit" in req.query) {
        params["limit"] = req.query.limit;
    }
    if("offset" in req.query) {
        params["offset"] = req.query.offset;
    }
    if("filterCol" in req.query) {
        params["filterCol"] = req.query.filterCol;
    }
    if("filterStr" in req.query) {
        params["filterStr"] = req.query.filterStr;
    }
    
    return params;
}