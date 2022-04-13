
var elements = [];
var jugador;

function dormir(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
function terminarJuego(ganador){
    bloquearClick();
    document.getElementById('ganadorCaja').style.display = "block";
    if(ganador == "black"){
        document.getElementById('ganadorCaja').innerHTML = "<h4> Felicidades "+ jugador + " ¡Ganaste el juego !</h4>"
    }else if(ganador =="red"){
        document.getElementById('ganadorCaja').innerHTML = "<h4> ¡Oh no " + jugador + " ¡Perdiste el juego! </h4>"
    }else{
        document.getElementById('ganadorCaja').innerHTML ="<h4> Empate? </h4>"
    }
    
}
function bloquearClick(){
    let canvas = document.getElementById('canvas');
    canvas.removeEventListener('click', agregarEventoClick);
}

function gameOver(){
    let todasOcupadas = true;
    elements.forEach(function(element) {
        if(element.estado == false){
            todasOcupadas = false;
        }
    })
    return todasOcupadas;
}

function moverBot(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    let ficha = new Image();
    ficha.src = 'fichaRoja.png';
    ficha.onload = async function(){
        
        await dormir(2000);
        
        //comprobamos el estado del game
        let estadoGame = gameOver();
        if(estadoGame){
            terminarJuego();
        }else{
            //detectamos si la casilla no esta ocupada 
            let posicionValida = false;
            let posicion;
            while(posicionValida != true ){
                posicion = sacar();
                let result = probar(posicion);
                if(result == false){
                    posicionValida = true;
                }
            }
            ctx.drawImage(ficha, posicion.left, posicion.top);
            comprobarGanador(function(result){
                if(result != "parar"){
                    canvas.addEventListener('click', agregarEventoClick, false);
                }
            });
            
        }

    }
}

function probar(obj){
    let ocupado = false;
    elements.forEach(function(element) {
        if (element.left == obj.left && element.top == obj.top){
            if(element.estado == true){
                ocupado = true;
            }else{
                element.prop = element.color;
                element.estado = true;            
            }
        }
    })
    return ocupado;
}

function sacar(){
    let aleatorioLeft = (Math.floor (Math.random() * 3) * 105);
    let aleatorioTop = (Math.floor (Math.random() * 3) * 105);

    let posicion = {
        left: aleatorioLeft,
        top: aleatorioTop
    }
    return posicion
}

function cambiarTurno(){
    bloquearClick();
    moverBot();
}

function dibujarTablero(){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ABABAB';
    let fila = 0;
    for(let i = 0; i < 3; i++){
        elements.push({
            casilla: (fila*3) + i,
            colour: '#05EFFF',
            width: 100,
            height: 100,
            top: fila*105,
            left: i*105,
            estado: false,
            tipo: null
        });
        ctx.fillRect(i*105, fila*105, 100 , 100);
        if(i == 2 && fila != 2){
            i = -1;
            fila+=1;
        }
    }
    canvas.addEventListener('click', agregarEventoClick, false);
}

function agregarEventoClick(evento){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let elemLeft = canvas.offsetLeft + canvas.clientLeft;
    let elemTop = canvas.offsetTop + canvas.clientTop;
    var x = evento.pageX - elemLeft;
    var y = evento.pageY - elemTop;
    
    elements.forEach(function(element) {
        if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
            let posicion = {
                left: element.left,
                top: element.top,
                color: element.tipo
            }
            let result = probar(posicion);
            if(result == false){
                function comprobar(URL, callback) {
                    var ficha = new Image();
                    ficha.src = URL;
                    ficha.onload = function() {
                      ctx.drawImage(ficha, element.left, element.top);
                      element.estado = true;
                      element.tipo = "black";
                      callback("imagen cargada");
                    };
                }
                comprobar('fichaNegra.png', function(result){
                    let estadoGame = gameOver();
                    if(estadoGame){
                        terminarJuego();
                    }else{ 
                        comprobarGanador(function(result){
                            if(result != "parar"){
                                cambiarTurno();
                            }                            
                        });     
                    }
                });    
            }          
        }
    }); 
}
function comprobarGanador(callback){
    let msg = "continuar";
    elements.forEach(function(item, index) {
        if (index < 3){
        let avanzar = index * 3;
            let casilla1 = elements[avanzar];
            let casilla2 = elements[avanzar+1];
            let casilla3 = elements[avanzar+2];

            let casilla1v = elements[index];
            let casilla2v = elements[index+3];
            let casilla3v = elements[index+6];

            if(casilla1.estado == true && casilla2.estado == true && casilla3.estado == true){
                if(casilla1.tipo == "black" && casilla2.tipo == "black" && casilla3.tipo == "black"){
                    terminarJuego("black");
                    msg = "parar";
                }else if(casilla1.tipo == "red" && casilla2.tipo == "red" && casilla3.tipo == "red"){
                    terminarJuego("red");
                    msg = "parar";
                }
            }

            if(casilla1v.estado == true && casilla2v.estado == true && casilla3v.estado == true){
                if(casilla1v.tipo == "black" && casilla2v.tipo == "black" && casilla3v.tipo == "black"){
                    terminarJuego("black");
                    msg = "parar";
                }else if(casilla1v.tipo == "red" && casilla2v.tipo == "red" && casilla3v.tipo == "red"){
                    terminarJuego("red");
                    msg = "parar";
                }
            }
        }   
    });

    let casilla1x = elements[0];
    let casilla2x = elements[4];
    let casilla3x = elements[8];

    let casilla1x_v2 = elements[2];
    let casilla2x_v2 = elements[4];
    let casilla3x_v2 = elements[6];

    if(casilla1x.estado == true && casilla2x.estado == true && casilla3x.estado == true){
        if(casilla1x.tipo == "black" && casilla2x.tipo == "black" && casilla3x.tipo == "black"){
            terminarJuego("black");
            msg = "parar";
        }else if(casilla1x.tipo == "red" && casilla2x.tipo == "red" && casilla3x.tipo == "red"){
            terminarJuego("red");
            msg = "parar";
        }
    }
    if(casilla1x_v2.estado == true && casilla2x_v2.estado == true && casilla3x_v2.estado == true){
        if(casilla1x_v2.tipo == "black" && casilla2x_v2.tipo == "black" && casilla3x_v2.tipo == "black"){
            terminarJuego("black");
            msg = "parar";
        }else if(casilla1x_v2.tipo == "red" && casilla2x_v2.tipo == "red" && casilla3x_v2.tipo == "red"){
            terminarJuego("red");
            msg = "parar";
        }
    }

    callback(msg);
}
function play(){
    jugador = document.getElementById("idJugador").value;
    let boton = document.getElementById("botonPlay");
    if(boton.value == "Jugar"){
        boton.value = "volver a jugar";
        dibujarTablero();
    }else{
        limpiar();
        dibujarTablero();
    }
}

function limpiar(){
    document.getElementById('ganadorCaja').style.display = "none";
    elements = [];
}

