define(function(require, exports, module) {

	var dataservice = require('../dataservice/dataservice');

	var Ractive = require('ractive/Ractive');
	var template = require('text!./itemscreen.html');

	function ItemScreen( container ) {

		this.container = container;
		var element = document.createElement('div');
		element.className = 'pt-itemscreen';
		container.appendChild(element);


		var ractive = new Ractive({
			el: element,
			template: template,
			data: {
				"id": false,
				"images": [],
				"title": ""
			}
		});

		this.render = function( itemId ) {

			dataservice.loadList().then(function(list) {
				var item = list.getItem(itemId);
				ractive.set('id', itemId);
				ractive.set('images', item.images);
				ractive.set('title', item.title);
			});
		};


	}


	exports.create = function( container ) {
		return new ItemScreen( container );
	};
});