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

function Rubik(areaInicial, numeroInicial, rotacionInicial, funcionGiroInicial, funcionCompletoInicial, funcionAutoCompletoInicial) {
	var desarrollo = false;
	
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
	var funcionAutoCompleto = funcionAutoCompletoInicial;
	
	var nCaras;
	var movimientos = 0;
	
	var matris45 = "";
	
	var contenedores = Array();
	
	var giros = Array();
	var detener = false;
	
	var matrisArreglo = function(matris) {
		if (typeof(matris) != "string")
			return Array();
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
				$(contenedores).children(".seleccion1, .seleccion2, .rotar1X, .rotar1Y, .rotar1Z, .rotar2X, .rotar2Y, .rotar2Z, .direccion1, .direccion2").each(function() {
					$(this).aplicaEstilo('background-color', $(this).attr('color'));
				});
			$(contenedores).children(".seleccion1").removeClass("seleccion1");
			$(contenedores).children(".seleccion2").removeClass("seleccion2");
			$(contenedores).children(".rotar1X").removeClass("rotar1X");
			$(contenedores).children(".rotar1Y").removeClass("rotar1Y");
			$(contenedores).children(".rotar1Z").removeClass("rotar1Z");
			$(contenedores).children(".rotar2X").removeClass("rotar2X");
			$(contenedores).children(".rotar2Y").removeClass("rotar2Y");
			$(contenedores).children(".rotar2Z").removeClass("rotar2Z");
			$(contenedores).children(".direccion1").removeClass("direccion1");
			$(contenedores).children(".direccion2").removeClass("direccion2");
			seleccion = false;
		}
	}
	
	var animar = function(elementos, rotar, valorRotacion) {
		$(contenedores).attr("bloqueo2", 1);
		
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
				this.valor = 0;
				
				var caras = {};
				
				$(elementos).each(function() {
					caras[$(this).attr('cara')] = true;
					$(this).aplicaEstilo('transform', "rotate" + rotar + "(" + valorRotacion + "deg) " + $(this).attr('valorInicial'));
				});
				
				giros.push({'cara': $(".seleccion1").attr('cara'), 'caras': caras, 'rotar': rotar, 'valorRotacion': valorRotacion});
				
				limpiaSeleccion();
				
				var completo = true;
				var indice;
				var bordeTmp;
	
				for (var i = 1; i <= 6; i++) {
					$(contenedor).children(".lado" + i).each(function(index) {
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
				
				if (movimientos && !completo && Number($(contenedor).attr("bloqueo")))
					movimientos--;
				
				if (movimientos)
					setTimeout(movimientoAleatorio, 100);
				else
					setTimeout(function() {
						if (!Number($(contenedor).attr("bloqueo")))
							if (typeof(funcionGiro) == "function")
								funcionGiro(giros[giros.length - 1]);
						if (completo)
							if (typeof(funcionCompleto) == "function")
								funcionCompleto();
						if (Number($(contenedor).attr("bloqueo")))
							if (typeof(funcionAutoCompleto) == "function")
								funcionAutoCompleto(giros);
						$(contenedores).attr("bloqueo", 0);
						$(contenedores).attr("bloqueo2", 0);
					}, 100);
			},
			duration: 500
		});
	}
	
	var refrescar = function() {
		$(contenedor).aplicaEstilo('transform', 'rotateX(' + rotarX + 'deg) rotateY(' + rotarY + 'deg) scale3d(' + escalar + ', ' + escalar + ', ' + escalar + ')');
	}
	
	var seleccionar = function(evento) {
		moverXCara = evento.clientX;
		moverYCara = evento.clientY;
		
		limpiaSeleccion();
		
		var matrises = Array();
		$(contenedores).children(".cara").each(function(index) {
			matrises[$(this).attr('cara')] = matrisArreglo($(this).aplicaEstilo('transform'));
		});
		
		var matris = matrises[$(this).attr('cara')];
		$(this).addClass("seleccion1");
		if (desarrollo)
			$(contenedores).children(".seleccion1").aplicaEstilo('background-color', "green");
		//
		$(contenedores).children(".cara:not(.seleccion1)").filter(function() {
			var matris2 = matrises[$(this).attr('cara')];
			if ((matris[12] == matris2[12] && matris[13] == matris2[13] && (matris[14] == borde || matris[14] == -borde) && (matris2[14] == borde || matris2[14] == -borde))
			|| (matris[12] == matris2[12] && matris[14] == matris2[14] && (matris[13] == borde || matris[13] == -borde) && (matris2[13] == borde || matris2[13] == -borde))
			|| (matris[13] == matris2[13] && matris[14] == matris2[14] && (matris[12] == borde || matris[12] == -borde) && (matris2[12] == borde || matris2[12] == -borde)))
				return true;
			return false;
		}).addClass("seleccion2");
		if (desarrollo)
			$(contenedores).children(".seleccion2").aplicaEstilo('background-color', 'red');
		//
		$(contenedores).children(".cara:not(.seleccion1, .seleccion2)").filter(function() {
			var matris2 = matrises[$(this).attr('cara')];
			if (matris2[12] == matris[12] && matris[12] != borde && matris[12] != -borde)
				return true;
			return false;
		}).addClass("rotar1X");
		if (desarrollo)
			$(contenedores).children(".rotar1X").aplicaEstilo('background-color', 'yellow');
		//
		$(contenedores).children(".cara:not(.seleccion1, .seleccion2, .rotar1X)").filter(function() {
			var matris2 = matrises[$(this).attr('cara')];
			if (matris2[13] == matris[13] && matris[13] != borde && matris[13] != -borde)
				return true;
			return false;
		}).addClass("rotar1Y");
		if (desarrollo)
			$(contenedores).children(".rotar1Y").aplicaEstilo('background-color', 'khaki');
		//
		$(contenedores).children(".cara:not(.seleccion1, .seleccion2, .rotar1X, .rotar1Y)").filter(function() {
			var matris2 = matrises[$(this).attr('cara')];
			if (matris2[14] == matris[14] && matris[14] != borde && matris[14] != -borde)
				return true;
			return false;
		}).addClass("rotar1Z");
		if (desarrollo)
			$(contenedores).children(".rotar1Z").aplicaEstilo('background-color', 'orange');
		//
		$(contenedores).children(".cara:not(.seleccion1, .seleccion2, .rotar1X)").filter(function() {
			var matris2 = matrises[$(this).attr('cara')];
			if (matris[12] == borde2 || matris[12] == -borde2)
				if ((matris2[12] == borde) || (matris2[12] == -borde))
					if ((matris[12] <= 0 && matris2[12] <= 0) || (matris[12] >= 0 && matris2[12] >= 0))
						return true;
			return false;
		}).addClass("rotar2X");
		if (desarrollo)
			$(contenedores).children(".rotar2X").aplicaEstilo('background-color', 'gold');
		//
		$(contenedores).children(".cara:not(.seleccion1, .seleccion2, .rotar1Y)").filter(function() {
			var matris2 = matrises[$(this).attr('cara')];
			if (matris[13] == borde2 || matris[13] == -borde2)
				if ((matris2[13] == borde) || (matris2[13] == -borde))
					if ((matris[13] <= 0 && matris2[13] <= 0) || (matris[13] >= 0 && matris2[13] >= 0))
						return true;
			return false;
		}).addClass("rotar2Y");
		if (desarrollo)
			$(contenedores).children(".rotar2Y").aplicaEstilo('background-color', 'darkkhaki');
		//
		$(contenedores).children(".cara:not(.seleccion1, .seleccion2, .rotar1Z)").filter(function() {
			var matris2 = matrises[$(this).attr('cara')];
			if (matris[14] == borde2 || matris[14] == -borde2)
				if ((matris2[14] == borde) || (matris2[14] == -borde))
					if ((matris[14] <= 0 && matris2[14] <= 0) || (matris[14] >= 0 && matris2[14] >= 0))
						return true;
			return false;
		}).addClass("rotar2Z");
		if (desarrollo)
			$(contenedores).children(".rotar2Z").aplicaEstilo('background-color', 'darkorange');
		//
		$(contenedores).children(".rotar1X, .rotar1Y, .rotar1Z").not(".seleccion1, .seleccion2, .rotar2X, .rotar2Y, .rotar2Z").filter(function() {
			var matris2 = matrises[$(this).attr('cara')];
			if ((matris2[12] == matris[12] && (matris[12] == borde || matris[12] == -borde) && (matris2[13] == matris[13]))
			|| (matris2[13] == matris[13] && (matris[13] == borde || matris[13] == -borde) && (matris2[14] == matris[14]))
			|| (matris2[14] == matris[14] && (matris[14] == borde || matris[14] == -borde) && (matris2[13] == matris[13])))
				return true;
			return false;
		}).addClass("direccion1");
		if (desarrollo)
			$(contenedores).children(".direccion1").aplicaEstilo('background-color', 'white');
		//
		$(contenedores).children(".rotar1X, .rotar1Y, .rotar1Z").not(".seleccion1, .seleccion2, .rotar2X, .rotar2Y, .rotar2Z").filter(function() {
			var matris2 = matrises[$(this).attr('cara')];
			if ((matris2[12] == matris[12] && (matris[12] == borde || matris[12] == -borde) && (matris2[14] == matris[14]))
			|| (matris2[13] == matris[13] && (matris[13] == borde || matris[13] == -borde) && (matris2[12] == matris[12]))
			|| (matris2[14] == matris[14] && (matris[14] == borde || matris[14] == -borde) && (matris2[12] == matris[12])))
				return true;
			return false;
		}).addClass("direccion2");
		if (desarrollo)
			$(contenedores).children(".direccion2").aplicaEstilo('background-color', 'black');
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
			animar($(contenedores).children(".seleccion1, .seleccion2, .rotar1" + direccion + ", .rotar2" + direccion), direccion, valor);
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
		
		if (direccion != "") {
			var valor = Math.floor(Math.random() * 2) ? 90 : -90;
			animar($(contenedores).children(".seleccion1, .seleccion2, .rotar1" + direccion + ", .rotar2" + direccion), direccion, valor);
		}
	}
	
	var automatico = function(valor, omitirMovimiento) {
		if (!omitirMovimiento) {
			if (Number($(contenedor).attr("bloqueo2")) || Number($(contenedor).attr("bloqueo")) || Number($(contenedor).attr("expandido")))
				return;
			$(contenedores).attr("bloqueo", 1);
			movimientos = valor;
		}
		if (matris45 != $(contenedor).aplicaEstilo('transform')) {
			rotarX += -45;
			rotarY += -45;
			escalar = 1;
			$(contenedor).aplicaEstilo('transition-property', "transform", true).aplicaEstilo('transition-duration', "500ms").aplicaEstilo('transition-timing-function', "linear");
			$(contenedor).bind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd", function(evento) {
				evento.stopPropagation();
				$(contenedor).unbind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd");
				$(contenedor).aplicaEstilo('transition-property', "none", true).aplicaEstilo('transition-duration', "none").aplicaEstilo('transition-timing-function', "none");
				setTimeout(function() {
					if (matris45 == "")
						matris45 = $(contenedor).aplicaEstilo('transform');
					if (!omitirMovimiento)
						movimientoAleatorio();
				}, 500);
			});
			refrescar();
		} else
			if (!omitirMovimiento)
				movimientoAleatorio();
	}
	
	var eventoEscalar = function(evento) {
		if (!Number($(contenedor).attr("bloqueo2")) && !Number($(contenedor).attr("bloqueo"))) {
			escalar += (evento.deltaY * 0.05);
			refrescar();
		}
	}
	
	var eventoTocarRotacion = function(evento) {
		if (!Number($(contenedor).attr("bloqueo2")) && !Number($(contenedor).attr("bloqueo"))) {
			moverX = evento.clientX;
			moverY = evento.clientY;
			mover = true;
			moverCara = false;
		}
	}
	
	var eventoTocarCara = function(evento) {
		if (!Number($(contenedor).attr("bloqueo2")) && !Number($(contenedor).attr("bloqueo"))) {
			var elemento = this;
			setTimeout(function() {
				seleccionar.call(elemento, evento);
			}, 0);
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
		if (moverCara) {
			moverCara = false;
			var elemento = this;
			setTimeout(function() {
				girar.call(elemento, evento);
			}, 0);
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
			$(rotacion).touchstart(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				if (evento.originalEvent.touches.length == 1)
					eventoTocarRotacion.call(this, evento.originalEvent.touches[0]);
				else if (evento.originalEvent.touches.length == 2) {
					mover = false;
					moverCara = false;
					distanciaS = distancia({x1: evento.originalEvent.touches[0].clientX, y1: evento.originalEvent.touches[0].clientY, x2: evento.originalEvent.touches[1].clientX, y2: evento.originalEvent.touches[1].clientY});
				}
			});
			$(contenedor).children(".cara").touchstart(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				if (evento.originalEvent.touches.length == 1)
					eventoTocarCara.call(this, evento.originalEvent.touches[0]);
				else if (evento.originalEvent.touches.length == 2) {
					moverCara = false;
					mover = false;
					distanciaS = distancia({x1: evento.originalEvent.touches[0].clientX, y1: evento.originalEvent.touches[0].clientY, x2: evento.originalEvent.touches[1].clientX, y2: evento.originalEvent.touches[1].clientY});
				}
			});
			$(rotacion).touchmove(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoTouchMove.call(this, evento);
			});
			$(contenedor).children(".cara").touchmove(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoTouchMove.call(this, evento);
			});
			$(rotacion).touchend(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				if (evento.originalEvent.touches.length == 0) {
					eventoSoltarCara.call(this, evento.originalEvent.changedTouches[0]);
					eventoSoltarRotacion.call(this, evento.originalEvent.changedTouches[0]);
				} else if (evento.originalEvent.touches.length == 1)
					eventoTocarRotacion.call(this, evento.originalEvent.touches[0]);
			});
			$(contenedor).children(".cara").touchend(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				if (evento.originalEvent.touches.length == 0) {
					eventoSoltarRotacion.call(this, evento.originalEvent.changedTouches[0]);
					eventoSoltarCara.call(this, evento.originalEvent.changedTouches[0]);
				} else if (evento.originalEvent.touches.length == 1)
					eventoTocarRotacion.call(this, evento.originalEvent.touches[0]);
			});
		} else {
			$(rotacion).mousewheel(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoEscalar.call(this, evento);
			});
			$(contenedor).children(".cara").mousewheel(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoEscalar.call(this, evento);
			});
			$(rotacion).mousedown(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoTocarRotacion.call(this, evento);
			});
			$(contenedor).children(".cara").mousedown(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoTocarCara.call(this, evento);
			});
			$(rotacion).mousemove(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoMover.call(this, evento);
			});
			$(contenedor).children(".cara").mousemove(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoMover.call(this, evento);
			});
			$(rotacion).mouseup(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoSoltarCara.call(this, evento);
				eventoSoltarRotacion.call(this, evento);
			});
			$(contenedor).children(".cara").mouseup(function(evento) {
				evento.stopPropagation();
				evento.preventDefault();
				eventoSoltarRotacion.call(this, evento);
				eventoSoltarCara.call(this, evento);
			});
		}
	}
	
	var crear = function() {
		var tamanoTmp = (($(area).width() < $(area).height()) ? $(area).width() : $(area).height()) / 8;
		tamanoContenedor = tamanoTmp * 4;
		$(area).append('<div style="display: inline-block; width: ' + tamanoContenedor + 'px; height: ' + tamanoContenedor + 'px; margin: 0px; border: 0px; padding: 0px;"></div>');
		contenedor = $(area).children()[0];
		contenedores.push(contenedor);
		$(contenedor).aplicaEstilo('transform-style', "preserve-3d");
		
		$(contenedor).attr("bloqueo", 0);
		$(contenedor).attr("bloqueo2", 0);
		$(contenedor).attr("expandido", 0);
		
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
			$(this).attr('cara', index).attr('color', color).aplicaEstilo('background-color', color).aplicaEstilo('border', "3px solid black").aplicaEstilo('border-radius', "9px").aplicaEstilo('backface-visibility', "hidden");
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
		//if (Number($(contenedor).attr("bloqueo2")) || Number($(contenedor).attr("bloqueo")))
		//	return;
		
		//$(contenedores).attr("bloqueo", 1);
		
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
		$(contenedor).aplicaEstilo('transition-property', "transform", true).aplicaEstilo('transition-duration', "500ms").aplicaEstilo('transition-timing-function', "linear");
		$(contenedor).bind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd", function(evento) {
			evento.stopPropagation();
			$(contenedor).unbind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd");
			$(contenedor).aplicaEstilo('transition-property', "none", true).aplicaEstilo('transition-duration', "none").aplicaEstilo('transition-timing-function', "none");
			setTimeout(function() {
				//$(contenedores).attr("bloqueo", 0);
			}, 100);
		});
		refrescar();
	}
	
	this.perspectiva = function(valor) {
		if (valor)
			$(area).aplicaEstilo('perspective-origin:', "50% 50%").aplicaEstilo('perspective', (tamanoContenedor * 2) + "px");
		else
			$(area).aplicaEstilo('perspective-origin:', "").aplicaEstilo('perspective', "");
	}
	
	this.aleatorio = function(omitir) {
		giros = Array();
		automatico(Math.floor((Math.random() * nCaras) + 1), omitir);
	}
	
	this.memoria = function(valor, omitir) {
		giros = Array();
		automatico(valor, omitir);
	}
	
	this.expandir = function(valor) {
		if (Number($(contenedor).attr("bloqueo2")) || Number($(contenedor).attr("bloqueo")) || Number($(contenedor).attr("expandido")))
			return;
		
		$(contenedores).attr("bloqueo", 1);
		$(contenedores).attr("expandido", 1);
		
		var valorBorde = borde * valor;
		var valorEscalar = escalar * valor;
		
		$(contenedores).children(".cara").each(function() {
			$(this).attr('valorInicialTS', $(this).aplicaEstilo('transform'));
		});
		$(contenedores).children(".cara").aplicaEstilo('transition-property', "transform", true).aplicaEstilo('transition-duration', "250ms").aplicaEstilo('transition-timing-function', "linear");
		$(contenedores).children(".cara").bind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd", function(evento) {
			evento.stopPropagation();
			$(contenedores).children(".cara").unbind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd");
			$(contenedores).children(".cara").aplicaEstilo('transition-property', "none", true).aplicaEstilo('transition-duration', "none").aplicaEstilo('transition-timing-function', "none");
			setTimeout(function() {
				$(contenedores).attr("bloqueo", 0);
			}, 100);
		});
		$(contenedores).children(".cara").each(function() {
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
		if (Number($(contenedor).attr("bloqueo2")) || Number($(contenedor).attr("bloqueo")) || !Number($(contenedor).attr("expandido")))
			return;
		
		$(contenedores).attr("bloqueo", 1);
		
		var valorBorde = borde * valor;
		var valorEscalar = escalar * valor;
		
		$(contenedores).children(".cara").aplicaEstilo('transition-property', "transform", true).aplicaEstilo('transition-duration', "250ms").aplicaEstilo('transition-timing-function', "linear");
		$(contenedores).children(".cara").bind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd", function(evento) {
			evento.stopPropagation();
			$(contenedores).children(".cara").unbind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd");
			$(contenedores).children(".cara").aplicaEstilo('transition-property', "none", true).aplicaEstilo('transition-duration', "none").aplicaEstilo('transition-timing-function', "none");
			setTimeout(function() {
				$(contenedores).attr("expandido", 0);
				$(contenedores).attr("bloqueo", 0);
			}, 100);
		});
		$(contenedores).children(".cara").each(function() {
			$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS'));
		});
	}
	
	this.Expandido = function() {
		return Number($(contenedor).attr("expandido"));
	}
	
	this.Contenedor = function() {
		return contenedor;
	}
	
	this.ligarCaras = function(cubo) {
		if (Number($(contenedor).attr("bloqueo2")) || Number($(contenedor).attr("bloqueo")) || Number($(contenedor).attr("expandido")))
			return;
		
		var agregar = true;
		for (var i = 0; i < contenedores.length; i++)
			if ($(contenedores[i]).is(cubo)) {
				agregar = false;
				break;
			}
		
		if (agregar)
			contenedores.push(cubo);
	}
	
	this.desligarCaras = function(cubo) {
		if (Number($(contenedor).attr("bloqueo2")) || Number($(contenedor).attr("bloqueo")) || Number($(contenedor).attr("expandido")))
			return;
		
		for (var i = 0; i < contenedores.length; i++)
			if ($(contenedores[i]).is(cubo)) {
				contenedores.splice(i, 1);
				break;
			}
	}
	
	this.Animar = function(elementos, rotar, valorRotacion) {
		$(contenedores).attr("bloqueo", 1);
		animar(elementos, rotar, valorRotacion);
	}
	
	this.presentacion = function(funcionPresentacion) {
		$(contenedor).aplicaEstilo('transition-property', "transform", true).aplicaEstilo('transition-duration', "1500ms").aplicaEstilo('transition-timing-function', "linear");
		$(contenedor).bind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd", function(evento) {
			evento.stopPropagation();
			if (!detener) {
				switch (Math.floor(Math.random() * 4)) {
					case 0:
						rotarX += 90;
						break;
					case 1:
						rotarX += -90;
						break;
					case 1:
						rotarY += -90;
						break;
					default:
						rotarY += 90;
				}
		
				refrescar();
			} else
				detener = false;
		});
		
		switch (Math.floor(Math.random() * 4)) {
			case 0:
				rotarX += 90;
				break;
			case 1:
				rotarX += -90;
				break;
			case 1:
				rotarY += -90;
				break;
			default:
				rotarY += 90;
		}
		
		refrescar();
	}
	
	this.detenerPresentacion = function(funcionPresentacion) {
		detener = true;
		$(contenedor).unbind("transitionend mozTransitionEnd msTransitionEnd oTransitionEnd webkitTransitionEnd");
		$(contenedor).aplicaEstilo('transition-property', "none", true).aplicaEstilo('transition-duration', "none").aplicaEstilo('transition-timing-function', "none");
		rotarX = 0;
		rotarY = 0;
		refrescar();
	}
	
	crear();
}
