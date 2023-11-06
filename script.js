function menu(){
    if (document.getElementById('menu').classList.contains('open')){
        document.getElementById('menu').classList.remove('open');
        document.getElementById('menuItens').classList.add('closed');
        document.getElementById('header').classList.remove('headerOpen');
    } else {
        document.getElementById('menu').classList.add('open');
        document.getElementById('menuItens').classList.remove('closed');
        document.getElementById('header').classList.add('headerOpen');
    }
}