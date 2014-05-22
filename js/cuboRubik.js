function rangoValor(inicio, fin, actual, maximo) {
	var tmp = fin - inicio;
	tmp = (actual * tmp) / maximo;
	tmp += inicio;
	return tmp;
}

function matrisArreglo(matris) {
	var tmp = matris.substring((matris.indexOf('(') + 1), matris.indexOf(')')).split(", "); //x 12 y 13 z 14
	for (var i = 0; i < tmp.length; i++)
		tmp[i] = Number(tmp[i]);
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

$.fn.aplicaEstilo = function(nombre, valor) {
	if (typeof(valor) != "undefined")
		return $(this).css(nombre, valor).css('-moz-' + nombre, valor).css('-ms-' + nombre, valor).css('-o-' + nombre, valor).css('-webkit-' + nombre, valor);
	else
		return $(this).css(nombre) || $(this).css('-moz-' + nombre) || $(this).css('-ms-' + nombre) || $(this).css('-o-' + nombre) || $(this).css('-webkit-' + nombre);
}

$.fn.disableSelection = function() {
	return this.attr('unselectable', 'on').aplicaEstilo('user-select', 'none').on('selectstart', false);
};

$.fn.esVisible = function() {
	return $(document.elementFromPoint((this.context.getBoundingClientRect().left + (this.context.getBoundingClientRect().width / 2)), (this.context.getBoundingClientRect().top + (this.context.getBoundingClientRect().height / 2)))).is(this);
}

function Rubik(areaInicial, numeroInicial, rotacionInicial, funcionGiroInicial, funcionCompletoInicial) {
	var desarrollo = false;
	
	var tamanoContenedor;
	var contenedor;
	
	var tamanoCr;
	
	var escalar = 1;
	
	var moverX = 0;
	var moverY = 0;
	var mover = false;
	var rotarX = 0;
	var rotarY = 0;
	
	var moverXCara = 0;
	var moverYCara = 0;
	
	var anchoBorde = 3;
	var borde;
	var borde2;
	
	var seleccion = false;
	
	var area = areaInicial;
	var numero = numeroInicial;
	var rotacion = rotacionInicial;
	var funcionCompleto = funcionCompletoInicial;
	var funcionGiro = funcionGiroInicial;
	
	var nCaras;
	var movimientos = 0;
	var bloqueo = false;
	
	var limpiaSeleccion = function() {
		if (seleccion) {
			if (desarrollo)
				$(".seleccion1, .seleccion2, .rotar1X, .rotar1Y, .rotar1Z, .rotar2X, .rotar2Y, .rotar2Z, .direccion1, .direccion2").each(function(index) {
					$(this).aplicaEstilo('background-color', $(this).attr('color'));
				});
			$(".seleccion1").removeClass("seleccion1");
			$(".seleccion2").removeClass("seleccion2");
			$(".rotar1X").removeClass("rotar1X");
			$(".rotar1Y").removeClass("rotar1Y");
			$(".rotar1Z").removeClass("rotar1Z");
			$(".rotar2X").removeClass("rotar2X");
			$(".rotar2Y").removeClass("rotar2Y");
			$(".rotar2Z").removeClass("rotar2Z");
			$(".direccion1").removeClass("direccion1");
			$(".direccion2").removeClass("direccion2");
			seleccion = false;
		}
	}
	
	var animar = function(elementos, rotar, valorRotacion) {
		$(contenedor).animate({ valor: valorRotacion }, {
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
							}
							if (matris[12] == -borde) {
								indice = 12;
								bordeTmp = -borde;
							}
							if (matris[13] == borde) {
								indice = 13;
								bordeTmp = borde;
							}
							if (matris[13] == -borde) {
								indice = 13;
								bordeTmp = -borde;
							}
							if (matris[13] == borde) {
								indice = 13;
								bordeTmp = borde;
							}
							if (matris[13] == -borde) {
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
				
				if (completo && bloqueo)
					movimientos++;
				
				if (movimientos)
					movimientoAleatorio();
				else {
					if (!bloqueo)
						if (typeof(funcionGiro) == "function")
							funcionGiro();
					bloqueo = false;
					if (completo)
						if (typeof(funcionCompleto) == "function")
							funcionCompleto();
				}
			},
			duration: 250
		});
	}
	
	var seleccionar = function(event, obj) {
		moverXCara = event.clientX;
		moverYCara = event.clientY;
		
		limpiaSeleccion();
		
		var matris = matrisArreglo($(obj).aplicaEstilo('transform'));
		//
		$(obj).addClass("seleccion1");
		if (desarrollo)
			$(".seleccion1").aplicaEstilo('background-color', "green");
		//
		$(".cara:not(.seleccion1)").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if ((matris[12] == matris2[12] && matris[13] == matris2[13] && (matris[14] == borde || matris[14] == -borde) && (matris2[14] == borde || matris2[14] == -borde))
			|| (matris[12] == matris2[12] && matris[14] == matris2[14] && (matris[13] == borde || matris[13] == -borde) && (matris2[13] == borde || matris2[13] == -borde))
			|| (matris[13] == matris2[13] && matris[14] == matris2[14] && (matris[12] == borde || matris[12] == -borde) && (matris2[12] == borde || matris2[12] == -borde)))
				return true;
			return false;
		}).addClass("seleccion2");
		if (desarrollo)
			$(".seleccion2").aplicaEstilo('background-color', 'red');
		//
		$(".cara:not(.seleccion1, .seleccion2)").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris2[12] == matris[12] && matris[12] != borde && matris[12] != -borde)
				return true;
			return false;
		}).addClass("rotar1X");
		if (desarrollo)
			$(".rotar1X").aplicaEstilo('background-color', 'yellow');
		//
		$(".cara:not(.seleccion1, .seleccion2)").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris2[13] == matris[13] && matris[13] != borde && matris[13] != -borde)
				return true;
			return false;
		}).addClass("rotar1Y");
		if (desarrollo)
			$(".rotar1Y").aplicaEstilo('background-color', 'khaki');
		//
		$(".cara:not(.seleccion1, .seleccion2)").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris2[14] == matris[14] && matris[14] != borde && matris[14] != -borde)
				return true;
			return false;
		}).addClass("rotar1Z");
		if (desarrollo)
			$(".rotar1Z").aplicaEstilo('background-color', 'orange');
		//
		$(".cara").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris[12] == borde2 || matris[12] == -borde2)
				if ((matris2[12] == borde) || (matris2[12] == -borde))
					if ((matris[12] <= 0 && matris2[12] <= 0) || (matris[12] >= 0 && matris2[12] >= 0))
						return true;
			return false;
		}).addClass("rotar2X");
		if (desarrollo)
			$(".rotar2X").aplicaEstilo('background-color', 'gold');
		//
		$(".cara").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris[13] == borde2 || matris[13] == -borde2)
				if ((matris2[13] == borde) || (matris2[13] == -borde))
					if ((matris[13] <= 0 && matris2[13] <= 0) || (matris[13] >= 0 && matris2[13] >= 0))
						return true;
			return false;
		}).addClass("rotar2Y");
		if (desarrollo)
			$(".rotar2Y").aplicaEstilo('background-color', 'darkkhaki');
		//
		$(".cara").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if (matris[14] == borde2 || matris[14] == -borde2)
				if ((matris2[14] == borde) || (matris2[14] == -borde))
					if ((matris[14] <= 0 && matris2[14] <= 0) || (matris[14] >= 0 && matris2[14] >= 0))
						return true;
			return false;
		}).addClass("rotar2Z");
		if (desarrollo)
			$(".rotar2Z").aplicaEstilo('background-color', 'darkorange');
		//
		$(".rotar1X, .rotar1Y, .rotar1Z").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if ((matris2[12] == matris[12] && (matris[12] == borde || matris[12] == -borde) && (matris2[13] == matris[13]))
			|| (matris2[13] == matris[13] && (matris[13] == borde || matris[13] == -borde) && (matris2[14] == matris[14]))
			|| (matris2[14] == matris[14] && (matris[14] == borde || matris[14] == -borde) && (matris2[13] == matris[13])))
				return true;
			return false;
		}).addClass("direccion1");
		if (desarrollo)
			$(".direccion1").aplicaEstilo('background-color', 'white');
		//
		$(".rotar1X, .rotar1Y, .rotar1Z").filter(function() {
			var matris2 = matrisArreglo($(this).aplicaEstilo('transform'));
			if ((matris2[12] == matris[12] && (matris[12] == borde || matris[12] == -borde) && (matris2[14] == matris[14]))
			|| (matris2[13] == matris[13] && (matris[13] == borde || matris[13] == -borde) && (matris2[12] == matris[12]))
			|| (matris2[14] == matris[14] && (matris[14] == borde || matris[14] == -borde) && (matris2[12] == matris[12])))
				return true;
			return false;
		}).addClass("direccion2");
		if (desarrollo)
			$(".direccion2").aplicaEstilo('background-color', 'black');
		//
		seleccion = true;
	}
	
	var girar = function(event) {
		var xy2 = {1: {}, 2: {}};
		$(".direccion1").each(function(index) {
			xy2[1]['x' + (index + 1)] = (this.getBoundingClientRect().left + (this.getBoundingClientRect().width / 2));
			xy2[1]['y' + (index + 1)] = (this.getBoundingClientRect().top + (this.getBoundingClientRect().height / 2));
			xy2[1]['elemento' + (index + 1)] = this;
		});
		$(".direccion2").each(function(index) {
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
		
		xyTmp = trasladar({x1: moverXCara, y1: moverYCara, x2: event.clientX, y2: event.clientY}, (xy2[1].x3 - moverXCara), (xy2[1].y3 - moverYCara));
		var xy = distancia({x1: xy2[1].x1, y1: xy2[1].y1, x2: xyTmp.x2, y2: xyTmp.y2});
		xy2[1].d1 = xy;
		xy = distancia({x1: xy2[1].x2, y1: xy2[1].y2, x2: xyTmp.x2, y2: xyTmp.y2});
		xy2[1].d2 = xy;
		
		xyTmp = trasladar({x1: moverXCara, y1: moverYCara, x2: event.clientX, y2: event.clientY}, (xy2[2].x3 - moverXCara), (xy2[2].y3 - moverYCara));
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
		}
		if (xy2[1].d2 < xy2[1].d1 && xy2[1].d2 < xy2[2].d1 && xy2[1].d2 < xy2[2].d2) {
			xyCentro = {x: xy2[1].x1, y: xy2[1].y1};
			centro = xy2[1].elemento1;
			xyElemento = {x: xy2[1].x2, y: xy2[1].y2};
			elemento = xy2[1].elemento2;
		}
		if (xy2[2].d1 < xy2[1].d1 && xy2[2].d1 < xy2[1].d2 && xy2[2].d1 < xy2[2].d2) {
			xyCentro = {x: xy2[2].x2, y: xy2[2].y2};
			centro = xy2[2].elemento2;
			xyElemento = {x: xy2[2].x1, y: xy2[2].y1};
			elemento = xy2[2].elemento1;
		}
		if (xy2[2].d2 < xy2[1].d1 && xy2[2].d2 < xy2[1].d2 && xy2[2].d2 < xy2[2].d1) {
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
			if (matris[13] > matris2[13] && matris[14] == borde)
				valor = 90;
			if (matris[13] < matris2[13] && matris[14] == -borde)
				valor = 90;
			if (matris[13] > matris2[13] && matris[14] == -borde)
				valor = -90;
			
			if (matris[14] < matris2[14] && matris[13] == borde)
				valor = 90;
			if (matris[14] > matris2[14] && matris[13] == borde)
				valor = -90;
			if (matris[14] < matris2[14] && matris[13] == -borde)
				valor = -90;
			if (matris[14] > matris2[14] && matris[13] == -borde)
				valor = 90;
		}
		if ($(elemento).hasClass('rotar1Y')) {
			direccion = "Y";
			
			if (matris[12] < matris2[12] && matris[14] == borde)
				valor = 90;
			if (matris[12] > matris2[12] && matris[14] == borde)
				valor = -90;
			if (matris[12] < matris2[12] && matris[14] == -borde)
				valor = -90;
			if (matris[12] > matris2[12] && matris[14] == -borde)
				valor = 90;
			
			if (matris[14] < matris2[14] && matris[12] == borde)
				valor = -90;
			if (matris[14] > matris2[14] && matris[12] == borde)
				valor = 90;
			if (matris[14] < matris2[14] && matris[12] == -borde)
				valor = 90;
			if (matris[14] > matris2[14] && matris[12] == -borde)
				valor = -90;
		}
		if ($(elemento).hasClass('rotar1Z')) {
			direccion = "Z";
			
			if (matris[12] < matris2[12] && matris[13] == borde)
				valor = -90;
			if (matris[12] > matris2[12] && matris[13] == borde)
				valor = 90;
			if (matris[12] < matris2[12] && matris[13] == -borde)
				valor = 90;
			if (matris[12] > matris2[12] && matris[13] == -borde)
				valor = -90;
			
			if (matris[13] < matris2[13] && matris[12] == borde)
				valor = 90;
			if (matris[13] > matris2[13] && matris[12] == borde)
				valor = -90;
			if (matris[13] < matris2[13] && matris[12] == -borde)
				valor = -90;
			if (matris[13] > matris2[13] && matris[12] == -borde)
				valor = 90;
		}
		
		if (direccion != "" && valor != 0)
			animar($(".seleccion1, .seleccion2, .rotar1" + direccion + ", .rotar2" + direccion), direccion, valor);
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
						$(".cara").last().aplicaEstilo('transform', (n == 1 ? 'rotateY(90deg) ' : (n == 2 ? 'rotateX(90deg) ' : '')) + 'translateX(' + ((x * tamanoCr) + (x * anchoBorde)) + 'px) translateY(' + ((y * tamanoCr) + (y * anchoBorde)) + 'px) translateZ(' + ((z * tamanoCr) + (z * anchoBorde)) + 'px)' + (z == -numeroZ ? ' rotateX(180deg)' : ''));
					}
			}
		
		borde += ((anchoBorde / 2) * numero);
		borde2 = borde - (tamanoCr2 + ((anchoBorde / 2)));
		
		$(".cara").each(function(index) {
			var matris = matrisArreglo($(this).aplicaEstilo('transform'));
			var color = "";
			if (matris[12] == borde)
				color = "red";
			if (matris[12] == -borde)
				color = "green";
			if (matris[13] == borde)
				color = "blue";
			if (matris[13] == -borde)
				color = "yellow";
			if (matris[14] == borde)
				color = "orange";
			if (matris[14] == -borde)
				color = "white";
			if (desarrollo)
				color = "blue";
			$(this).attr('color', color).aplicaEstilo('background-color', color).aplicaEstilo('border', "3px solid black").aplicaEstilo('border-radius', "9px").aplicaEstilo('backface-visibility', "hidden");//.aplicaEstilo('box-sizing', "border-box");
		});
		
		nCaras = $(".cara").length;
		
		if (typeof(rotacion) == "undefined")
			rotacion = area;
		
		$(rotacion).mousewheel(function(event) {
			escalar += (event.deltaY * 0.05);
			$(contenedor).aplicaEstilo('transform', 'rotateX(' + rotarX + 'deg) rotateY(' + rotarY + 'deg) scale3d(' + escalar + ', ' + escalar + ', ' + escalar + ')');
			return false;
		});
		//$(rotacion).mousedown(function(event) {
		$(rotacion).on("vmousedown", function(event) {
			if (!$(document.elementFromPoint(event.clientX, event.clientY)).hasClass('cara')) {
				moverX = event.clientX;
				moverY = event.clientY;
				mover = true;
			}
		});
		//$(rotacion).mousemove(function(event) {
		$(rotacion).on("vmousemove", function(event) {
			if (mover) {
				rotarX -= (event.clientY - moverY);
				rotarY += (event.clientX - moverX);
				moverX = event.clientX;
				moverY = event.clientY;
				$(contenedor).aplicaEstilo('transform', 'rotateX(' + rotarX + 'deg) rotateY(' + rotarY + 'deg) scale3d(' + escalar + ', ' + escalar + ', ' + escalar + ')');
			}
		});
		//$(rotacion).mouseup(function(event) {
		$(rotacion).on("vmouseup", function(event) {
			mover = false;
		});
		
		//$(".cara").mousedown(function(event) {
		$(".cara").on("vmousedown", function(event) {
			seleccionar(event, this);
		});
		//$(area).mouseup(function(event) {
		$(area).on("vmouseup", function(event) {
			girar(event);
		});
	}
	
	var movimientoAleatorio = function() {
		var nCarasVisibles = $(".cara").filter(function() {
			return $(this).esVisible();
		}).addClass("visibles").length;
		
		var elemento = $(".visibles:eq(" + Math.floor(Math.random() * nCarasVisibles) + ")");
		var xy = {};
		
		elemento.each(function(index) {
			xy.x1 = (this.getBoundingClientRect().left + (this.getBoundingClientRect().width / 2));
			xy.y1 = (this.getBoundingClientRect().top + (this.getBoundingClientRect().height / 2));
		});
		
		xy.x2 = xy.x1 + Number((Math.floor(Math.random() * 2) == 0 ? "-" : "") + String(Math.floor(Math.random() * nCaras)));
		xy.y2 = xy.y1 + Number((Math.floor(Math.random() * 2) == 0 ? "-" : "") + String(Math.floor(Math.random() * nCaras)));
		
		seleccionar({clientX: xy.x1, clientY: xy.y1}, elemento);
		girar({clientX: xy.x2, clientY: xy.y2});
		
		$(".visibles").removeClass('visibles');
		
		movimientos--;
	}
	
	crear();
	
	this.perspectiva = function(valor) {
		if (valor)
			$(area).aplicaEstilo('perspective-origin:', "50% 50%").aplicaEstilo('perspective', (tamanoContenedor * 2) + "px");
		else
			$(area).aplicaEstilo('perspective-origin:', "").aplicaEstilo('perspective', "");
	}
	
	this.aleatorio = function() {
		bloqueo = true;
		movimientos = Math.floor((Math.random() * nCaras) + 1);
		movimientoAleatorio();
	}
	
	this.memoria = function(valor) {
		bloqueo = true;
		movimientos = valor;
		movimientoAleatorio();
	}
	
	this.expandir = function(valor) {
		$(contenedor).animate({ valorTS: 100 }, {
			start: function() {
				$(".cara").each(function() {
					$(this).attr('valorInicialTS', $(this).aplicaEstilo('transform'));
				});
			},
			step: function(now, fx) {
				$(".cara").each(function() {
					var matris = matrisArreglo($(this).attr('valorInicialTS'));
					if (matris[14] == borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor(0, (matris[12] * valor), now, fx['end']) + "px) translateY(" + rangoValor(0, (matris[13] * valor), now, fx['end']) + "px) translateZ(" + rangoValor(0, (borde * valor), now, fx['end']) + "px) scale3d(" + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ")");
					if (matris[14] == -borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor(0, (matris[12] * valor), now, fx['end']) + "px) translateY(" + rangoValor(0, (-matris[13] * valor), now, fx['end']) + "px) translateZ(" + rangoValor(0, (borde * valor), now, fx['end']) + "px) scale3d(" + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ")");
					if (matris[13] == borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor(0, (matris[12] * valor), now, fx['end']) + "px) translateY(" + rangoValor(0, (-matris[14] * valor), now, fx['end']) + "px) translateZ(" + rangoValor(0, (borde * valor), now, fx['end']) + "px) scale3d(" + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ")");
					if (matris[13] == -borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor(0, (matris[12] * valor), now, fx['end']) + "px) translateY(" + rangoValor(0, (matris[14] * valor), now, fx['end']) + "px) translateZ(" + rangoValor(0, (borde * valor), now, fx['end']) + "px) scale3d(" + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ")");
					if (matris[12] == borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor(0, (-matris[14] * valor), now, fx['end']) + "px) translateY(" + rangoValor(0, (matris[13] * valor), now, fx['end']) + "px) translateZ(" + rangoValor(0, (borde * valor), now, fx['end']) + "px) scale3d(" + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ")");
					if (matris[12] == -borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor(0, (-matris[14] * valor), now, fx['end']) + "px) translateY(" + rangoValor(0, (-matris[13] * valor), now, fx['end']) + "px) translateZ(" + rangoValor(0, (borde * valor), now, fx['end']) + "px) scale3d(" + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ", " + rangoValor(escalar, (escalar * valor), now, fx['end']) + ")");
				});
			},
			complete: function() {
				$(".cara").each(function() {
					var matris = matrisArreglo($(this).attr('valorInicialTS'));
					if (matris[14] == borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (matris[12] * valor) + "px) translateY(" + (matris[13] * valor) + "px) translateZ(" + (borde * valor) + "px) scale3d(" + (escalar * valor) + ", " + (escalar * valor) + ", " + (escalar * valor) + ")");
					if (matris[14] == -borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (matris[12] * valor) + "px) translateY(" + (-matris[13] * valor) + "px) translateZ(" + (borde * valor) + "px) scale3d(" + (escalar * valor) + ", " + (escalar * valor) + ", " + (escalar * valor) + ")");
					if (matris[13] == borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (matris[12] * valor) + "px) translateY(" + (-matris[14] * valor) + "px) translateZ(" + (borde * valor) + "px) scale3d(" + (escalar * valor) + ", " + (escalar * valor) + ", " + (escalar * valor) + ")");
					if (matris[13] == -borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (matris[12] * valor) + "px) translateY(" + (matris[14] * valor) + "px) translateZ(" + (borde * valor) + "px) scale3d(" + (escalar * valor) + ", " + (escalar * valor) + ", " + (escalar * valor) + ")");
					if (matris[12] == borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (-matris[14] * valor) + "px) translateY(" + (matris[13] * valor) + "px) translateZ(" + (borde * valor) + "px) scale3d(" + (escalar * valor) + ", " + (escalar * valor) + ", " + (escalar * valor) + ")");
					if (matris[12] == -borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + (-matris[14] * valor) + "px) translateY(" + (-matris[13] * valor) + "px) translateZ(" + (borde * valor) + "px) scale3d(" + (escalar * valor) + ", " + (escalar * valor) + ", " + (escalar * valor) + ")");
				});
				
				this.valorTS = 0;
			},
			duration: 250
		});
	}
	
	this.contraer = function(valor) {
		$(contenedor).animate({ valorTS: 100 }, {
			step: function(now, fx) {
				$(".cara").each(function() {
					var matris = matrisArreglo($(this).attr('valorInicialTS'));
					if (matris[14] == borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor((matris[12] * valor), 0, now, fx['end']) + "px) translateY(" + rangoValor((matris[13] * valor), 0, now, fx['end']) + "px) translateZ(" + rangoValor((borde * valor), 0, now, fx['end']) + "px) scale3d(" + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ")");
					if (matris[14] == -borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor((matris[12] * valor), 0, now, fx['end']) + "px) translateY(" + rangoValor((-matris[13] * valor), 0, now, fx['end']) + "px) translateZ(" + rangoValor((borde * valor), 0, now, fx['end']) + "px) scale3d(" + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ")");
					if (matris[13] == borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor((matris[12] * valor), 0, now, fx['end']) + "px) translateY(" + rangoValor((-matris[14] * valor), 0, now, fx['end']) + "px) translateZ(" + rangoValor((borde * valor), 0, now, fx['end']) + "px) scale3d(" + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ")");
					if (matris[13] == -borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor((matris[12] * valor), 0, now, fx['end']) + "px) translateY(" + rangoValor((matris[14] * valor), 0, now, fx['end']) + "px) translateZ(" + rangoValor((borde * valor), 0, now, fx['end']) + "px) scale3d(" + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ")");
					if (matris[12] == borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor((-matris[14] * valor), 0, now, fx['end']) + "px) translateY(" + rangoValor((matris[13] * valor), 0, now, fx['end']) + "px) translateZ(" + rangoValor((borde * valor), 0, now, fx['end']) + "px) scale3d(" + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ")");
					if (matris[12] == -borde)
						$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS') + " translateX(" + rangoValor((-matris[14] * valor), 0, now, fx['end']) + "px) translateY(" + rangoValor((-matris[13] * valor), 0, now, fx['end']) + "px) translateZ(" + rangoValor((borde * valor), 0, now, fx['end']) + "px) scale3d(" + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ", " + rangoValor((escalar * valor), escalar, now, fx['end']) + ")");
				});
			},
			complete: function() {
				$(".cara").each(function() {
					var matris = matrisArreglo($(this).attr('valorInicialTS'));
					$(this).aplicaEstilo('transform', $(this).attr('valorInicialTS'));
				});
				
				this.valorTS = 0;
			},
			duration: 250
		});
	}
}
