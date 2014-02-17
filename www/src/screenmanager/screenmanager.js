define(function( require, exports, module ) {
	
	function HistoryItem( show, hide ) {
		this.show = show;
		this.hide = hide;
	}

	function ScreenManager() {
		var screens = {};
		var stack = [];

		this.add = function( key, element, show, hide ) {
			screens[key] = new Screen( element, show, hide );
		};
		this.show = function( key ) {

			if (!screens[key]) {
				throw new Error('Tried to show screen '+key+', which does not exist');
			}

			var last = stack[stack.length-1];
			if (last) {
				last.hide();
			}

			var args = Array.prototype.slice.call(arguments, 1);
			var currentScreen = screens[key];

			function show() {
				currentScreen.show.apply( currentScreen, args );
				currentScreen.element.style.display = "block";
			}
			function hide() {
				currentScreen.hide.apply( currentScreen, args );
				currentScreen.element.style.display = "none";
			}

			show();

			stack.push(new HistoryItem( show, hide ));
		};
		this.back = function() {
			if (stack.length > 1) {
				stack.pop().hide();
				stack[stack.length-1].show();
			} else {
				throw new Error('Tried to go back past the beginning');
			}
		};

		this.main = function() {
			if (stack.length > 1) {
				stack.pop().hide();
				stack[0].show();
				stack.length = 1;
			} else {
				throw new Error('Tried to return to main from main');
			}
		};
	}

	function Screen( element, show, hide ) {
		this.element = element;
		this.show = show || function(){};
		this.hide = hide || function(){};
	}

	exports.create = function() {
		return new ScreenManager();
	};
});