var model = require('../models/banque');

var vote = function (req, res, action) {
    var account = {
        id:req.params.id
    };
    model.updateAccount(account, action, function (success, result) {
        if (success) res.json({
            status: 'OK'
        });
        else res.json({
            status: 'Error'
        });
    });
}

module.exports = function (app) {
    app.get('/', function (req, res) {
        model.getMovies(function (result) {
            res.render('index', {
                movies: result
            });
        });
    });

    app.post('/account', function (req, res) {
        var account = {
            title:req.body.title,
            likes:0,
            unlikes:0
        };
        model.saveMovie(account, function (success, result) {
            if (success) res.json({
                status: 'OK'
            });
            else res.json({
                status: 'Error'
            });
        });
    });

    app.put('/account/like/:id', function (req, res) {
       vote(req, res, 'likes');
    });

    app.put('/account/unlike/:id', function (req, res) {
        vote(req, res, 'unlikes');
    });
};
