var e = {};

e.app = (mongoUrl,port,dbName) => {
    return `'use strict';
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const mongoose = require('mongoose');

let mongoUrl = "${mongoUrl}";
let options = {
	dbName: "${dbName}"
};

mongoose.connect(mongoUrl, options, err => {
	if (err) {
		console.log('Cannot Connect to DB');
		console.log(err);
		process.exit(0);
	}
	console.log('Connected to DB');

});

mongoose.connection.on('connecting', () => { console.log('-------------------------connecting-------------------------'); });
mongoose.connection.on('disconnected', () => { console.log('-------------------------lost connection-------------------------'); });
mongoose.connection.on('reconnect', () => { console.log('-------------------------reconnected-------------------------'); });
mongoose.connection.on('reconnectFailed', () => { console.log('-------------------------failed to reconnect-------------------------'); });



var config = {
	appRoot: __dirname
};
module.exports = app;

SwaggerExpress.create(config, function (err, swaggerExpress) {
	if (err) {
		throw err;
	}

	swaggerExpress.register(app);

	var port = ${port};

	var server = app.listen(port, (err) => {
		if (!err) {
			console.log('Server started on port ' + port);
		} else
			console.log(err);
	});

});
`;
}

e.pkgJson = (projectName) => {
    return  `{
    "name": "${projectName}",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
    },
    "author": "Piyush Verma",
    "license": "ISC",
    "dependencies": {
        "express": "^4.17.1",
        "mongoose": "^5.6.3",
        "swagger-express-mw": "^0.7.0"
    }
}
`;
}

e.schema = () => {
    return `var definition = {
    '_id': {
        'type': 'String'
    }
};
module.exports.definition = definition;`
}

e.swagger = (projectName, port) => {
    return `swagger: '2.0'
info:
  version: 1.0.0
  title:  APIs Documentaion
host: 'localhost:${port}'
basePath: /${projectName}
schemes:
- http
consumes:
- multipart/form-data
- application/json
produces:
- application/json
- text/plain
paths:
  /:
    x-swagger-router-controller: controller
    get:
      description: Retrieve all data
      operationId: getAll
      responses:
        '200':
          description: List of the entites
        '400':
          description: Bad parameters
        '500':
          description: Internal server error`;
}

e.controllers = () => {
    return `let appController = require('./app.controller');
let e = {};
e.getAll = appController.getAll;  
module.exports = e;`
}

e.mainController = (collectionName) => {
    return `let e = {};
let definition = require('../../helper/schema').definition;
var mongoose = require('mongoose');
var schema = mongoose.Schema(definition, { collection: '${collectionName}' });
var model = mongoose.model('model', schema); 
e.getAll = (req, res) => {
  model.find({})
  .then(data => {
    res.send(data);
   })
   .catch(err => {
   res.status(400).json({ message: err.message })
  })
}
module.exports = e;`
}
module.exports = e;