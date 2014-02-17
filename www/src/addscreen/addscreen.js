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

		var viewModel = {
			previewUrl: "",
			items: []
		};

		this.view = new Ractive({
			el: self.element,
			template: template,
			data: viewModel
		});
		
		dataservice.loadList().then(function( itemList ) {
			self.view.set('items', itemList.items);
			self.items = itemList;

			self.element.addEventListener('click', function( event ) {
				var itemId = event.target.getAttribute('data-target-item');

				if (!itemId) {
					return;
				}
				var item;
				if( itemId === 'new') {
					item = itemList.addItem( {
						images: [{src: self.view.data.previewUrl}]
					});
				} else {
					item = itemList.getItem( itemId );
					item.addImage( {src: self.view.data.previewUrl} );
				}

				trigger('itemadded', itemId);
				
			});
		});

	}

	AddScreen.prototype.render = function( previewUrl ) {
		this.view.set('previewUrl', previewUrl);
	};

	exports.create = function( container ) {
		return new AddScreen( container );
	};

});