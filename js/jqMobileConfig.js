/* Configuración de jQueryMobile

	Para ue funcione la disposición en el documento html padre debe ser:
	
	<script src="jQuery.js"></script>
	<script src="jqMobileConfig.js"></script>
	<script src="jQueryMobile.js"></script>
	
	*/
	
$(document).bind('mobileinit', function(){
	
	$.extend($.mobile,{
			allowCrossDomainPages 		: true,
			ajaxEnable 					: false,
			loadingMessage				: 'cargando.',
			loadingMessageTextVisible 	: true,
			pushStateEnabled 			: false,
			pageLoadErrorMessage		: 'Error al cargar la página.'
		}
	);
	
	$.mobile.buttonMarkup.hoverDelay = 0;
	$.mobile.phonegapNavigationEnabled = true;
	
	
});