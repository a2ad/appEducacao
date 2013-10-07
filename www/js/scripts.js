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
$(document).on('pageinit', '#index', function( event ) {	
    getNoticias();
    $('#loading-first').fadeOut().remove();
});

//Programas
$(document).on('pageinit', '#programas-projetos', function( event ){
    getProgramas();
});

// Mapa
$(document).on('pageshow', '#contato', function( event ) {
	$('#map-canvas').gmap('refresh');
});

$(document).on('pageinit', '#contato', function( event ) {
	loadMap();
});

// Carrega mapa
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

// Notícias
$(document).on('pageshow', '#post', function( event ) {
    var urlNoticia = window.location.hash;
    if ( urlNoticia != '#post' ) {
        var noticia = urlNoticia.slice(6);
        var tplNoticia = '<h2>{{titulo}}</h2>{{conteudo}}';
        $('#post-content').empty().addClass('loading');

        $.ajax({
            url: 'http://www.educacao.sp.gov.br/api/noticias/'+noticia+'?callback=?',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#post-content').removeClass('loading');

                var content = tplNoticia.replace('{{titulo}}', data.Titulo);
                content = content.replace('{{conteudo}}', data.Texto);
                
                $('#post-content').html(content).trigger('create');
                window.location.hash = 'post?' + noticia;
            }
        });
    }
});

var tapListViewNoticias = function(){
  $( '.posts > li' ).bind( 'tap', tapHandler );
 
    function tapHandler( event ){
        var id = $( event.target ).data('noticia');
        var tplNoticia = '<h2>{{titulo}}</h2>{{conteudo}}';
        $('#post-content').empty().addClass('loading');

        $.ajax({
             url: 'http://www.educacao.sp.gov.br/api/noticias/'+id+'?callback=?',
             type: 'GET',
             dataType: 'json',
             success: function (data) {
                $('#post-content').removeClass('loading');

                var content = tplNoticia.replace('{{titulo}}', data.Titulo);
                content = content.replace('{{conteudo}}', data.Texto);
                
                $('#post-content').html(content).trigger('create');
                window.location.hash = 'post?' + id;
             }
         });
    }
};

function getNoticias() {
    var li = '<li><a href="#post" data-noticia={{id}}>{{titulo}}</a></li>';

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
                $('.posts').append(liTemp).next('.loading').remove();
            });

            $('.posts').listview('refresh');
            tapListViewNoticias();
        }
    });
}

// Programas e Projetos
$(document).on('pageshow', '#programa', function( event ) {
    var urlPrograma = window.location.hash;
    if ( urlPrograma != '#programa' ) {
        var programa = urlPrograma.slice(10);
        var uri = $( event.target ).data('uri');
        var tplPrograma = '<h2>{{titulo}}</h2>{{conteudo}}';
        $('#program-content').empty().addClass('loading');

        $.ajax({
             url: 'http://www.educacao.sp.gov.br/api/paginas/'+programa+'?callback=?',
             type: 'GET',
             dataType: 'json',
             success: function (data) {
                $('#post-content').removeClass('loading');

                var content = tplPrograma.replace('{{titulo}}', data.Titulo);
                content = content.replace('{{conteudo}}', data.Texto);
                
                $('#program-content').removeClass('loading').html(content).trigger('create');
                window.location.hash = 'programa?' + programa;
             }
         });
    }
});

var tapListViewProgramas = function(){
  $( '#list-programs > li' ).bind( 'tap', tapHandler );
 
    function tapHandler( event ){
        var uri = $( event.target ).data('uri');
        var tplPrograma = '<h2>{{titulo}}</h2>{{conteudo}}';
        $('#program-content').empty().addClass('loading');

        $.ajax({
             url: 'http://www.educacao.sp.gov.br/api/paginas/'+uri+'?callback=?',
             type: 'GET',
             dataType: 'json',
             success: function (data) {
                $('#post-content').removeClass('loading');

                var content = tplPrograma.replace('{{titulo}}', data.Titulo);
                content = content.replace('{{conteudo}}', data.Texto);
                
                $('#program-content').removeClass('loading').html(content).trigger('create');
                window.location.hash = 'programa?' + uri;
             }
         });

    }
};

function getProgramas() {
    var li = '<li><a href="{{link}}" data-uri="{{uri}}">{{titulo}}</a></li>';

    $.ajax({
        url: 'http://www.educacao.sp.gov.br/api/paginas/projetos?callback=?',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            var programas = data.filhas;
            for( var i = 0; i < programas.length; i++ ) {
                var liTemp;
                liTemp = li.replace('{{uri}}', programas[i].uri);
                liTemp = liTemp.replace('{{titulo}}', programas[i].Titulo);

                if (programas[i].uri.search('http') != -1) {
                    liTemp = liTemp.replace('{{link}}', programas[i].uri);
                } else {
                    liTemp = liTemp.replace('{{link}}', '#programa');
                }

                $('#list-programs').append(liTemp).next('.loading').remove();
            }
            $('#list-programs').listview('refresh');
            tapListViewProgramas();
        }        
    });
}