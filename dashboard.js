(function(jQuery) {

var $ = jQuery;

if (Echo.Control.isDefined("VisitorsStatistics.Dashboard")) return;

var dashboard = Echo.AppServer.Dashboard.manifest("VisitorsStatistics.Dashboard");

dashboard.inherits = Echo.Utils.getComponent("Echo.Apps.AppServer.Dashboard");

dashboard.labels = {
	"collectUA": "Collect User-Agent statistic",
	"collectURL": "Collect URL statistic",
	"displayStat": "Display statistic in client-facing widget",
	"totalVisitors": "Total visitors",
	"statisticsByURL": "Statistics by URL",
	"statisticsByUA": "Statistics by User-Agent",
	"url": "URL",
	"ua": "User-Agent",
	"visitorsCount": "Visitors"
};

dashboard.config = {
	"serverAddress": "http://statistic.parseapp.com"
};

dashboard.templates.main =
	'<div class="{class:container}">' +
		'<div class="{class:config}"></div>' +
		'<div class="{class:statistics}"><div>' +
	'</div>';

dashboard.templates.checkbox =
	'<label for="{data:name}-checkbox" class="{class:checkbox}">' +
		'<input id="{data:name}-checkbox" type="checkbox">' +
		'{data:label}' +
	'</label>';

dashboard.templates.statistics =
	'<table class="table table-hover">' +
		'<caption>{data:caption}</caption>' +
		'<thead><tr><td><b>{data:col}</b></td><td class="{class:visitorsLabel}"><b>{label:visitors}</b></td></tr><thead>' +
		'<tbody></tbody>' +
	'</table>';

dashboard.init = function() {
	var self = this;

	var defaultConfig = {
		"instanceId": this.config.get("instance.name"),
		"collectUA": true,
		"collectURL": true,
		"displayStat": true
	};
	this.set("data", $.extend(true, defaultConfig, this.config.get("instance.config")));
	if (!this.config.get("instance.config.instanceId")) {
		this.update();
	}
	this.retrieveStatistics(function() {
		self.render();
		self.ready();
	});
};

/*
 * Renderers
 */
dashboard.renderers.config = function(element) {
	var self = this;

	element.empty();
	["collectUA", "collectURL", "displayStat"].map(function(name) {
		var container = $(self.substitute({
			"template": dashboard.templates.checkbox,
			"data": {
				"name": name,
				"label": self.labels.get(name)
			}
		}));
		container.find("input")
			.attr("checked", self.get("data." + name))
			.on("click", function() {
				self.set("data." + name, $(this).is(":checked"));
				self.update();
			});

		element.append(container);
	});
	return element;
};

dashboard.renderers.statistics = function(element) {
	var self = this;
	element.empty();
	["url", "ua"].map(function(stat) {
		var table = $(self.substitute({
			"template": dashboard.templates.statistics,
			"data": {
				"caption": self.labels.get("statisticsBy" + stat.toUpperCase()),
				"col": self.labels.get(stat)
			}
		}));
		$.map(self.sortStatistics(self.get("statistics." + stat)), function(data) {
			var row = $("<tr>");
			$("<td>").append(data.title).appendTo(row);
			$("<td>").append(data.count).appendTo(row);
			table.find("tbody").append(row);
		});
		element.append(table);
	});
	return element;
};

/*
 * Methods
 */
dashboard.methods.getValue = function() {
	return this.get("data");
};

dashboard.methods.retrieveStatistics = function(callback) {
	var self = this;
	$.get(this.config.get("serverAddress") + "/stat/" + this.get("data.instanceId"), {}, function(response) {
		self.set("statistics", response.data);
		callback && callback();
	});
};

dashboard.methods.sortStatistics = function(data) {
	var rs = [];
	$.map(data, function(v, k) {
		rs.push({
			"title": k,
			"count": v
		});
	});
	return rs.sort(function(a, b) {
		return b.count - a.count;
	});
};

dashboard.css =
	'.echo-sdk-ui .{class:checkbox} > input[type="checkbox"] { margin: 0px 5px 0px 0px; }' +
	'.{class:statistics} { margin: 10px 0px 0px 0px; }' +
	'.{class:visitorsLabel} { width: 100px; }';

Echo.AppServer.Dashboard.create(dashboard);

})(Echo.jQuery);
