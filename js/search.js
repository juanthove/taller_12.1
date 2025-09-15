let peliculas = [];

const url = "https://japceibal.github.io/japflix_api/movies-data.json";

document.addEventListener("DOMContentLoaded", () => {
    fetch(url)
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(data => {
            peliculas = data;
        })
        .catch(error => console.error(error));

});

const listaPeliculas = document.getElementById("lista");

//Mostrar peliculas
function showPelicula(peliculasActuales){
    listaPeliculas.replaceChildren();
    peliculasActuales.forEach(item => {
        const pelicula = document.createElement("li"); //Creo el contenedor de la pelicula
        pelicula.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "bg-dark"); //Agrego clases para dar estilo
        pelicula.dataset.id = item.id; //Guardo el id de la pelicula para usarlo para desplegar su información

        const contenedor = document.createElement("div");

        //Creo el titulo y le doy clases para estilos
        const titulo = document.createElement("p");
        titulo.classList.add("fw-bold", "mb-0", "text-white")
        titulo.textContent = item.title;

        const tagline = document.createElement("p");
        tagline.classList.add("fst-italic", "text-muted", "mb-0");
        tagline.textContent = item.tagline;

        contenedor.appendChild(titulo);
        contenedor.appendChild(tagline);

        //Estrellas
        const rating = document.createElement("div");
        const estrellas = Math.round(item.vote_average / 2); //Convertir el vote de 0-10 a 0-5 estrellas
        for (let i = 0; i < 5; i++) {
            const star = document.createElement("span"); //Creo la estrella
            star.classList.add("fa", "fa-star"); //Le agrego clase para estilo
            if (i < estrellas) {
                star.classList.add("checked", "text-warning"); //Si el número de la estrella actual es menor al número de estrellas de los votos se coloca checked para poner la estrella naranja
            } else {
                star.classList.add("text-muted"); //Si no entonces se coloca la estrella en negro
            }
            rating.appendChild(star);
        }

        pelicula.appendChild(contenedor);
        pelicula.appendChild(rating);

        listaPeliculas.appendChild(pelicula);
    });
}

// Buscador
const botonBuscar = document.getElementById("btnBuscar");
const buscador = document.getElementById("inputBuscar");

botonBuscar.addEventListener("click", () => {
    const texto = buscador.value.toLowerCase();
    if(texto != ""){
        const peliculasActuales = peliculas.filter(pelicula =>
            pelicula.title.toLowerCase().includes(texto) ||
            pelicula.genres.map(g => g.name.toLowerCase()).join(" ").includes(texto) ||
            pelicula.tagline.toLowerCase().includes(texto) ||
            pelicula.overview.toLowerCase().includes(texto)
        );

        showPelicula(peliculasActuales);
    }
    
});

const offcanvasElement = document.getElementById("offcanvasTop");
const offcanvas = new bootstrap.Offcanvas(offcanvasElement); // Inicializa el Offcanvas

//Info peliculas
listaPeliculas.addEventListener("click", (e) => {
    const li = e.target.closest("li"); //Buscar que li se cliqueo dentro de la lista
    const id = li.dataset.id; //Obtengo el id de la pelicula clickeada
    const pelicula = peliculas.find(p => p.id == id); //Encuentro la pelicula de la lista de peliculas

    //Mostrar detalles de la pelicula
    //Titulos
    document.getElementById("offcanvasTopLabel").textContent = pelicula.title;

    //Descripcion
    document.getElementById("description").textContent = pelicula.overview;

    //Generos
    let generos = pelicula.genres.map(g => g.name).join(" - ");
    document.getElementById("genres").textContent = generos;


    //Agregar datos al boton More
    let year = document.getElementById("year");
    year.textContent =  pelicula.release_date.split("-", 1);

    let runtime = document.getElementById("runtime");
    runtime.textContent =  `${pelicula.runtime} mins`;

    let budget = document.getElementById("budget");
    budget.textContent = `$${pelicula.budget}`;

    let revenue = document.getElementById("revenue");
    revenue.textContent =  `$${pelicula.revenue}`;


    offcanvas.show(); //Muestro el offcanvas
});

//Desplegar menú al clickear el boton More
const botonMore = document.getElementById("botonMore");
const dropdownLista = document.getElementById("dropdownList");

botonMore.addEventListener("click", () => {
    dropdownLista.style.display = dropdownLista.style.display === 'block' ? 'none' : 'block'; //Muestro o oculto la lista

    //Calcular si la lista se va fuera de la pantalla
    const listaWidth = dropdownLista.offsetWidth; //Ancho total de la lista
    const rect = botonMore.getBoundingClientRect(); //Posicion y tamaño del boton
    let left = rect.left; //Distancia entre el borde izquierdo de la ventana y el borde izquierdo del boton

    //Si la distancia entre la parte izquierda de la pantalla y el boton más la lista es mayor a toda la pantalla (la lista queda cortada), entonces se modifica el tamaño de left para que queda más hacia la izquierda
    if (left + listaWidth > window.innerWidth) {
        left = window.innerWidth - listaWidth - 10; //10px de margen del borde
    }

    dropdownLista.style.top = `${rect.bottom + 5}px`; //Colocar la lista debajo del boton
    dropdownLista.style.left = `${left}px`; //Colocar la lista hacia la izquierda la distancia determinada por left
});

//Cerrar la lista al clickear en otra parte
document.addEventListener('click', (e) => {
    if (!botonMore.contains(e.target) && !dropdownLista.contains(e.target)) {
        dropdownLista.style.display = 'none';
    }
});