(function($){

VisitorsStatistics = function(config) {
	var self = this;
	var serverAddress = "http://statistic.parseapp.com";

	$.post(serverAddress + "/collect", {"instanceId": config.instanceId, "ua": navigator.userAgent, "url": document.URL}, function(response) {
		if (response["result"] === "success") {
			config.target.append(response.count);
		}
		console.log( "Response: ", response );
	});
};

// TODO get rid of this code when F:1555 will be released
VisitorsStatistics.prototype.destroy = function() {};

// TODO get rid of Echo.jQuery
})($ || Echo.jQuery);
