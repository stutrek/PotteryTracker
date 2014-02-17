define(function(require, exports, module) {
	
	var screenmanager = require('../screenmanager/screenmanager').create();
	var dataservice = require('../dataservice/dataservice');

	var mainscreenCreate = require('src/mainscreen/mainscreen').create;
	var itemscreenCreate = require('../itemscreen/itemscreen').create;
	var errorscreenCreate = require('../errorscreen/errorscreen').create;

	var mainscreen = mainscreenCreate(document.getElementById('main'));
	mainscreen.render();

	var itemscreen = itemscreenCreate(document.getElementById('item'));

	var errorscreen = errorscreenCreate( document.getElementById('error') );

	screenmanager.add( 'main', mainscreen.container );
	
	screenmanager.add( 'error', errorscreen.container, function( error ) {
		errorscreen.render( error );
	});
	
	screenmanager.add( 'item', itemscreen.container, function( itemId ) {
		itemscreen.render( itemId );
	});

	mainscreen.on('itemclick', function( item ) {
		screenmanager.show( 'item', item.id );
	});

	screenmanager.show( 'main' );
	dataservice.on('error', function( error ) {
		screenmanager.show('error', error);
	});

	function getPicture() {
		navigator.camera.getPicture(function( imageData ) {
			console.log(imageData);
		}, function( error ) {
			if (error !== 'no image selected') {
				screenmanager.show('error', new Error( error ) );
			}
		}, { 
			quality : 50,
			allowEdit : true,
			targetWidth: 768,
			targetHeight: 768,
			saveToPhotoAlbum: false,
			destinationType: 0,
			sourceType: 0
		});
	}

	var buttonActions = {
		back: screenmanager.back,
		camera: getPicture
	};
	var pictureSource;
	var destinationType;

	document.body.addEventListener('click', function( event ) {

		if (event.target.nodeName === 'BUTTON') {
			var action = event.target.getAttribute('data-action');
			if (buttonActions[action]) {
				buttonActions[action]();
			} else {
				var error = new Error('Pressed an unknown button!');
				screenmanager.show('error', error);
				throw error;
			}
		}
	});



	function onDeviceReady() {
		pictureSource=navigator.camera.PictureSourceType;
		destinationType=navigator.camera.DestinationType;
	}
    document.addEventListener("deviceready",onDeviceReady,false);

	exports.screenmanager = screenmanager;

});