(function(){
	angular.module('main')
	.factory('tableService', function($rootScope){
		var tabService = {
			curTab: '',
			getTab: function(){return this.curTab;},
			setTab: function(tab){
				this.curTab = tab;
				$rootScope.$broadcast('handleBroadcast');
				}
			
		};
		
		return tabService;
	});
	
})();
