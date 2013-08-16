(function($){

VisitorsStatistics = function(config) {
	var self = this;
	var serverAddress = "http://statistic.parseapp.com";

	var data = {
		"instanceId": config.instanceId,
		"ua": (config.collectUA && navigator.userAgent) || "",
		"url": (config.collectURL && document.URL) || ""
	};
	$.post(serverAddress + "/collect", data, function(response) {
		if (response["result"] === "success") {
			if (config.displayStat) {
				$("<div>")
					.css("background", "url(http://echosandbox.com/apps/glyphicons_051_eye_open.png) no-repeat")
					.css("width", "31px")
					.css("height", "17px")
					.css("padding-left", "33px")
					.html(response.count)
					.appendTo(config.target);
			}
		}
	});
};

// TODO get rid of this code when F:1555 will be released
VisitorsStatistics.prototype.destroy = function() {};

// TODO get rid of Echo.jQuery
})($ || Echo.jQuery);
