var model = module.exports;
var r = require('rethinkdb');
var config = require('../config');
//definir la table
var Banque_TABLE = 'Account';

model.setup = function (callback) {
    console.log("Config RethinkDB...");
    
    r.connect(config.database).then(function(conn) {
        // Does the database exist?

        r.dbCreate(config.database.db).run(conn).then(function(result) {
            console.log("Base de donnees cree...");
        }).error(function(error) {
            console.log("Base de données deja cree...");
        }).finally(function() {
            // Does the table exist?
            r.table(Banque_TABLE).limit(1).run(conn, function(error, cursor) {
                var promise;
                if (error) {
                    console.log("Creation de la table...");
                    promise = r.tableCreate(Banque_TABLE).run(conn);
                } else {    
                    promise = cursor.toArray();
                }

                // The table exists, setup the update listener
                promise.then(function(result) {
                    console.log("En cours de traitement...");
                    r.table(Banque_TABLE).changes().run(conn).then(function(cursor) {
                        cursor.each(function(error, row) {
                            callback(row);
                        });
                    });
                }).error(function(error) {
                    throw error;
                });
            });
        });
    }).error(function(error) {
        throw error;
    });
}

model.getAccount = function (callback) {
    var firstTimestamp = new Date().getTime();
    r.connect(config.database).then(function(conn) {
        r.table(Banque_TABLE).run(conn).then(function(cursor) {
            cursor.toArray(function(error, results) {
                if (error) throw error;
                callback(results);
            });
        }).error(function(error) {
            throw error;
        });
    }).error(function(error) {
        throw error;
    });
    //LOG TEMP
    console.log("Read transaction effectué");
    var secondTimestamp = new Date().getTime(), // On récupère le timestamp après l'exécution
    result = secondTimestamp - firstTimestamp;
    console.log("Le temps d'exécution est de : " + result + " millisecondes.");
}

model.saveSolde = function (movie, callback) {
    var firstTimestamp = new Date().getTime();
    r.connect(config.database).then(function(conn) {
        r.table(Banque_TABLE).insert(movie).run(conn).then(function(results) {
            callback(true, results);
        }).error(function(error) {
            callback(false, error);
        });
    }).error(function(error) {
        callback(false, error);
    });
    //LOG TEMP
    console.log("Write transaction effectué");
    var secondTimestamp = new Date().getTime(), // On récupère le timestamp après l'exécution
    result = secondTimestamp - firstTimestamp;
    console.log("Le temps d'exécution est de : " + result + " millisecondes.");
}

model.updateSolde = function (movie, field, callback) {
    var firstTimestamp = new Date().getTime();
    //DEBUT
    r.connect(config.database).then(function(conn) {
        r.table(Banque_TABLE).get(movie.id).update(function(movie) {
            return r.object(field, movie(field).add(100)); 
        }).run(conn).then(function(results) {
           callback(true, results);
        }).error(function(error) {
            callback(false, error);
        });
    }).error(function(error) {
        callback(false, error);
    });
    //LOG TEMP
    console.log("UPDATE/Write transaciton effectué");
    var secondTimestamp = new Date().getTime(), // On récupère le timestamp après l'exécution
    result = secondTimestamp - firstTimestamp;
    console.log("Le temps d'exécution est de : " + result + " millisecondes.");
}

model.transactiontest = function (movie, field, callback) {
    //Mise  en place transaction scheduling
    
    model.updateSolde();
    model.saveSolde();
    model.updateSolde();

}

