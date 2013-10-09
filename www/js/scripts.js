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

// Conteúdo

function loadContent(container, api, contentID, hashURL) {
    box = $(container);
    box.empty().addClass('loading');

    $.ajax({
        url: 'http://www.educacao.sp.gov.br/api/'+api+'/'+contentID+'?callback=?',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var newsContent = '<h2>' + data.Titulo + '</h2>' + data.Texto;
            box.html(newsContent).trigger('create').removeClass('loading');
            window.location.hash = ''+ hashURL +'?' + contentID;
        }
    });
}

// Notícias

// Trazendo lista de notícias

function getNoticias() {
    var liTemp = '',
    boxPosts = $('#list-posts');

    $.ajax({
        url: 'http://www.educacao.sp.gov.br/api/noticias/?callback=?',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            boxPosts.empty();
            var dataLength,
            news = data.noticias;
            for( var i = 0, dataLength = data.noticias.length; i < dataLength; i++ ) {
                liTemp += '<li><a href="#post" data-noticia="' + news[i].noticiaID + '">' + news[i].Titulo + '</a></li>';               
            }

            boxPosts.append(liTemp).listview('refresh').next('.loading').remove();
            tapListViewNoticias();
        }
    });
}

// Adiciona evento ao tap na lista de notícias

var tapListViewNoticias = function(){
  $( '.posts > li' ).bind( 'tap', tapHandler );
 
    function tapHandler( event ){
        var newsID = $( event.target ).data('noticia');
        loadContent( '#post-content', 'noticias', newsID, 'post');
    }
};

// Mostra notícia de acordo com o ID na página

$(document).on('pageshow', '#post', function( event ) {
    var newsURL = window.location.hash;
    if ( newsURL != '#post' ) {
        var newsID = newsURL.slice(6);
        loadContent( '#post-content', 'noticias', newsID, 'post');
    }
});

// Programas e projetos

// Trazendo lista de programas e projetos

function getProgramas() {
    var liTemp = '',
    boxPrograms = $('#list-programs');

    $.ajax({
        url: 'http://www.educacao.sp.gov.br/api/paginas/projetos?callback=?',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            var programs = data.filhas;

            for( var i = 0; i < programs.length; i++ ) {
                var linkProgram = '';
                if (programs[i].uri.search('http') != -1) {
                    linkProgram = programs[i].uri;
                } else {
                    linkProgram = '#programa';
                }

                liTemp += '<li><a href="' + linkProgram + '" data-uri="' + programs[i].uri + '">' + programs[i].Titulo + '</a></li>';
            }
            boxPrograms.append(liTemp).listview('refresh').next('.loading').remove();
            tapListViewProgramas();
        }        
    });
}

// Adiciona evento ao tap na lista de programas e projetos

var tapListViewProgramas = function(){
  $( '#list-programs > li' ).bind( 'tap', tapHandler );
 
    function tapHandler( event ){
        var uri = $( event.target ).data('uri');
        loadContent( '#program-content', 'paginas', uri, 'programa');
    }
};

// Mostra programa e/ou projeto de acordo com o ID na página

$(document).on('pageshow', '#programa', function( event ) {
    var urlPrograma = window.location.hash;
    if ( urlPrograma != '#programa' ) {
        var programa = urlPrograma.slice(10);
        loadContent( '#program-content', 'paginas', programa, 'programa');
    }
});