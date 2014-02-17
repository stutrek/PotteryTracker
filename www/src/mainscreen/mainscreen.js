define(function(require, exports, module) {

	var dataservice = require('../dataservice/dataservice');
	var Ractive = require('ractive/Ractive');
	var template = require('text!./mainscreen.html');
	var paperboy = require('paperboy/paperboy');

	function MainScreen( container ) {
		var self = this;
		this.container = container;
		this.element = document.createElement('div');
		this.element.className = 'pt-mainlist';

		container.appendChild( this.element );

		var trigger = paperboy.mixin(this);

		this.element.addEventListener('click', function( event ) {
			console.log(event.target);
			console.log(event.currentTarget);
			var itemId;
			if (itemId = event.target.getAttribute('data-item-id')) {
				trigger('itemclick', self.items.getItem(itemId) );
			}
		});
	}

	MainScreen.prototype.render = function() {
		var self = this;
		
		dataservice.loadList().then(function( itemList ) {
			self.view = new Ractive({
				el: self.element,
				template: template,
				data: itemList
			});
			self.items = itemList;
		});
	};

	exports.create = function( container ) {
		return new MainScreen( container );
	};
});