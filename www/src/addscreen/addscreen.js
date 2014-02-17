define(function( require, exports, module ) {
	
	var dataservice = require('../dataservice/dataservice');
	var Ractive = require('ractive/Ractive');
	var template = require('text!./addscreen.html');
	var paperboy = require('paperboy/paperboy');

	function AddScreen( container ) {
		var self = this;
		this.container = container;
		this.element = document.createElement('div');
		this.element.className = 'pt-addscreen';

		container.appendChild( this.element );

		var trigger = paperboy.mixin(this);

		this.element.addEventListener('click', function( event ) {
			var itemId;
			if (itemId = event.target.getAttribute('data-item-id')) {
				trigger('itemclick', self.items.getItem(itemId) );
			}
		});

		this.view = new Ractive({
			el: self.element,
			template: template,
			data: {
				previewUrl: "",
				items: []
			}
		});
		
		dataservice.loadList().then(function( itemList ) {
			self.view.set('items', itemList.items);
			self.items = itemList;
		});
	}

	AddScreen.prototype.render = function( previewUrl ) {
		this.view.set('previewUrl', previewUrl);
	};

	exports.create = function( container ) {
		return new AddScreen( container );
	};

});