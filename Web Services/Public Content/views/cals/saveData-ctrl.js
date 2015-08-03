/* This controller handles saving calibration data */

(function() {
	angular.module('main').controller('Save', ['$scope', 'SaveData', '$http','net', 
	function($scope, SaveData, $http, net) {

		$scope.save = function() {
			var xml = '<?xml version="1.0" encoding="utf-8"?>\r\n<OZONE>\r\n';
			SaveData.getData().forEach(function(entry) {
				xml += "\t<" + entry.id + ">" + entry.val + '<\\' + entry.id + '>\r\n';
			});

			xml += "<\\OZONE>";

			/* Send the calibration profile as XML data. */
			$http({
				method : 'POST',
				url : 'http://' + net.address() + '/xService/Calibration/saveCalFile?file_name=test_ang',
				data : xml,
				headers : {
					"Content-Type" : 'application/x-www-form-urlencoded'
				}
			});

		};
	}]);
})();
