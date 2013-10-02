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

// Noticias
$(document).on('pageshow', '#index', function( event ) {	
    getNoticias();
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

// Swipe
$( document ).on( "pageinit", "#index, #programas-projetos, #contato", function() {
    var page = "#" + $( this ).attr( "id" ),
        next = $( this ).jqmData( "next" ),
        prev = $( this ).jqmData( "prev" );

    if ( next ) {
        $( document ).on( "swipeleft", page, function() {
            $.mobile.changePage( '#' + next, { transition: "none" });
        });
    }
   
    if ( prev ) {
        $( document ).on( "swiperight", page, function() {
            $.mobile.changePage( '#' + prev, { transition: "none" } );
        });
      
    }
});

function getNoticias() {
    var li = '<li><a href="#post" data-id="{{id}}">{{titulo}}</a></li>';

    $.ajax({
        url: 'http://www.educacao.sp.gov.br/api/noticias/?callback=?',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('.posts').empty();
            $.each(data.noticias, function (key, noticia) {
                var liTemp;
                liTemp = li.replace('{{id}}', noticia.noticiaID);
                liTemp = liTemp.replace('{{titulo}}', noticia.Titulo);
                $('.posts').append(liTemp);
            })

            $('.posts').listview('refresh');
            $('#loading-posts').fadeOut();
        }
    });
}