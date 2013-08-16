var express = require('express');
var app = express();

var config = {
	"auth": {
		"username": "echo",
		"password": "0e82f70bfafc7f3fc0eeb277ec53cd96"
	},
	"parse": {
		"appId": "8VJZ3dyJnf4VlbemoO6QJwiyRpYz5HXHGA8zy8kS",
		"key": "PbZDm9jECZq52UHGRR2ea0HpCQPvdFa0rlqdShfs"
	}
};

Parse.initialize(config.parse.appId, config.parse.key);
var Instance = Parse.Object.extend("Instance");
var Stat = Parse.Object.extend("Stat");

app.use(express.bodyParser());    // Middleware for reading request body

app.post("/collect", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	if (req.body.instanceId) {
		var query = new Parse.Query(Instance);
		query.equalTo("instance_id", req.body.instanceId);
		var instance = null;
		query.first().then(function(inst) {
			var stat = new Stat();
			stat.set("ua", req.body.ua || "");
			stat.set("url", req.body.url || "");
			instance = inst;
			return stat.save();
		}).then(function(stat) {
			instance.relation("stat").add(stat);
			return instance.save();
		}).then(function() {
			return instance.relation("stat").query().find();
		}).then(function(stat) {
			var result = prepareStatistic(stat);
			res.send({"result": "success", "count": result.count});
		});
	} else {
		res.send({"result": "error", "code": "instance_not_found", "message": "Instance not found"});
	}
});

app.get("/stat/:instanceId", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	if (req.params.instanceId) {
		var query = new Parse.Query(Instance);
		query.equalTo("instance_id", req.params.instanceId);

		query.first().then(function(instance) {
			return instance.relation("stat").query().find();
		}).then(function(stat) {
			res.send({"result": "success", "data": prepareStatistic(stat)});
		});
	} else {
		res.send({"result": "error", "code": "instance_not_found", "message": "Instance not found"});
	}
});

/*
 * Web-hooks
 */
app.post("/hook/instance/add", express.basicAuth(config.auth.username, config.auth.password), function(req, res) {
	if (req.body.instance && req.body.instance.name) {
		var instance = new Instance();
		instance.set("instance_id", req.body.instance.name);
		instance.save().then(function() {
			res.send({"result": "success"});
		});
	} else {
		res.send({"result": "error", "code": "instance_name_required", "message": "The 'name' field is required"});
	}
});

app.post("/hook/instance/remove", express.basicAuth(config.auth.username, config.auth.password), function(req, res) {
	if (req.body.instance && req.body.instance.name) {
		var query = new Parse.Query(Instance);
		query.equalTo("instance_id", req.body.instance.name);
		query.first().then(function(instance) {
			instance && instance.destroy();
			res.send({"result": "success"});
		}, function() {
			res.send({"result": "success"});
		});
	} else {
		res.send({"result": "error", "code": "instance_not_found", "message": "Instance not found"});
	}
});

function prepareStatistic(statistic) {
	var result = {
		"ua": {},
		"url": {},
		"count": statistic.length
	};
	for (var i = 0; i < statistic.length; i++) {
		var ua = statistic[i].get("ua") || "Unknown";
		var url = statistic[i].get("url") || "Unknown";
		result.ua[ua] = typeof result.ua[ua] === "undefined" ? 1 : result.ua[ua] + 1;
		result.url[url] = typeof result.url[url] === "undefined" ? 1 : result.url[url] + 1;
	}
	return result;
};

app.listen();
