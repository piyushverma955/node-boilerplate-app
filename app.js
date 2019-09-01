var config = require('./config/config');
var template = require('./template/template');
var fs = require('fs');
let path = require('path');
let exec = require('child_process').exec;

var projectName = process.argv[2];
var port = config.port;
var mongoUrl = config.mongoUrl;
var dbName = config.dbName;
var collectionName = config.collectionName;

createProject();

function createProject() {
    if (projectName) {
        let dir = path.join(__dirname, '/../' + projectName);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            fs.mkdirSync(dir + '/api');
            fs.mkdirSync(dir + '/helper');
            fs.mkdirSync(dir + '/api/controllers');
            fs.mkdirSync(dir + '/api/swagger');
            return writeFilePromise(dir + '/app.js', template.app(mongoUrl, port, dbName))
                .then(() => {
                    console.log('Created app.js');
                    return writeFilePromise(dir + '/package.json', template.pkgJson(projectName))
                })
                .then(() => {
                    console.log('Created package.json');
                    return writeFilePromise(dir + '/helper/schema.js', template.schema())
                })
                .then(() => {
                    console.log('Created schema.js');
                    return writeFilePromise(dir + '/api/swagger/swagger.yaml', template.swagger(projectName, port));
                })
                .then(() => {
                    console.log('Created swagger.yaml');
                    return writeFilePromise(dir + '/api/controllers/controller.js', template.controllers());
                })
                .then(() => {
                    console.log('Created controller.js');
                    return writeFilePromise(dir + '/api/controllers/app.controller.js', template.mainController(collectionName));
                })
                .then(() => {
                    console.log('Created app.controller.js');
                    console.log('Doing npm install ..');
                    return execCommand(`cd ../${projectName} && npm i`)
                })
        }
        else {
            throw new Error('Project Already exist');
        }
    }
    else {
        throw new Error('Project Name can\'t be empty');
    }
}

function writeFilePromise(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, error => {
            if (error) reject(error);
            resolve("file created successfully with handcrafted Promise!");
        });
    });
};

function execCommand(command, errMsg) {
    return new Promise((resolve, reject) => {
        exec(command, (_err, _stdout) => {
            if (_err) {
                console.log(`ERROR :: ${command}`);
                console.log(_err);
                return reject(new Error(errMsg));
            }
            console.log(`SUCCESS :: ${command}`);
            console.log(_stdout);
            return resolve(_stdout);
        });
    });
}

