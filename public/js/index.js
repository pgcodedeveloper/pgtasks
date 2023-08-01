var prevScrollpos = window.scrollY;

window.onscroll = function() {
  var currentScrollPos = window.scrollY;

  if (prevScrollpos > currentScrollPos) {
    // Si el desplazamiento es hacia arriba
    document.getElementById("menu")?.classList.remove("menuOculto");
    document.getElementById("menu")?.classList.add("menuVisible");
  } else {
    // Si el desplazamiento es hacia abajo
    document.getElementById("menu")?.classList.remove("menuVisible");
    document.getElementById("menu")?.classList.add("menuOculto");
  }

  prevScrollpos = currentScrollPos;
};
