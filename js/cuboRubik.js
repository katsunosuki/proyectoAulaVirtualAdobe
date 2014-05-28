function rangoValor(inicio, fin, actual, maximo) {
	var tmp = fin - inicio;
	tmp = (actual * tmp) / maximo;
	tmp += inicio;
	return tmp;
}

function trasladar(xy, x, y) {
	var xyTmp = {};
	
	xyTmp.x1 = xy.x1 + x;
	xyTmp.y1 = xy.y1 + y;
	
	xyTmp.x2 = xy.x2 + x;
	xyTmp.y2 = xy.y2 + y;
	
	return xyTmp;
}

function distancia(xy) {
	return Math.sqrt(Math.pow((xy.x2 - xy.x1), 2) + Math.pow((xy.y2 - xy.y1), 2))
}

function puntoMedio(xy) {
	return {x: ((xy.x1 + xy.x2) / 2), y: ((xy.y1 + xy.y2) / 2)};
}

$.fn.aplicaEstilo = function(nombre, valor, agregar) {
	var concatena = false;
	if (typeof(agregar) == "boolean")
		concatena = agregar;
	if (typeof(valor) != "undefined")
		return $(this).css(nombre, valor).css('-moz-' + nombre, (concatena ? '-moz-' : '') + valor).css('-ms-' + nombre, (concatena ? '-ms-' : '') + valor).css('-o-' + nombre, (concatena ? '-o-' : '') + valor).css('-webkit-' + nombre, (concatena ? '-webkit-' : '') + valor);
	else
		return $(this).css(nombre) || $(this).css('-moz-' + nombre) || $(this).css('-ms-' + nombre) || $(this).css('-o-' + nombre) || $(this).css('-webkit-' + nombre);
}

function Rubik(areaInicial, numeroInicial, rotacionInicial, funcionGiroInicial, funcionCompletoInicial) {
	var desarrollo = true;
	
	var tamanoContenedor;
	var contenedor;
	
	var tamanoCr;
	
	var escalar = 1;
	
	var distanciaS = 0;
	
	var moverX = 0;
	var moverY = 0;
	var mover = false;
	var rotarX = 0;
	var rotarY = 0;
	
	var moverXCara = 0;
	var moverYCara = 0;
	var moverCara = false;
	
	var anchoBorde = 3;
	var borde;
	var borde2;
	
	var seleccion = false;
	
	var area = areaInicial;
	var numero = numeroInicial;
	var rotacion = rotacionInicial;
	var funcionGiro = funcionGiroInicial;
	var funcionCompleto = funcionCompletoInicial;
	
	var nCaras;
	var movimientos = 0;
	
	var bloqueo = false;
	var bloqueo2 = false;
	
	var expandido = false;
	
	var matris45 = "";
	
	var caraEventoTouchStart;
	
	var matrisArreglo = function(matris) {
		var tmp = matris.substring((matris.indexOf('(') + 1), matris.indexOf(')')).split(", "); //x 12 y 13 z 14
		for (var i = 0; i < tmp.length; i++) {
			tmp[i] = Number(tmp[i]);
			tmp[i] = Number(tmp[i].toFixed(0));
			if ((borde + 1) == tmp[i])
				tmp[i] -= 1;
			else if ((borde - 1) == tmp[i])
				tmp[i] += 1;
			else if ((-borde + 1) == tmp[i])
				tmp[i] -= 1;
			else if ((-borde - 1) == tmp[i])
				tmp[i] += 1;
		}
		return tmp;
	}
	
	var limpiaSeleccion = function() {
		if (seleccion) {
			if (desarrollo)
				$(contenedor).children(".seleccion1, .seleccion2, .rotar1X, .rotar1Y, .rotar1Z, .rotar2X, .rotar2Y, .rotar2Z, .direccion1, .direccion2").each(function() {
					$(this).aplicaEstilo('background-color', $(this).attr('color'));
				});
			$(contenedor).children(".seleccion1").removeClass("seleccion1");
			$(contenedor).children(".seleccion2").removeClass("seleccion2");
			$(contenedor).children(".rotar1X").removeClass("rotar1X");
			$(contenedor).children(".rotar1Y").removeClass("rotar1Y");
			$(contenedor).children(".rotar1Z").removeClass("rotar1Z");
			$(contenedor).children(".rotar2X").removeClass("rotar2X");
			$(contenedor).children(".rotar2Y").removeClass("rotar2Y");
			$(contenedor).children(".rotar2Z").removeClass("rotar2Z");
			$(contenedor).children(".direccion1").removeClass("direccion1");
			$(contenedor).children(".direccion2").removeClass("direccion2");
			seleccion = false;
		}
	}
	
	var animar = function(elementos, rotar, valorRotacion) {
		bloqueo2 = true;
		
		$(contenedor).animate({valor: valorRotacion}, {
			start: function() {
				$(elementos).each(function() {
					$(this).attr('valorInicial', $(this).aplicaEstilo('transform'));
				});
			},
			step: function(now, fx) {
				$(elementos).each(function() {
					$(this).aplicaEstilo('transform', "rotate" + rotar + "(" + rangoValor(0, valorRotacion, now, fx['end']) + "deg) " + $(this).attr('valorInicial'));
				});
			},
			complete: function() {
				$(elementos).each(function() {
					$(this).aplicaEstilo('transform', "rotate" + rotar + "(" + valorRotacion + "deg) " + $(this).attr('valorInicial'));
				});
				
				this.valor = 0;
				
				limpiaSeleccion();
				
				var completo = true;
				var indice;
				var bordeTmp;
	
				for (var i = 1; i <= 6; i++) {
					$(".lado" + i).each(function(index) {
						var matris = matrisArreglo($(this).aplicaEstilo('transform'));
		
						if (!index) {
							if (matris[12] == borde) {
								indice = 12;
								bordeTmp = borde;
							} else if (matris[12] == -borde) {
								indice = 12;
								bordeTmp = -borde;
							} else if (matris[13] == borde) {
								indice = 13;
								bordeTmp = borde;
							} else if (matris[13] == -borde) {
								indice = 13;
								bordeTmp = -borde;
							} else if (matris[13] == borde) {
								indice = 13;
								bordeTmp = borde;
							} else if (matris[13] == -borde) {
								indice = 13;
								bordeTmp = -borde;
							}
						} else
							if (matris[indice] != bordeTmp) {
								completo = false;
								return false;
							}
					});
					if (!completo)
						break;
				}
				
				if (movimientos && !completo && bloqueo)
					movimientos--;
				
				if (movimientos)
					setTimeout(movimientoAleatorio, 100);
				else
					setTimeout(function() {
						if (!bloqueo)
							if (typeof(funcionGiro) == "function")
								funcionGiro();
						if (completo)
							if (typeof(funcionCompleto) == "function")
								funcionCompleto();
						bloqueo = false;
						bloqueo2 = false;
					}, 100);
			},
			duration: 250
		});
	}
	
	var seleccionar = function(evento) {
		$("#log").html("seleccionar " + evento.clientX);
		
		moverXCara = evento.clientX;
		moverYCara = evento.clientY;
		
		limpiaSeleccion();
		
		var matris = matrisArreglo($(this).aplicaEstilo('transform'));
		//
		$(this).addClass("seleccion1");
		if (desarrollo)
			$(contenedor).children(".seleccion1").aplicaEstilo('background-color', "green");
		//
		$(contenedor).children(".cara:not(.seleccion1)").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if ((matris[12] == matris2[12] && matris[13] == matris2[13] && (matris[14] == borde || matris[14] == -borde) && (matris2[14] == borde || matris2[14] == -borde))
			|| (matris[12] == matris2[12] && matris[14] == matris2[14] && (matris[13] == borde || matris[13] == -borde) && (matris2[13] == borde || matris2[13] == -borde))
			|| (matris[13] == matris2[13] && matris[14] == matris2[14] && (matris[12] == borde || matris[12] == -borde) && (matris2[12] == borde || matris2[12] == -borde)))
				return true;
			return false;
		}).addClass("seleccion2");
		if (desarrollo)
			$(contenedor).children(".seleccion2").aplicaEstilo('background-color', 'red');
		//
		$(contenedor).children(".cara:not(.seleccion1, .seleccion2)").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris2[12] == matris[12] && matris[12] != borde && matris[12] != -borde)
				return true;
			return false;
		}).addClass("rotar1X");
		if (desarrollo)
			$(contenedor).children(".rotar1X").aplicaEstilo('background-color', 'yellow');
		//
		$(contenedor).children(".cara:not(.seleccion1, .seleccion2)").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris2[13] == matris[13] && matris[13] != borde && matris[13] != -borde)
				return true;
			return false;
		}).addClass("rotar1Y");
		if (desarrollo)
			$(contenedor).children(".rotar1Y").aplicaEstilo('background-color', 'khaki');
		//
		$(contenedor).children(".cara:not(.seleccion1, .seleccion2)").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris2[14] == matris[14] && matris[14] != borde && matris[14] != -borde)
				return true;
			return false;
		}).addClass("rotar1Z");
		if (desarrollo)
			$(contenedor).children(".rotar1Z").aplicaEstilo('background-color', 'orange');
		//
		$(contenedor).children(".cara").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris[12] == borde2 || matris[12] == -borde2)
				if ((matris2[12] == borde) || (matris2[12] == -borde))
					if ((matris[12] <= 0 && matris2[12] <= 0) || (matris[12] >= 0 && matris2[12] >= 0))
						return true;
			return false;
		}).addClass("rotar2X");
		if (desarrollo)
			$(contenedor).children(".rotar2X").aplicaEstilo('background-color', 'gold');
		//
		$(contenedor).children(".cara").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris[13] == borde2 || matris[13] == -borde2)
				if ((matris2[13] == borde) || (matris2[13] == -borde))
					if ((matris[13] <= 0 && matris2[13] <= 0) || (matris[13] >= 0 && matris2[13] >= 0))
						return true;
			return false;
		}).addClass("rotar2Y");
		if (desarrollo)
			$(contenedor).children(".rotar2Y").aplicaEstilo('background-color', 'darkkhaki');
		//
		$(contenedor).children(".cara").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris[14] == borde2 || matris[14] == -borde2)
				if ((matris2[14] == borde) || (matris2[14] == -borde))
					if ((matris[14] <= 0 && matris2[14] <= 0) || (matris[14] >= 0 && matris2[14] >= 0))
						return true;
			return false;
		}).addClass("rotar2Z");
		if (desarrollo)
			$(contenedor).children(".rotar2Z").aplicaEstilo('background-color', 'darkorange');
		//
		$(contenedor).children(".rotar1X, .rotar1Y, .rotar1Z").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if ((matris2[12] == matris[12] && (matris[12] == borde || matris[12] == -borde) && (matris2[13] == matris[13]))
			|| (matris2[13] == matris[13] && (matris[13] == borde || matris[13] == -borde) && (matris2[14] == matris[14]))
			|| (matris2[14] == matris[14] && (matris[14] == borde || matris[14] == -borde) && (matris2[13] == matris[13])))
				return true;
			return false;
		}).addClass("direccion1");
		if (desarrollo)
			$(contenedor).children(".direccion1").aplicaEstilo('background-color', 'white');
		//
		$(contenedor).children(".rotar1X, .rotar1Y, .rotar1Z").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if ((matris2[12] == matris[12] && (matris[12] == borde || matris[12] == -borde) && (matris2[14] == matris[14]))
			|| (matris2[13] == matris[13] && (matris[13] == borde || matris[13] == -borde) && (matris2[12] == matris[12]))
			|| (matris2[14] == matris[14] && (matris[14] == borde || matris[14] == -borde) && (matris2[12] == matris[12])))
				return true;
			return false;
		}).addClass("direccion2");
		if (desarrollo)
			$(contenedor).children(".direccion2").aplicaEstilo('background-color', 'black');
		//
		seleccion = true;
	}
	
	var girar = function(evento) {
		var xy2 = {1: {}, 2: {}};
		$(contenedor).children(".direccion1").each(function(index) {
			xy2[1]['x' + (index + 1)] = (this.getBoundingClientRect().left + (this.getBoundingClientRect().width / 2));
			xy2[1]['y' + (index + 1)] = (this.getBoundingClientRect().top + (this.getBoundingClientRect().height / 2));
			xy2[1]['elemento' + (index + 1)] = this;
		});
		$(contenedor).children(".direccion2").each(function(index) {
			xy2[2]['x' + (index + 1)] = (this.getBoundingClientRect().left + (this.getBoundingClientRect().width / 2));
			xy2[2]['y' + (index + 1)] = (this.getBoundingClientRect().top + (this.getBoundingClientRect().height / 2));
			xy2[2]['elemento' + (index + 1)] = this;
		});
		
		var xyTmp = puntoMedio(xy2[1]);
		xy2[1].x3 = xyTmp.x;
		xy2[1].y3 = xyTmp.y;
		xyTmp = puntoMedio(xy2[2]);
		xy2[2].x3 = xyTmp.x;
		xy2[2].y3 = xyTmp.y;
		
		xyTmp = trasladar({x1: moverXCara, y1: moverYCara, x2: evento.clientX, y2: evento.clientY}, (xy2[1].x3 - moverXCara), (xy2[1].y3 - moverYCara));
		var xy = distancia({x1: xy2[1].x1, y1: xy2[1].y1, x2: xyTmp.x2, y2: xyTmp.y2});
		xy2[1].d1 = xy;
		xy = distancia({x1: xy2[1].x2, y1: xy2[1].y2, x2: xyTmp.x2, y2: xyTmp.y2});
		xy2[1].d2 = xy;
		
		xyTmp = trasladar({x1: moverXCara, y1: moverYCara, x2: evento.clientX, y2: evento.clientY}, (xy2[2].x3 - moverXCara), (xy2[2].y3 - moverYCara));
		xy = distancia({x1: xy2[2].x1, y1: xy2[2].y1, x2: xyTmp.x2, y2: xyTmp.y2});
		xy2[2].d1 = xy;
		xy = distancia({x1: xy2[2].x2, y1: xy2[2].y2, x2: xyTmp.x2, y2: xyTmp.y2});
		xy2[2].d2 = xy;
		
		var xyCentro;
		var centro;
		var xyElemento;
		var elemento;
		
		if (xy2[1].d1 < xy2[1].d2 && xy2[1].d1 < xy2[2].d1 && xy2[1].d1 < xy2[2].d2) {
			xyCentro = {x: xy2[1].x2, y: xy2[1].y2};
			centro = xy2[1].elemento2;
			xyElemento = {x: xy2[1].x1, y: xy2[1].y1};
			elemento = xy2[1].elemento1;
		} else if (xy2[1].d2 < xy2[1].d1 && xy2[1].d2 < xy2[2].d1 && xy2[1].d2 < xy2[2].d2) {
			xyCentro = {x: xy2[1].x1, y: xy2[1].y1};
			centro = xy2[1].elemento1;
			xyElemento = {x: xy2[1].x2, y: xy2[1].y2};
			elemento = xy2[1].elemento2;
		} else if (xy2[2].d1 < xy2[1].d1 && xy2[2].d1 < xy2[1].d2 && xy2[2].d1 < xy2[2].d2) {
			xyCentro = {x: xy2[2].x2, y: xy2[2].y2};
			centro = xy2[2].elemento2;
			xyElemento = {x: xy2[2].x1, y: xy2[2].y1};
			elemento = xy2[2].elemento1;
		} else if (xy2[2].d2 < xy2[1].d1 && xy2[2].d2 < xy2[1].d2 && xy2[2].d2 < xy2[2].d1) {
			xyCentro = {x: xy2[2].x1, y: xy2[2].y1};
			centro = xy2[2].elemento1;
			xyElemento = {x: xy2[2].x2, y: xy2[2].y2};
			elemento = xy2[2].elemento2;
		}
		
		var matris = matrisArreglo($(centro).aplicaEstilo('transform'));
		var matris2 = matrisArreglo($(elemento).aplicaEstilo('transform'));
		
		var direccion = "";
		var valor = 0;
		
		if ($(elemento).hasClass('rotar1X')) {
			direccion = "X";
			
			if (matris[13] < matris2[13] && matris[14] == borde)
				valor = -90;
			else if (matris[13] > matris2[13] && matris[14] == borde)
				valor = 90;
			else if (matris[13] < matris2[13] && matris[14] == -borde)
				valor = 90;
			else if (matris[13] > matris2[13] && matris[14] == -borde)
				valor = -90;
			
			else if (matris[14] < matris2[14] && matris[13] == borde)
				valor = 90;
			else if (matris[14] > matris2[14] && matris[13] == borde)
				valor = -90;
			else if (matris[14] < matris2[14] && matris[13] == -borde)
				valor = -90;
			else if (matris[14] > matris2[14] && matris[13] == -borde)
				valor = 90;
		}
		if ($(elemento).hasClass('rotar1Y')) {
			direccion = "Y";
			
			if (matris[12] < matris2[12] && matris[14] == borde)
				valor = 90;
			else if (matris[12] > matris2[12] && matris[14] == borde)
				valor = -90;
			else if (matris[12] < matris2[12] && matris[14] == -borde)
				valor = -90;
			else if (matris[12] > matris2[12] && matris[14] == -borde)
				valor = 90;
			
			else if (matris[14] < matris2[14] && matris[12] == borde)
				valor = -90;
			else if (matris[14] > matris2[14] && matris[12] == borde)
				valor = 90;
			else if (matris[14] < matris2[14] && matris[12] == -borde)
				valor = 90;
			else if (matris[14] > matris2[14] && matris[12] == -borde)
				valor = -90;
		}
		if ($(elemento).hasClass('rotar1Z')) {
			direccion = "Z";
			
			if (matris[12] < matris2[12] && matris[13] == borde)
				valor = -90;
			else if (matris[12] > matris2[12] && matris[13] == borde)
				valor = 90;
			else if (matris[12] < matris2[12] && matris[13] == -borde)
				valor = 90;
			else if (matris[12] > matris2[12] && matris[13] == -borde)
				valor = -90;
			
			else if (matris[13] < matris2[13] && matris[12] == borde)
				valor = 90;
			else if (matris[13] > matris2[13] && matris[12] == borde)
				valor = -90;
			else if (matris[13] < matris2[13] && matris[12] == -borde)
				valor = -90;
			else if (matris[13] > matris2[13] && matris[12] == -borde)
				valor = 90;
		}
		
		if (direccion != "" && valor != 0)
			animar($(contenedor).children(".seleccion1, .seleccion2, .rotar1" + direccion + ", .rotar2" + direccion), direccion, valor);
	}
	
	var movimientoAleatorio = function() {
		var elemento = $(contenedor).children(".cara:eq(" + Math.floor(Math.random() * nCaras) + ")");
		seleccionar.call(elemento[0], {clientX: 0, clientY: 0});
		
		var direccion = "";
		if (Math.floor(Math.random() * 2)) {
			if ($(contenedor).children(".direccion1").hasClass("rotar1X"))
				direccion = "X";
			else if ($(contenedor).children(".direccion1").hasClass("rotar1Y"))
				direccion = "Y";
			else if ($(contenedor).children(".direccion1").hasClass("rotar1Z"))
				direccion = "Z";
		} else {
			if ($(contenedor).children(".direccion2").hasClass("rotar1X"))
				direccion = "X";
			else if ($(contenedor).children(".direccion2").hasClass("rotar1Y"))
				direccion = "Y";
			else if ($(contenedor).children(".direccion2").hasClass("rotar1Z"))
				direccion = "Z";
		}
		var valor = Math.floor(Math.random() * 2) ? 90 : -90;
		animar($(contenedor).children(".seleccion1, .seleccion2, .rotar1" + direccion + ", .rotar2" + direccion), direccion, valor);
	}
	
	var automatico = function(valor) {
		if (bloqueo2 || bloqueo || expandido)
			return;
		bloqueo = true;
		movimientos = valor;
		if (matris45 != $(contenedor).aplicaEstilo('transform')) {
			rotarX = -45;
			rotarY = -45;
			escalar = 1;
			$(contenedor).aplicaEstilo('transition-property', "transform", true).aplicaEstilo('transition-duration', "500ms").aplicaEstilo('transition-timing-function', "linear");
			$(contenedor).bind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd", function(evento) {
				evento.stopPropagation();
				$(contenedor).unbind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd");
				$(contenedor).aplicaEstilo('transition-property', "none", true).aplicaEstilo('transition-duration', "none").aplicaEstilo('transition-timing-function', "none");
				setTimeout(function() {
					if (matris45 == "")
						matris45 = $(contenedor).aplicaEstilo('transform');
					movimientoAleatorio();
				}, 500);
			});
			refrescar();
		} else
			movimientoAleatorio();
	}
	
	var refrescar = function() {
		$(contenedor).aplicaEstilo('transform', 'rotateX(' + rotarX + 'deg) rotateY(' + rotarY + 'deg) scale3d(' + escalar + ', ' + escalar + ', ' + escalar + ')');
	}
	
	var eventoEscalar = function(evento) {
		if (!bloqueo2 && !bloqueo) {
			escalar += (evento.deltaY * 0.05);
			refrescar();
		}
	}
	
	var eventoTocarRotacion = function(evento) {
		if (!bloqueo2 && !bloqueo) {
			moverX = evento.clientX;
			moverY = evento.clientY;
			mover = true;
			moverCara = false;
		}
	}
	
	var eventoTocarCara = function(evento) {
		$("#log").html("eventoTocarCara " + evento.clientX);
		if (!bloqueo2 && !bloqueo) {
			seleccionar.call(this, evento);
			/*if (typeof(evento.clientX) == "number")
				$('.cara[cara="' + $(this).attr('cara') + '"]').not(this).trigger(('ontouchstart' in window) ? "touchstart" : "mousedown");*/
			moverCara = true;
			mover = false;
		}
	}
	
	var eventoMover = function(evento) {
		if (mover) {
			rotarX -= (evento.clientY - moverY);
			rotarY += (evento.clientX - moverX);
			moverX = evento.clientX;
			moverY = evento.clientY;
			refrescar();
		}
	}
	
	var eventoSoltarRotacion = function(evento) {
		mover = false;
	}
	
	var eventoSoltarCara = function(evento) {
		if (!bloqueo2 && !bloqueo && moverCara) {
			girar(evento);
			moverCara = false;
		}
	}
	
	var eventoTouchMove = function(evento) {
		if (evento.originalEvent.touches.length == 1)
			eventoMover.call(this, evento.originalEvent.touches[0]);
		else if (evento.originalEvent.touches.length == 2) {
			evento.originalEvent.touches[1].deltaY = 0;
			var distanciaSTmp = distancia({x1: evento.originalEvent.touches[0].clientX, y1: evento.originalEvent.touches[0].clientY, x2: evento.originalEvent.touches[1].clientX, y2: evento.originalEvent.touches[1].clientY});
			if (distanciaSTmp < distanciaS)
				evento.originalEvent.touches[1].deltaY = -1;
			else if (distanciaSTmp > distanciaS)
				evento.originalEvent.touches[1].deltaY = 1;
			distanciaS = distanciaSTmp;
			eventoEscalar.call(this, evento.originalEvent.touches[1]);
		}
	}
	
	var creaEventos = function() {
		if ('ontouchstart' in window) {
			/*$(rotacion).touchstart(function(evento) {
				evento.preventDefault();
				if (evento.originalEvent.touches.length == 1)
					eventoTocarRotacion.call(this, evento.originalEvent.touches[0]);
				else if (evento.originalEvent.touches.length == 2) {
					mover = false;
					moverCara = false;
					distanciaS = distancia({x1: evento.originalEvent.touches[0].clientX, y1: evento.originalEvent.touches[0].clientY, x2: evento.originalEvent.touches[1].clientX, y2: evento.originalEvent.touches[1].clientY});
				}
			});*/
			$(contenedor).children(".cara").touchstart(function(evento) {
				evento.preventDefault();
				$("#log").html("touchstart " + evento.originalEvent.touches.length);
				if (typeof(evento.originalEvent) == "undefined") {
					//eventoTocarCara.call(this, {clientX: "0", clientY: "0"});
				} else if (evento.originalEvent.touches.length == 1) {
					eventoTocarCara.call(this, evento.originalEvent.touches[0]);
				} else if (evento.originalEvent.touches.length == 2) {
					//mover = false;
					//moverCara = false;
					//distanciaS = distancia({x1: evento.originalEvent.touches[0].clientX, y1: evento.originalEvent.touches[0].clientY, x2: evento.originalEvent.touches[1].clientX, y2: evento.originalEvent.touches[1].clientY});
				}
				//caraEventoTouchStart = evento;
				$("#log").html("touchstart termino " + evento.originalEvent.touches[0].clientX);
			});
			/*$(rotacion).touchmove(function(evento) {
				evento.preventDefault();
				eventoTouchMove.call(this, evento);
			});*/
			$(contenedor).children(".cara").touchmove(function(evento) {
				evento.preventDefault();
				$("#log").html("touchmove " + evento.originalEvent.touches.length);
				//eventoTouchMove.call(this, evento);
			});
			/*$(rotacion).touchend(function(evento) {
				evento.preventDefault();
				if (evento.originalEvent.touches.length == 0) {
					eventoSoltarCara.call(this, evento.originalEvent.changedTouches[0]);
					eventoSoltarRotacion.call(this, evento.originalEvent.changedTouches[0]);
				} else if (evento.originalEvent.touches.length == 1)
					eventoTocarRotacion.call(this, evento.originalEvent.touches[0]);
			});*/
			$(contenedor).children(".cara").touchend(function(evento) {
				evento.preventDefault();
				$("#log").html("touchend " + evento.originalEvent.changedTouches.length);
				/*if (evento.originalEvent.touches.length == 0) {
					alert(456);
					eventoSoltarRotacion.call(this, evento.originalEvent.changedTouches[0]);
					alert(789);
					eventoSoltarCara.call(this, evento.originalEvent.changedTouches[0]);
					alert(0);
				} else if (evento.originalEvent.touches.length == 1)
					eventoTocarRotacion.call(this, evento.originalEvent.touches[0]);*/
			});
		} else {
			$(rotacion).mousewheel(function(evento) {
				evento.preventDefault();
				eventoEscalar.call(this, evento);
			
			});
			$(contenedor).children(".cara").mousewheel(function(evento) {
				evento.preventDefault();
				eventoEscalar.call(this, evento);
			
			});
			$(rotacion).mousedown(function(evento) {
				evento.preventDefault();
				eventoTocarRotacion.call(this, evento);
			});
			$(contenedor).children(".cara").mousedown(function(evento) {
				evento.preventDefault();
				eventoTocarCara.call(this, evento);
			});
			$(rotacion).mousemove(function(evento) {
				evento.preventDefault();
				eventoMover.call(this, evento);
			});
			$(contenedor).children(".cara").mousemove(function(evento) {
				evento.preventDefault();
				eventoMover.call(this, evento);
			});
			$(rotacion).mouseup(function(evento) {
				evento.preventDefault();
				eventoSoltarCara.call(this, evento);
				eventoSoltarRotacion.call(this, evento);
			});
			$(contenedor).children(".cara").mouseup(function(evento) {
				evento.preventDefault();
				eventoSoltarRotacion.call(this, evento);
				eventoSoltarCara.call(this, evento);
			});
		}
	}
	
	var crear = function() {
		var tamanoTmp = (($(area).width() < $(area).height()) ? $(area).width() : $(area).height()) / 8;
		tamanoContenedor = tamanoTmp * 4;
		$(area).append('<div style="width: ' + tamanoContenedor + 'px; height: ' + tamanoContenedor + 'px; margin: ' + (tamanoTmp * 2) + 'px; border: 0px; padding: 0px;"></div>');
		contenedor = $(area).children()[0];
		$(contenedor).aplicaEstilo('transform-style', "preserve-3d");
		
		var numeroZ = numero / 2;
		var numeroXY = numeroZ - 0.5;
		tamanoCr = tamanoContenedor / numero;
		var tamanoCr2 = tamanoCr / 2;
		borde = tamanoContenedor / 2;
		var posicionCentro = borde - tamanoCr2;
		var lado = 0;
		
		for (var n = 0; n < 3; n++)
			for (var z = -numeroZ; z <= numeroZ; z += (numeroZ * 2)) {
				lado++;
				for (var y = -numeroXY; y <= numeroXY; y++)
					for (var x = -numeroXY; x <= numeroXY; x++) {
						$(contenedor).append('<div class="cara lado' + lado + '" style="left: ' + posicionCentro + 'px; top: ' + posicionCentro + 'px; width: ' + tamanoCr + 'px; height: ' + tamanoCr + 'px; margin: 0px; border: 0px; padding: 0px; position: absolute;"></div>');
						$(contenedor).children(".cara").last().aplicaEstilo('transform', (n == 1 ? 'rotateY(90deg) ' : (n == 2 ? 'rotateX(90deg) ' : '')) + 'translateX(' + ((x * tamanoCr) + (x * anchoBorde)) + 'px) translateY(' + ((y * tamanoCr) + (y * anchoBorde)) + 'px) translateZ(' + ((z * tamanoCr) + (z * anchoBorde)) + 'px)' + (z == -numeroZ ? ' rotateX(180deg)' : ''));
					}
			}
		
		borde += ((anchoBorde / 2) * numero);
		borde2 = borde - (tamanoCr2 + ((anchoBorde / 2)));
		
		borde = Number(borde.toFixed(0));
		borde2 = Number(borde2.toFixed(0));
		
		$(contenedor).children(".cara").each(function(index) {
			var matris = matrisArreglo($(this).aplicaEstilo('transform'));
			var color = "";
			if (matris[12] == borde)
				color = "red";
			else if (matris[12] == -borde)
				color = "green";
			else if (matris[13] == borde)
				color = "blue";
			else if (matris[13] == -borde)
				color = "yellow";
			else if (matris[14] == borde)
				color = "orange";
			else if (matris[14] == -borde)
				color = "white";
			if (desarrollo || color == "")
				color = "gray";
			$(this).attr('color', color).aplicaEstilo('background-color', color).aplicaEstilo('border', "3px solid black").aplicaEstilo('border-radius', "9px").aplicaEstilo('backface-visibility', "hidden");
			if (desarrollo)
				$(this).html(index);
		});
		
		nCaras = $(contenedor).children(".cara").length;
		
		if (typeof(rotacion) == "undefined")
			rotacion = area;
		
		creaEventos();
	}
	
	this.eliminaEventos = function() {
		if ('ontouchstart' in window) {
			$(rotacion).unbind('touchstart');
			$(contenedor).children(".cara").unbind('touchstart');
			$(rotacion).unbind('touchmove');
			$(contenedor).children(".cara").unbind('touchmove');
			$(rotacion).unbind('touchend');
			$(contenedor).children(".cara").unbind('touchend');
		} else {
			$(rotacion).unbind('mousewheel');
			$(contenedor).children(".cara").unbind('mousewheel');
			$(rotacion).unbind('mousedown');
			$(contenedor).children(".cara").unbind('mousedown');
			$(rotacion).unbind('mousemove');
			$(contenedor).children(".cara").unbind('mousemove');
			$(rotacion).unbind('mouseup');
			$(contenedor).children(".cara").unbind('mouseup');
		}
	}
	
	this.refrescarEventos = function() {
		creaEventos();
	}
	
	this.lado = function(valor) {
		if (bloqueo2 || bloqueo)
			return;
		
		bloqueo = true;
		if (typeof(valor) != "string")
			valor = "ad";
		switch (valor) {
			case 'ab':
				rotarX += 90;
				break;
			case 'ar':
				rotarX += -90;
				break;
			case 'de':
				rotarY += -90;
				break;
			case 'iz':
				rotarY += 90;
				break;
			case 'at':
				rotarX += -180;
				break;
		}
		escalar = 1;
		$(contenedor).aplicaEstilo('transition-property', "transform", true).aplicaEstilo('transition-duration', "1000ms").aplicaEstilo('transition-timing-function', "linear");
		$(contenedor).bind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd", function(evento) {
			evento.stopPropagation();
			$(contenedor).unbind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd");
			$(contenedor).aplicaEstilo('transition-property', "none", true).aplicaEstilo('transition-duration', "none").aplicaEstilo('transition-timing-function', "none");
			bloqueo = false;
		});
		refrescar();
	}
	
	this.perspectiva = function(valor) {
		if (valor)
			$(area).aplicaEstilo('perspective-origin:', "50% 50%").aplicaEstilo('perspective', (tamanoContenedor * 2) + "px");
		else
			$(area).aplicaEstilo('perspective-origin:', "").aplicaEstilo('perspective', "");
	}
	
	this.aleatorio = function() {
		automatico(Math.floor((Math.random() * nCaras) + 1));
	}
	
	this.memoria = function(valor) {
		automatico(valor);
	}
	
	this.expandir = function(valor) {
		if (bloqueo2 || bloqueo || expandido)
			return;
		
		bloqueo = true;
		expandido = true;
		
		var valorBorde = borde * valor;
		var valorEscalar = escalar * valor;
		
		$(contenedor).children(".cara").each(function() {
			$(this).attr('valorInicialTS', $(this).aplicaEstilo('transform'));
		});
		$(contenedor).children(".cara").aplicaEstilo('transition-property', "transform", true).aplicaEstilo('transition-duration', "250ms").aplicaEstilo('transition-timing-function', "linear");
		$(contenedor).children(".cara").bind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd", function(evento) {
			evento.stopPropagation();
			$(contenedor).children(".cara").unbind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd");
			$(contenedor).children(".cara").aplicaEstilo('transition-property', "none", true).aplicaEstilo('transition-duration', "none").aplicaEstilo('transition-timing-function', "none");
			setTimeout(function() {
				bloqueo = false;
			}, 100);
		});
		$(contenedor).children(".cara").each(function() {
			var matris = matrisArreglo($(this).attr('valorInicialTS'));
			if (matris[14] == borde)
				$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (matris[12] * valor) + "px) translateY(" + (matris[13] * valor) + "px) translateZ(" + valorBorde + "px) scale3d(" + valorEscalar + ", " + valorEscalar + ", " + valorEscalar + ")");
			else if (matris[14] == -borde)
				$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (matris[12] * valor) + "px) translateY(" + (-matris[13] * valor) + "px) translateZ(" + valorBorde + "px) scale3d(" + valorEscalar + ", " + valorEscalar + ", " + valorEscalar + ")");
			else if (matris[13] == borde)
				$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (matris[12] * valor) + "px) translateY(" + (-matris[14] * valor) + "px) translateZ(" + valorBorde + "px) scale3d(" + valorEscalar + ", " + valorEscalar + ", " + valorEscalar + ")");
			else if (matris[13] == -borde)
				$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (matris[12] * valor) + "px) translateY(" + (matris[14] * valor) + "px) translateZ(" + valorBorde + "px) scale3d(" + valorEscalar + ", " + valorEscalar + ", " + valorEscalar + ")");
			else if (matris[12] == borde)
				$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (-matris[14] * valor) + "px) translateY(" + (matris[13] * valor) + "px) translateZ(" + valorBorde + "px) scale3d(" + valorEscalar + ", " + valorEscalar + ", " + valorEscalar + ")");
			else if (matris[12] == -borde)
				$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (-matris[14] * valor) + "px) translateY(" + (-matris[13] * valor) + "px) translateZ(" + valorBorde + "px) scale3d(" + valorEscalar + ", " + valorEscalar + ", " + valorEscalar + ")");
		});
	}
	
	this.contraer = function(valor) {
		if (bloqueo2 || bloqueo || !expandido)
			return;
		
		bloqueo = true;
		
		var valorBorde = borde * valor;
		var valorEscalar = escalar * valor;
		
		$(contenedor).children(".cara").aplicaEstilo('transition-property', "transform", true).aplicaEstilo('transition-duration', "250ms").aplicaEstilo('transition-timing-function', "linear");
		$(contenedor).children(".cara").bind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd", function(evento) {
			evento.stopPropagation();
			$(contenedor).children(".cara").unbind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd");
			$(contenedor).children(".cara").aplicaEstilo('transition-property', "none", true).aplicaEstilo('transition-duration', "none").aplicaEstilo('transition-timing-function', "none");
			setTimeout(function() {
				expandido = false;
				bloqueo = false;
			}, 100);
		});
		$(contenedor).children(".cara").each(function() {
			$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS'));
		});
	}
	
	this.ligarCaras = function() {
		if (!$(contenedor).children(".cara[cara]").length) {
			$(contenedor).children(".cara").each(function(index) {
				$(this).attr('cara', index);
			});
		}
	}
	
	this.desligarCaras = function() {
		if ($(contenedor).children(".cara[cara]").length) {
			$(contenedor).children(".cara").each(function(index) {
				$(this).removeAttr('cara');
			});
		}
	}
	
	crear();
}
