'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Books", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2022-10-08T18:05:03.561Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "Books",
        {
            "id": {
                "type": Sequelize.INTEGER,
                "field": "id",
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            },
            "title": {
                "type": Sequelize.STRING,
                "field": "title",
                "validate": {
                    "notNull": {
                        "msg": "Title is required"
                    },
                    "notEmpty": {
                        "msg": "Title is required"
                    }
                },
                "allowNull": false
            },
            "author": {
                "type": Sequelize.STRING,
                "field": "author",
                "validate": {
                    "notNull": {
                        "msg": "Author is required"
                    },
                    "notEmpty": {
                        "msg": "Author is required"
                    }
                },
                "allowNull": false
            },
            "genre": {
                "type": Sequelize.STRING,
                "field": "genre"
            },
            "year": {
                "type": Sequelize.INTEGER,
                "field": "year"
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        },
        {}
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
