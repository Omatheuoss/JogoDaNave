var diryJ, dirxJ, jogador, velJ, pjx, pjy
var tamTelaW, tamTelaH
var jogo
var frame
var velT
var contAliens, painelContAliens, velA, tmpCriaAlien
var aliensTotal
var vidaPlaneta, barraPlaneta
var indiceExpl, indiceSom
var telaMsg

// Funções de tecla para baixo
function teclaDw() {
    var tecla = event.keyCode

    if (tecla == 38) { //Cima
        diryJ = -1
    } else if (tecla == 40) { //Baixo
        diryJ = 1
    }

    if (tecla == 37) {//Esquerda
        dirxJ = -1
    } else if (tecla == 39) {//Direita
        dirxJ = 1
    }
    if (tecla == 32) { //Espaço / Tiro
        //TIRO
        atira(pjx + 17, pjy)
    }
}

// Funções de tecla para cima
function teclaUp() {
    var tecla = event.keyCode

    if ((tecla == 38) || (tecla == 40)) { //Cima
        diryJ = 0
    }

    if ((tecla == 37) || (tecla == 39)) {//Esquerda
        dirxJ = 0
    }
}

// Funções para criar o alien
function criaAlien() {
    if (jogo) {
        var y = 0
        var x = Math.random() * tamTelaW
        var alien = document.createElement("div")
        var att1 = document.createAttribute("class")
        var att2 = document.createAttribute("style")
        att1.value = "alien"
        att2.value = "top:" + y + "px;left:" + x + "px"
        alien.setAttributeNode(att1)
        alien.setAttributeNode(att2)
        document.body.appendChild(alien)
        contAliens--
    }
}

// Funções de controlar o alien
function controlaAlien() {
    aliensTotal = document.getElementsByClassName("alien")

    var tam = aliensTotal.length

    for (var i = 0; i < tam; i++) {
        if (aliensTotal[i]) {
            var pi = aliensTotal[i].offsetTop
            pi += velA
            aliensTotal[i].style.top = pi + "px"

            if (pi > tamTelaH) {
                vidaPlaneta -= 10
                criaExplosao(2, aliensTotal[i].offsetLeft, null);
                aliensTotal[i].remove()

            }
        }

    }
}

// Funções de atirar
function atira(x, y) {
    var t = document.createElement("div")
    var att1 = document.createAttribute("class")
    var att2 = document.createAttribute("style")
    att1.value = "tiroJog"
    att2.value = "top:" + y + "px;left:" + x + "px"
    t.setAttributeNode(att1)
    t.setAttributeNode(att2)
    document.body.appendChild(t)
}

// Funções de direção do tiro
function controleTiros() {
    var tiros = document.getElementsByClassName('tiroJog')
    var tam = tiros.length
    for (var i = 0; i < tam; i++) {
        if (tiros[i]) {
            var pt = tiros[i].offsetTop
            pt -= velT
            tiros[i].style.top = pt + "px"
            colisaoTiroAlien(tiros[i])
            if (pt < 0) {
                tiros[i].remove()
            }
        }
    }
}

// Funções de colisão após o tiro
function colisaoTiroAlien(tiro) {
    var tam = aliensTotal.length
    for (var i = 0; i < tam; i++) {
        if (aliensTotal[i]) {
            if (
                (
                    (tiro.offsetTop <= (aliensTotal[i].offsetTop + 100)) && // parte de cima tiro com alien
                    ((tiro.offsetTop + 6) >= (aliensTotal[i].offsetTop)) //parte baixa tiro com cima alien
                )
                &&
                (
                    (tiro.offsetLeft <= (aliensTotal[i].offsetLeft + 100)) && //Esquerda tiro com direita bomba
                    ((tiro.offsetLeft + 6) >= (aliensTotal[i].offsetLeft)) //Direita do tiro com a parte esquerda bomba
                )
            ) {
                criaExplosao(1, aliensTotal[i].offsetLeft - 20, aliensTotal[i].offsetTop)
                aliensTotal[i].remove()
                tiro.remove()

            }
        }
    }
}

// Funções de criar explosão
function criaExplosao(tipo, x, y) {//Tipo 1=ar, 2=terra
    if (document.getElementById("explosao" + (indiceExpl - 2))) {
        document.getElementById("explosao" + (indiceExpl - 2)).remove()
    }

    var explosao = document.createElement("div")
    var img = document.createElement("img")
    var som = document.createElement("audio")
    // Atributos para div
    var att1 = document.createAttribute("class")
    var att2 = document.createAttribute("style")
    var att3 = document.createAttribute("id")
    // Atributos para imagem
    var att4 = document.createAttribute("src")
    // Atributos para áudio
    var att5 = document.createAttribute("src")
    var att6 = document.createAttribute("id")

    att3.value = "explosao" + indiceExpl;

    if (tipo == 1) {  // Explosão no ar
        att1.value = "explosaoAr";
        att2.value = "top:" + y + "px;left:" + x + "px;"
        att4.value = "imagens/explosaocerta.gif?" + new Date();
    } else {  // Explosão no chão
        att1.value = "explosaoChao";
        att2.value = "top:" + (tamTelaH - 57) + "px;left:" + (x - 17) + "px;"
        att4.value = "imagens/explosaochao.gif?" + new Date();
    }


    att5.value = "imagens/destruido.mp3?" + new Date()
    att6.value = "som" + indiceSom
    explosao.setAttributeNode(att1)
    explosao.setAttributeNode(att2)
    explosao.setAttributeNode(att3)
    img.setAttributeNode(att4)
    som.setAttributeNode(att5)
    som.setAttributeNode(att6)

    explosao.appendChild(img)
    explosao.appendChild(som)

    document.body.appendChild(explosao)
    document.getElementById("som" + indiceSom).play()


    indiceExpl++
    indiceSom++
}

// Funções de controlar a nave
function controlaJogador() {
    pjy += diryJ * velJ;
    pjx += dirxJ * velJ;
    jog.style.top = pjy + "px"
    jog.style.left = pjx + "px"
}

// Funções de gerenciamento do jogo
function gerenciaGame() {
    barraPlaneta.style.width = vidaPlaneta + "px"
    if (contAliens <= 0) {
        jogo = false
        clearInterval(tmpCriaAlien)
        telaMsg.style.backgroundImage = "url('imagens/Victori.gif')"
        telaMsg.style.display = "block"
    }
    if (vidaPlaneta <= 0) {
        jogo = false
        clearInterval(tmpCriaAlien)
        telaMsg.style.backgroundImage = "url('imagens/defeat.gif')"
        telaMsg.style.display = "block"

        var somFundo = document.getElementById("somFundo");
        somFundo.pause();

    }

}

// Funções do jogo ficar em loop
function gameLoop() {
    if (jogo) {
        //funções de controle
        controlaJogador()
        controleTiros()
        controlaAlien()
    }
    gerenciaGame()
    frame = requestAnimationFrame(gameLoop)
}

// Funções de reiniciar o jogo
function reinicia() {
    aliensTotal = document.getElementsByClassName("alien")
    var tam = aliensTotal.length
    for (var i = 0; i < tam; i++) {
        if (aliensTotal[i]) {
            aliensTotal[i].remove()
        }
    }
    telaMsg.style.display = "none"
    clearInterval(tmpCriaAlien)
    cancelAnimationFrame(frame)
    vidaPlaneta = 300 // Jogo sempre reinicia com 300 de vida
    pjx = tamTelaW / 2
    pjy = tamTelaH / 2
    jog.style.top = pjy + "px"
    jog.style.left = pjx + "px"
    contAliens = 100 // Jogo sempre reinicia com 100 aliens 
    jogo = true
    tmpCriaAlien = setInterval(criaAlien, 1700) // O intervalo da criação de um alien para o outro


    gameLoop()
}

// Funções de iniciar o jogo
function inicia() {
    jogo = false

    //Ini Tela
    tamTelaH = window.innerHeight
    tamTelaW = window.innerWidth

    //Inicia jogador
    dirxJ = diryJ = 0
    pjx = tamTelaW / 2
    pjy = tamTelaH / 2
    velJ = velT = 10 // velocidade da nave
    jog = document.getElementById("naveJog")
    jog.style.top = pjy + "px"
    jog.style.left = pjx + "px"

    //Controles dos aliens
    contAliens = 100 // a contagem de aliens que vão cair no total
    velA = 3 // velocidade que o alien cai

    //Controle do Planeta
    vidaPlaneta = 300 // vida do planeta
    barraPlaneta = document.getElementById("barraPlaneta")
    barraPlaneta.style.width = vidaPlaneta + "px"

    //Controle da explosão
    indiceExpl = indiceSom = 0

    //Telas 
    telaMsg = document.getElementById("telaMsg")
    telaMsg.style.display = "block"
    document.getElementById("btnJogar").addEventListener("click", reinicia)

    // som do jogo
    var somFundo = document.getElementById("somFundo");
    somFundo.play();

    somFundo.volume = 0.5;

    gameLoop()
}

window.addEventListener("load", inicia)
document.addEventListener("keydown", teclaDw)
document.addEventListener("keyup", teclaUp)