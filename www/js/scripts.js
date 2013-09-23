$(document).on('mobileinit', function() {
	$.mobile.loadingMessage = 'carregando...';
	$.mobile.pageLoadErrorMessage = 'erro ao carregar a página';
	$.mobile.page.prototype.options.backBtnText = 'Voltar';
	$.mobile.defaultPageTransition   = 'none';
	$.mobile.defaultDialogTransition = 'none';
	$.mobile.page.prototype.options.domCache = true;
});


// Topo

function goTop() {
	$('.top').on('tap', function(event){
		$('html, body').animate({scrollTop:0}, 'fast');
	});
}

$(document).on('pageinit', '#post, #programa', function( event ) {
	goTop();
});


// Mapa

$(document).on('pageshow', '#contato', function( event ) {
	$('#map-canvas').gmap('refresh');
});

$(document).on('pageinit', '#contato', function( event ) {
	loadMap();
});


function loadMap() {
	var mapLocation = '-23.54486, -46.64337';
	$('#map-canvas').gmap({
		'center': mapLocation,
		'zoom': 16,
		'callback': function() {
			var self = this;
			self.addMarker({
				'position': this.get('map').getCenter()
			}).click(function() {
				self.openInfoWindow({ 'content': 'Estamos aqui!' }, this);
			});	
		}
	});
}