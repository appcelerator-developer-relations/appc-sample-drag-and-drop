var DragDrop = require('ti.dragdrop'),
		safari = require("ti.safaridialog");

var _dragDropView,	// drop view container
		_draggingView; 	// dragging view

/**
 * init
 *
 */
(function init() {
	// enable drop interaction on window
	DragDrop.setDropView($.window);
	$.window.open();

	// enabled drag interaction on image view
	DragDrop.enableDragOnView($.imageView);

	// add image view touch start event listener
	$.imageView.addEventListener('touchstart', draggableViewTouchStart);
})();

/**
 * image view touch start event handler
 *
 * @param {Object} e
 */
function draggableViewTouchStart(e) {
	_draggingView = e.source;
};

/**
 * returns true if given location is within trash can
 *
 * @param {Object} location
 */
function locationIsTrashCan(location) {
	return (location.y > $.trashCan.rect.y && location.y < ($.trashCan.rect.y + $.trashCan.rect.height)
		&& location.x > $.trashCan.rect.x && location.x < ($.trashCan.rect.x + $.trashCan.rect.width));
}

/**
 * view moved event handler
 *
 * @param {Object} e
 */
function viewMoved(e){
	_draggingView.top =  e.location.y - (_draggingView.size.height / 2);
	_draggingView.left = e.location.x - (_draggingView.size.width / 2);
	if (locationIsTrashCan(e.location)) {
		$.window.remove(_draggingView);
	}
	_draggingView = null;
}

/**
 * image copied
 * - image dragged in from another app
 */
DragDrop.addEventListener('imageCopied', function(e){
	var aspect = e.image.height / e.image.width,
		width = 200,
		height = width * aspect;

	var imageView = Ti.UI.createImageView({
		top: e.location.y - (height / 2),
		left: e.location.x - (width / 2),
		width: width,
		height: height,
		image: e.image
	});
	imageView.addEventListener('touchstart', draggableViewTouchStart);
	$.window.add(imageView);
	DragDrop.enableDragOnView(imageView);
});

/**
 * image moved
 * - imaged moved within app
 */
DragDrop.addEventListener('imageMoved', viewMoved);

/**
 * text copied
 * - text snippet dragged in from another app
 */
DragDrop.addEventListener('textCopied', function(e){
	var label = Ti.UI.createLabel({
		top: e.location.y,
		left: e.location.x - 100,
		width: 200,
		height: Ti.UI.SIZE,
		font: {
			fontSize: 16
		},
		text: e.text
	});
	label.addEventListener('postlayout', function labelPostLayout(evt){
		evt.source.top = e.location.y - (evt.source.size.height/2);
		label.removeEventListener('postlayout', labelPostLayout);
	});
	label.addEventListener('touchstart', draggableViewTouchStart);
	$.window.add(label);
	DragDrop.enableDragOnView(label);
});

/**
 * text moved
 * - text moved within app
 */
DragDrop.addEventListener('textMoved', viewMoved);

/**
 * url copied
 * - url dragged in from another app
 */
DragDrop.addEventListener('urlCopied', function(e){
	var label = Ti.UI.createLabel({
		top: e.location.y,
		left: e.location.x - 100,
		width: 200,
		height: Ti.UI.SIZE,
		font: {
			fontSize: 12
		},
		text: '    ' + e.text,
		clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED
	});
	label.add(Ti.UI.createImageView({
		top: 3,
		left: 0,
		width: 10,
		height: 10,
		image: 'url.png'
	}));
	label.addEventListener('postlayout', function labelPostLayout(evt){
		evt.source.top = e.location.y - (evt.source.size.height/2);
		label.removeEventListener('postlayout', labelPostLayout);
	});
	label.addEventListener('click', function labelClick(evt){
		safari.open({
			url: evt.source.text.trim()
		});
	});
	label.addEventListener('touchstart', draggableViewTouchStart);
	$.window.add(label);
	DragDrop.enableDragOnView(label);
});

/**
 * url moved
 * - url moved within app
 */
DragDrop.addEventListener('urlMoved', viewMoved);
