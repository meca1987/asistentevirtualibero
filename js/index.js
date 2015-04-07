/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var vAux = 0; //--> variable auxiliar

var app = {
    // Application Constructor
    initialize: function() {
		
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {

		document.addEventListener("backbutton", function(e){
			
			if(window.location.href.indexOf("index.html") > 0){
				e.preventDefault();
				navigator.app.exitApp();
				
			}else{
				if(window.location.href.indexOf('chat.html') > 0){
					e.preventDefault();	
				}	 	
			}
			
		}, false);
		
		if(window.location.href.indexOf('chat.html') > 0){
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);//se desactiva el evento "touchmove" para la página de chat
		}
		
		if(window.location.href.indexOf('index.html') > 0){
			app.receivedEvent('deviceready');//--->Ejecuta esta función solo si se encuentra en index.html
		}
		
//------------------------------------------------------------------------------------------------
    	},
    	tokenHandler:function(msg) {
			idDispositivo = msg; //aquí es donde se asigna el id del dispositivo (solo si es apple)
        	//alert("Token Handler " + msg);
    	},
    	errorHandler:function(error) {
        	//alert("Error Handler  " + error);
			//mensaje_alert('popupIndex', 'mensaje', 'No se pudo registrar este dispositivo al servicio de google. Error: ' + error);
    	},
    
		//result contains any message sent from the plugin call
    	successHandler: function(result) {
     		//alert('Success! Result = ' + result);
    	},
    
	// Update DOM on a Received Event
    receivedEvent: function(id) {
		
		var pushNotification = window.plugins.pushNotification;
        // TODO: Enter your own GCM Sender ID in the register call for Android
		
        if(device.platform == 'android' || device.platform == 'Android'){
			//si es android
			marcaDispositivo="A";
            pushNotification.register(this.successHandler, this.errorHandler,{
				"senderID"	:"910559343301",
				"ecb"		:"app.onNotificationGCM"
			});
			
        }else{
			//si es apple
			marcaDispositivo="I";
   			pushNotification.register(this.tokenHandler,this.errorHandler,{
				"badge"	:"true",
				"sound"	:"true",
				"alert"	:"true",
				"ecb"	:"app.onNotificationAPN"
				});
		}
		
		$.mobile.loading('hide');
    },
    
	// iOS
    onNotificationAPN: function(event) {
        var pushNotification = window.plugins.pushNotification;
		
		if(window.location.href.indexOf("chat")>0){
			$("#mensajesChat").append("<div class=\"success\" style=\"text-align:left\">Ibero: "+event.alert+"</div>");
			
			target = document.getElementById('contenedorMensajes');
			target.scrollTop = '99999999'; 
		}else{
		
			//NOTA: LA FUNCIÓN "mensaje_alert" se encuentra alojado en el "scriptGlobales.js"
			if(window.location.href.indexOf("menu.html")>0){
				mensaje_alert("mensaje2","Tienes un Mensaje.");
			}else{
				 mensaje_alert("mensaje","Tienes un Mensaje.");
			}
		}
        if (event.alert) {
           // navigator.notification.alert(event.alert);
		   null;
        }
        if (event.badge) {
         //   alert("Set badge on  " + pushNotification);
            pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
    },
    // Android
    onNotificationGCM: function(e){
	   
	   switch(e.event){
            case 'registered':
				$.mobile.loading('show');
				
				if ( e.regid.length > 0 ){
					idDispositivo = e.regid; //aquí asigna el id del dispositivo si es un android...
					
					/*if(window.location.href.indexOf("index.html")>0){
			        	console.log("Regid " + e.regid);
                  		alert('registration id = '+e.regid);
						$("#txtNombre").val(e.regid);	
					}*/	
                }
				
				$.mobile.loading('hide');
				
                break;

            case 'message':

	            if (e.foreground){
				//--- Se ejecuta solo cuando la aplicación esta en primer plano
				//--- Se aprovecha y de una ves se "pinta" el mensaje en la pantalla usando lo que trae el mensaje de push
				
					if(window.location.href.indexOf("chat.html") > 0){
					//--- Solo si se esta en la pantalla de chat.
						
						if(e.payload.message == '***Conversacion Cerrada***'){//si la cadena push es igual al valor fijo, entonces quiere decir que la conversacion fue cerrada
							
							if(statusPag == true){
								
								function continuarProcesoForeground(){
									$('#contMsgChat li').remove();
								
									statusPag = false;

									$('#popupPrimeraVez a#btnPedirAyuda').css('visibility', 'visible');
msg = '¡Felicidades ' + textUsuario + ' ! Te has conectado al servicio de chat para atención al cliente.<br>¡El operador ha cerrado la conversación!, si deseas solicitar nuevamente el servicio, por favor, vuelva a presionar el boton "Solicitar Operador"<br>Si deseas cerrar esta aplicación, presione el boton "cerrar".';

									mensaje_alert('popupPrimeraVez', 'mensaje2', msg);	
								}
								
								actualizarInstancia(textUsuario, textToken, 'conversacioninactiva', continuarProcesoForeground);
								
							}
	
						}else{
							
							if(statusPag == false){
								$('#popupPrimeraVez').popup('close');
								statusPag = true;
							}
						
						$("#contMsgChat").append('<li><div class="msgIbero"><div class="labelMsg">Ibero:</div><div class="contMsg">' + e.payload.message + '</div></div></li>');
						
							refrescarScroll();
						
						}
						
					}
					
        		}else{
					if(e.coldstart){
						vAux = 0;
					}else{
						//esta parte se ejecuta cuando el usuario regresa al primer plano de la aplicación cuando selecciona las notificación dentro del entorno del android.
						/*
						if(window.location.href.indexOf("index.html") > 0){
							
							window.location.href = 'index.html';
						
						}else{
							
							window.location.href = '../index.html';	
							
						}
						*/
						//nota: este sección se ejecuta primero que el evento "onResume" de phoneGap
						vAux = 0;
					}
				}
                break;

            case 'error':
                alert('GCM error = '+ e.msg);
                break;

            default:
                alert('Un evento desconocido GCM a ocurrido.');
                break;
        }
    }

};