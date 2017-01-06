var Promise = require('bluebird');
var os = require('os');
var fs = require('fs');

var networkType = 'Ethernet';
var networkInterface = os.networkInterfaces()[networkType];
var IPVersion = 'IPv4';
var ipAddress = '';

var configFileStart = 'module.exports = ';

var config = require('./config.json');
var configFilePath = './config.js';

function getIPv4Address() {
  for (var index = 0; index < networkInterface.length; index++) {
    if (networkInterface[index].family === IPVersion) {
      ipAddress = networkInterface[index].address;
    }
  }

  return Promise.resolve(ipAddress);
}

function generateConfigFileData() {
  return configFileStart + JSON.stringify(config, null, 2);
}

function updateConfigJson(ipAddress) {
  config.proxy = ipAddress;
  var dataForFile = generateConfigFileData();
  return Promise.resolve(dataForFile);
}

function saveJsonToFile(data) {
  fs.writeFile(configFilePath, data, function(error) {
    if (error) throw error;
    console.log('Saved config to file');
  });
}

function init() {
  getIPv4Address().then(function(ipAddress) {
    console.log('Your IP Adress is ', ipAddress);
    return updateConfigJson(ipAddress);
  }).then(function(data) {
    console.log('Saving new config to file');
    return saveJsonToFile(data);
  }).catch(function() {
    console.error('There has been an error');
  });
}

init();
