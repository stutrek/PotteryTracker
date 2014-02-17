define(function(require, exports, module) {

	var Ractive = require('ractive/Ractive');
	var template = require('text!./errorscreen.html');

	function ErrorScreen( container ) {

		this.container = container;

		var ractive = new Ractive({
			el: container,
			template: template,
			data: {
				"message": "",

			}
		});

		this.render = function( error ) {
			ractive.set('message', error.message);
		};


	}


	exports.create = function( container ) {
		return new ErrorScreen( container );
	};
});