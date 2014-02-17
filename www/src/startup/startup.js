define(function(require, exports, module) {
	
	var screenmanager = require('../screenmanager/screenmanager').create();
	var dataservice = require('../dataservice/dataservice');

	var mainscreenCreate = require('src/mainscreen/mainscreen').create;
	var itemscreenCreate = require('../itemscreen/itemscreen').create;
	var errorscreenCreate = require('../errorscreen/errorscreen').create;
	var addscreenCreate = require('../addscreen/addscreen').create;

	var mainscreen = mainscreenCreate(document.getElementById('main'));
	var itemscreen = itemscreenCreate(document.getElementById('item'));
	var errorscreen = errorscreenCreate( document.getElementById('error') );
	var addscreen = addscreenCreate( document.getElementById('add') );

	mainscreen.render();
	screenmanager.add( 'main', mainscreen.container );
	
	screenmanager.add( 'error', errorscreen.container, errorscreen.render.bind(errorscreen) );
	screenmanager.add( 'item', itemscreen.container, itemscreen.render.bind(itemscreen) );
	screenmanager.add( 'add', addscreen.container, addscreen.render.bind(addscreen) );

	mainscreen.on('itemclick', function( item ) {
		screenmanager.show( 'item', item.id );
	});

	screenmanager.show( 'main' );
	dataservice.on('error', function( error ) {
		screenmanager.show('error', error);
	});

	addscreen.on( 'itemadded', function() {
		screenmanager.main();
	});

	function openCamera() {
		navigator.camera.getPicture(function( imageData ) {
			screenmanager.show('add', imageData);
		}, function( error ) {
			if (error !== 'no image selected') {
				screenmanager.show('error', new Error( error ) );
			}
		}, { 
			quality : 25,
			allowEdit : true,
			targetWidth: 1024,
			targetHeight: 1024,
			saveToPhotoAlbum: false,
			destinationType: 1,
			sourceType: 1
		});
	}
	function getPhoto() {
		navigator.camera.getPicture(function( imageData ) {
			screenmanager.show('add', imageData);
		}, function( error ) {
			if (error !== 'no image selected') {
				screenmanager.show('error', new Error( error ) );
			}
		}, { 
			quality : 25,
			allowEdit : true,
			targetWidth: 1024,
			targetHeight: 1024,
			saveToPhotoAlbum: false,
			destinationType: 1,
			sourceType: 0
		});
	}

	var buttonActions = {
		back: screenmanager.back,
		camera: openCamera,
		getphoto: getPhoto,
		testphoto: function(){
			screenmanager.show('add', "http://placekitten.com/1024/768");
		}
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