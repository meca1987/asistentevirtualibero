/* Documento javascript para alojar las clases y funciones que se van a utilizar en todos los módulos de la aplicación */

/*
  * Clase "varGlobales".
  * Clase para el manejo de las variables globales, usando la caracteristica de "localStorage".
  * @author  Alex Llovera
  * @CREADO Alex Llovera 21/02/2015
  * @version 0.1 

*/
function varGlobales(){
			this.globales		 = window.localStorage.getItem('chatMovil'); //propiedad
			
			this.crearGlobales 	 = function(parametrosEnt){
			/*--- se carga en el local storage 
				"JSON.stringify" se usa para convertir en un string json el objeto "globales" para hacerlo compatible con la caracterista de localStorage ---*/
				window.localStorage.setItem('chatMovil', JSON.stringify(parametrosEnt));			
			}
						
			this.obtenerGlobales = function(){
					var variablesGlobales = JSON.parse(this.globales);
					return variablesGlobales;
				}//metodo
			
			this.asignarGlobales = function(parametrosEnt){
					var variablesGlobales = JSON.parse(this.globales);
					
					//--- en el siguiente bucle for, se recorren las variables del objeto "variables globales", en donde "key" hará referencia al nombre de cada una de las variables contenidas en el objeto 						
					for(key in variablesGlobales){
						//--- se comprueba si el objeto "parametrosEnt" tiene una variable global que existe en el objeto de variables globales que previamente se ha declarado con el metodo "crearGlobales"
						if(typeof(parametrosEnt[key]) != 'undefined'){
							//--- si existe, entonces se sobreescribe y se cambia el valor de la variable global por el que se asigno.
							variablesGlobales[key] = parametrosEnt[key];
						}
					}
					//--- se sobreescribe el espacio del localStorage, donde estan alojadas las variables globales									
					window.localStorage.setItem('chatMovil', JSON.stringify(variablesGlobales));
					
					return true;
				}//metodo
		}
/* Fin de la clase, "varGlobales" */

//--- Funcion para mostrar mensajes ---
function mensaje_alert(divPopup, divMensaje, mensaje){
	
	divMensaje	= '#' + divMensaje;
	divPopup	= '#' + divPopup;
	
	$(divMensaje).html(mensaje);
	
	setTimeout(function(){
		$(divPopup).popup("open");
	}, 200);	
}
//--- Fin de mensaje_alert ---

function lockUi(){
	$('#block-ui').css('display', 'block');
}

function unlockUi(){
	$('#block-ui').css('display', 'none');
}