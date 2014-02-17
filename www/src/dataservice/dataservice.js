define(function( require, exports ) {

	var paperboy = require('paperboy/paperboy');

	var trigger = paperboy.mixin( exports, ['error'] );

	function Item( dto ) {
		for( var key in dto ) {
			if (dto.hasOwnProperty(key)) {
				this[key] = dto[key];
			}
		}
		var trigger = paperboy.mixin(this);
		this.addImage = function( newImage ) {
			this.images.unshift(newImage);
			trigger('change', this);
		};
	}
	function createItem( dto ) {
		return new Item( dto );
	}

	function ItemList( items ) {
		
		var self = this;
		var trigger = paperboy.mixin(this);
		this.items = items = items.map(function(rawItem) {
			var item = createItem( rawItem );
			item.on('change', function( item ) {
				var index = self.items.indexOf(item);
				self.items.splice(index, 1);
				self.items.unshift( item );
				trigger('change', item);
			});
			return item;
		});

		this.getItem = function getItem( key, val ) {
			if (arguments.length === 1) {
				return self.getItem( 'id', key );
			}

			for( var i = 0; i < items.length; i += 1) {
				if (items[i][key] === val) {
					return items[i];
				}
			}

			throw new Error('Tried to retrieve list item with "'+key+'" of "'+val+'"');
		};
		this.filterItems = function( key, val ) {
			return items.filter(function(item) { return item[key] === val; });
		};

		this.addItem = function( dto ) {
			dto.id = Math.random().toString();
			var newItem = createItem( dto );
			this.items.unshift( newItem );
			trigger('add');
			return newItem;
		};
	}

	//var itemCache = {};
	var listPromise;

	exports.loadList = function getList() {
		if (listPromise) {
			return listPromise;
		}
		listPromise = new Promise(function( resolve, reject ) {

			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200 || xhr.status === 0) {
						try {
							var response = JSON.parse(xhr.response);
							resolve( new ItemList(response.items) );
						} catch(e) {
							reject(e);
						}
					} else {
						trigger('error', xhr.status);
						reject(xhr.status);
					}
				}
		    };
		    
		    xhr.responseType = 'text';

			xhr.open("GET", "src/dataservice/testdata/data.json");
			xhr.send();
		});
		listPromise.catch(trigger.bind(null, 'error'));

		return listPromise;
	};
});