'use strict';

var Service, Characteristic;
var mqtt = require("mqtt");


function honyarmp1Accessory(log, config) {
  	this.log          	= log;
	this.model			= config["model"];
	this.serial			= config["serial"];
	this.manufacturer	= config["manufacturer"];
  	this.name 			= config["name"];
  	this.url 			= config["url"];
	this.client_Id 		= 'mqttjs_' + Math.random().toString(16).substr(2, 8);
	this.options = {
	    keepalive: 10,
    	clientId: this.client_Id,
	    protocolId: 'MQTT',
    	protocolVersion: 4,
    	clean: true,
    	reconnectPeriod: 1000,
    	connectTimeout: 30 * 1000,
		will: {
			topic: 'WillMsg',
			payload: 'Connection Closed abnormally..!',
			qos: 0,
			retain: false
		},
	    username: config["username"],
	    password: config["password"],
    	rejectUnauthorized: false
	};
	this.caption		= config["caption"]
	this.topicStatusGet1	= config["topics"].statusGet1;
	this.topicStatusSet1	= config["topics"].statusSet1;
	this.topicStateGet	= config["topics"].stateGet;

	this.topicStatusGet2	= config["topics"].statusGet2;
	this.topicStatusSet2	= config["topics"].statusSet2;
	
	this.topicStatusGet3	= config["topics"].statusGet3;
	this.topicStatusSet3	= config["topics"].statusSet3;
	
	this.topicStatusGet4	= config["topics"].statusGet4;
	this.topicStatusSet4	= config["topics"].statusSet4;
	
	
	this.switchStatus = false;

	this.service1 = new Service.Outlet(this.name + 's1', this.name + 's1');
  	this.service1
    	.getCharacteristic(Characteristic.On)
		.on('get', this.getStatus1.bind(this))
    	.on('set', this.setStatus1.bind(this));
		
	this.service1.addOptionalCharacteristic(Characteristic.StatusActive);
	
	this.service1
		.getCharacteristic(Characteristic.StatusActive)
		//.on('get', this.getStatusActive.bind(this));
	
    this.service1
    	.getCharacteristic(Characteristic.OutletInUse);
		
	this.service2 = new Service.Outlet(this.name + 's2', this.name + 's2');
  	this.service2
    	.getCharacteristic(Characteristic.On)
		.on('get', this.getStatus2.bind(this))
    	.on('set', this.setStatus2.bind(this));
		
	this.service2.addOptionalCharacteristic(Characteristic.StatusActive);
	
	this.service2
		.getCharacteristic(Characteristic.StatusActive)
		//.on('get', this.getStatusActive.bind(this));
	
    this.service2
    	.getCharacteristic(Characteristic.OutletInUse);
		
	this.service3 = new Service.Outlet(this.name + 's3', this.name + 's3');
  	this.service3
    	.getCharacteristic(Characteristic.On)
		.on('get', this.getStatus3.bind(this))
    	.on('set', this.setStatus3.bind(this));
		
	this.service3.addOptionalCharacteristic(Characteristic.StatusActive);
	
	this.service3
		.getCharacteristic(Characteristic.StatusActive)
		//.on('get', this.getStatusActive.bind(this));
	
    this.service3
    	.getCharacteristic(Characteristic.OutletInUse);
		
	this.service4 = new Service.Outlet(this.name + 's4', this.name + 's4');
  	this.service4
    	.getCharacteristic(Characteristic.On)
		.on('get', this.getStatus4.bind(this))
    	.on('set', this.setStatus4.bind(this));
		
	this.service4.addOptionalCharacteristic(Characteristic.StatusActive);
	
	this.service4
		.getCharacteristic(Characteristic.StatusActive)
		//.on('get', this.getStatusActive.bind(this));
	
    this.service4
    	.getCharacteristic(Characteristic.OutletInUse);
	
	// connect to MQTT broker
	this.client = mqtt.connect(this.url, this.options);
	var that = this;
	this.client.on('error', function () {
		that.log('Error event on MQTT');
	});

	this.client.on('message', function (topic, message) {
		if (topic == that.topicStateGet) {
			var status = message.toString();
		    that.activeStat = (status == "online");
			that.service1.setCharacteristic(Characteristic.StatusActive, that.activeStat);
			that.service2.setCharacteristic(Characteristic.StatusActive, that.activeStat);
			that.service3.setCharacteristic(Characteristic.StatusActive, that.activeStat);
			that.service4.setCharacteristic(Characteristic.StatusActive, that.activeStat);
	   }
		if (topic == that.topicStatusGet1) {
			var status = message.toString();
			that.switchStatus1 = (status == "ON" ? true : false);
			
		   	that.service1.getCharacteristic(Characteristic.On).setValue(that.switchStatus1, undefined, 'fromSetValue');
			that.service1.getCharacteristic(Characteristic.OutletInUse).setValue(that.switchStatus1, undefined, 'fromSetValue');
		}
		if (topic == that.topicStatusGet2) {
			var status = message.toString();
			that.switchStatus2 = (status == "ON" ? true : false);
			
		   	that.service2.getCharacteristic(Characteristic.On).setValue(that.switchStatus2, undefined, 'fromSetValue');
			that.service2.getCharacteristic(Characteristic.OutletInUse).setValue(that.switchStatus2, undefined, 'fromSetValue');
		}
		if (topic == that.topicStatusGet3) {
			var status = message.toString();
			that.switchStatus3 = (status == "ON" ? true : false);
			
		   	that.service3.getCharacteristic(Characteristic.On).setValue(that.switchStatus3, undefined, 'fromSetValue');
			that.service3.getCharacteristic(Characteristic.OutletInUse).setValue(that.switchStatus3, undefined, 'fromSetValue');
		}
		if (topic == that.topicStatusGet4) {
			var status = message.toString();
			that.switchStatus4 = (status == "ON" ? true : false);
			
		   	that.service4.getCharacteristic(Characteristic.On).setValue(that.switchStatus4, undefined, 'fromSetValue');
			that.service4.getCharacteristic(Characteristic.OutletInUse).setValue(that.switchStatus4, undefined, 'fromSetValue');
		}
		
	});
    this.client.subscribe(this.topicStatusGet1);
	this.client.subscribe(this.topicStateGet);
	this.client.subscribe(this.topicStatusGet2);
	this.client.subscribe(this.topicStatusGet3);
	this.client.subscribe(this.topicStatusGet4);

}

module.exports = function(homebridge) {
  	Service = homebridge.hap.Service;
  	Characteristic = homebridge.hap.Characteristic;

  	homebridge.registerAccessory("homebridge-mqtt-honyarmp1", "honyarmp1", honyarmp1Accessory);
}

honyarmp1Accessory.prototype = {
    identify: function (callback) {
        this.log("Identify requested!");
        callback(); 
    },
	
	getStatus1: function(callback) {
		
		
		if (this.activeStat) {
    	callback(null, this.switchStatus1);
		} else {
		callback('No Response');
	}
	},
	
	getStatus2: function(callback) {
		
		
		if (this.activeStat) {
    	callback(null, this.switchStatus2);
		} else {
		callback('No Response');
	}
	},
	
	getStatus3: function(callback) {
		
		
		if (this.activeStat) {
    	callback(null, this.switchStatus3);
		} else {
		callback('No Response');
	}
	},
	
	getStatus4: function(callback) {
		
		
		if (this.activeStat) {
    	callback(null, this.switchStatus4);
		} else {
		callback('No Response');
	}
	},

	setStatus1: function(status, callback, context) {
		if(context !== 'fromSetValue') {
			this.switchStatus = status;
		    this.client.publish(this.topicStatusSet1, status ? "ON" : "OFF");
		}
		callback();
	},

	setStatus2: function(status, callback, context) {
		if(context !== 'fromSetValue') {
			this.switchStatus = status;
		    this.client.publish(this.topicStatusSet2, status ? "ON" : "OFF");
		}
		callback();
	},
	setStatus3: function(status, callback, context) {
		if(context !== 'fromSetValue') {
			this.switchStatus = status;
		    this.client.publish(this.topicStatusSet3, status ? "ON" : "OFF");
		}
		callback();
	},
	setStatus4: function(status, callback, context) {
		if(context !== 'fromSetValue') {
			this.switchStatus = status;
		    this.client.publish(this.topicStatusSet4, status ? "ON" : "OFF");
		}
		callback();
	},

	getServices: function() {
		var informationService = new Service.AccessoryInformation();

		informationService
		.setCharacteristic(Characteristic.Name, this.name)
		.setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
		.setCharacteristic(Characteristic.Model, this.model)
		.setCharacteristic(Characteristic.SerialNumber, this.serial);
		return [informationService, this.service1, this.service2, this.service3, this.service4];
	}
};