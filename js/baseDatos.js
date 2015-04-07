
function iniciarBaseDatos(){
	var db = window.sqlitePlugin.openDatabase({name:"asistenteVirtualIbero.db", androidLockWorkaround:1});
	//alert('seleccionó base datos');
	return db;
}//fin de la funcion "iniciarBaseDatos"

function crearTablas(callback){
	var db = iniciarBaseDatos();
	
	function ejecutarCallBack(){
		if((callback) && (typeof callback === 'function')){
			callback();	
		}
	}
	
	db.transaction(function(tx){		
			
		function respuestaQuery(){
		  ejecutarCallBack();
		}
		
		tx.executeSql("CREATE TABLE IF NOT EXISTS usuarios (id integer primary key, idusuario text, token text, status text, instancia text)", [], respuestaQuery);
		//alert('seleccionó tabla');
	});
}// fin de la funcion "crearTablas"


function consultarUsuarioActivo(callback){
	
	var db = iniciarBaseDatos();
	
	function ejecutarCallBack(vAux){
		
		if((callback) && (typeof callback === 'function')){
			callback(vAux, true); //el primer valor de entrada indica que existe una sesion activa, el segundo valor indica si los valores fueron tomados de la base de datos local
   		}
			
	}
		
	//inicia la transacción para esta función
	db.transaction(function(tx){
		
		function respuestaQuery(tx, res){	
			
			/*** declarar variable local ***/
			vAuxBan = false;
			/*******************************/
			filas = res.rows.length;
			
			//alert('filas encontradas '+ filas);
			
			if(filas == 1){
				
				for(i = 0; i < filas; i++){
					/*
					se guarda en una variable de tipo vector global denominada "arrayAux" (declarado en la pagina padre) el id de usuario y el token activo
					que se obtienen desde la base de datos local.
					*/
					arrayAux.push(res.rows.item(i).idusuario);//posición 0
					arrayAux.push(res.rows.item(i).token);	  //posición 1
    	   		}	
				
				vAuxBan = true;
			}else{
				
				if(filas > 1){
					/*Aqui deberia haber un mensaje de error...*/
					alert('existe más de un registro con estatus "activo"');
					vAuxBan = false;
				}else{
					
					//alert('No hay registros de usuarios activos');
					vAuxBan = false;
				}
			}
			
			ejecutarCallBack(vAuxBan);
		}
		
		/* comprueba si existe una sesión activa 
			Inicio del query */
		tx.executeSql("SELECT * FROM usuarios WHERE status = ?", ['ACT'], respuestaQuery,
			function(tx, e){ 
				alert('ocurrio un error: ' + e.message); 
				return false;
			}
		);//fin del primer query
		
		
	}, transaccionFallida);//fin de la transacción
}//fin de la funcion "consultarUsuarioActivo"

function iniciarSesionUsuario(idUsu, to, callback){
/*
	idUsu: es el id del usuario que inicia sesión.
	to: el token que genero la base de datos externa después de que el usuario iniciara sesión.
	callback: funcion que se ejecutara en la pagina padre despues de terminada la transaccion...
*/
	var db = iniciarBaseDatos();
	
	function ejecutarCallBack(vAux, vAux2){
		
		if((callback) && (typeof callback === 'function')){
        	callback(vAux, vAux2);
   		}
			
	}

	db.transaction(function(tx){
		idUsu = idUsu.toUpperCase();
		
		//alert('datos: '+ idUsu + ' '+ to);
		
		function respuestaQuery2(tx, result){
			
			//alert('entre en respuesta query2');
			
			filas = result.rowsAffected;
				
			if(filas > 0){
				//alert('el usuario se creo en la base de datos local');
				ejecutarCallBack(true, false);
			}else{
				alert('el usuario no se creo en la base de datos.');	
			}
		}
		
		function segundoQuery(){
		
			//alert('ejecuto segundo query');
		
			tx.executeSql("INSERT INTO usuarios (idusuario, token, status, instancia) VALUES (?, ?, ?, ?)",
			[idUsu, to, 'ACT', 'conversacioninactiva'], respuestaQuery2, 
			function(tx, e){
				alert('Ocurrió un error en la base de datos local, no se ha sincronizado, error: ' + e.message);
			});//fin del segundo query 
		}
	
	
		function respuestaQuery1(tx, res){
			//alert('entre en respuesta query');
			
			filas = res.rowsAffected;
		
			//alert('filas afectadas: '+ filas);
		
			if(filas > 0){
				//alert('el usuario existe, hizo update');
				ejecutarCallBack(true, false);
			}else{
				if(filas < 1){
					//alert('el usuario no existe dentro de la base de datos local, debe crearlo');
					segundoQuery();
				}
			}
		}
		
		/* actualiza el registro del usuario 
			Inicio del primer query nota: en el array "arrayAux2" la posicion 0 corresponde al token, la posicion 1 al status y la posision 2 al idUsuario */
		tx.executeSql("UPDATE usuarios SET token = ?, status = ?, instancia = ? WHERE idusuario = ?",
			[to, 'ACT', 'conversacioninactiva', idUsu], respuestaQuery1
			,function(tx, e){ alert('ocurrio un error: ' + e.message);});//fin del primer query
		
	}, transaccionFallida);//fin de la transacción

}//fin de la función "iniciarSesionUsuario"

function revisarInstancia(idUsu, to, callback){
	var db = iniciarBaseDatos();
	
	//alert('entre en revisarInstancia');
	
	function ejecutarCallBack(vAux){
		if((callback) && (typeof callback === 'function')){
        	callback(vAux);
   		}		
	}
	
	db.transaction(function(tx){
		
		function respuestaQuery(tx, res){
			
			filas = res.rows.length;
			//alert('filas en revisarInstancia '+ filas);
			
			if(filas > 0){
				//alert('consegui datos de instancia');
				
				for(i = 0; i < filas; i++){
					vInstancia = res.rows.item(i).instancia;
    	   		}
				
				ejecutarCallBack(vInstancia);
				
			}else{
				alert('no consegui datos de instancia');	
			}
				
		}
		
		tx.executeSql("SELECT * FROM usuarios WHERE idusuario = ? AND token = ?", [idUsu, to], respuestaQuery, 
		function(tx, e){ alert('ocurrio un error: ' + e.message);});//fin del query
		
	},transaccionFallida);
	
}//fin de la función "revisarInstancia"



function actualizarInstancia(idUsu, to, ins, callback){
	var db = iniciarBaseDatos();
	
	//alert('entre en actualizarInstancia');
	
	function ejecutarCallBack(){
		if((callback) && (typeof callback === 'function')){
        	callback();
   		}		
	}
	
	
	db.transaction(function(tx){
	
		function respuestaQuery(tx, res){
		
			filas = res.rowsAffected;
		
			if(filas > 0){
				//alert('actualizo la instancia');
				ejecutarCallBack();
			
			}else{
				alert('No actualizo la instancia');
			}
		}
	
		tx.executeSql("UPDATE usuarios SET instancia = ? WHERE idusuario = ? AND token = ?", [ins, idUsu, to]
		, respuestaQuery, function(tx, e){alert('ocurrio un error: ' + e.message);});//fin del primer query
	
	},transaccionFallida);
}//fin de la función "actualizarInstancia"




function cerrarSesionBaseDatos(idUsu, to, callback){

	var db = iniciarBaseDatos();
	
	//alert('entre en cerrarSesionLocal');
	
	function ejecutarCallBack(){
		if((callback) && (typeof callback === 'function')){
        	callback();
   		}		
	}
	
	//alert('datos: '+idUsu+' '+to);
	
	db.transaction(function(tx){	
		
		function respuestaQuery(tx, res){
			//alert('entre en respuesta query de cerrar sesion');			
			
			filas = res.rowsAffected;
			
			//alert('filas afectadas: ' + filas);
			
			if(filas > 0){
				
				//alert('la sesion fue cerrada localmente');
				ejecutarCallBack();	
				
			}else{
				alert('la sesion no se pudo cerrar localmente');
				ejecutarCallBack();
				
			}	
		}
			
		
		tx.executeSql("UPDATE usuarios SET token = '', status = 'INA' WHERE idusuario = ? AND token = ?", [idUsu, to]
		,respuestaQuery,function(tx, e){alert('ocurrio un error: ' + e.message);});//fin del primer query
		
		
	}, transaccionFallida);//fin de la transaccion
}//fin de la función "cerrarSesionBaseDatos"


transaccionExitosa = function(tx, r){
	alert('consulta exitosa filas afectadas: '+ r.rowsAffected);
}

queryFallido = function(tx, e){
	alert('consulta fallida ' + e.message);
}

transaccionFallida = function(e){
	alert('transacción fallida ' + e.message);
}

/************************************************************************************************/