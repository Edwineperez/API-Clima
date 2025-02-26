const container = document.querySelector(".container");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();
  resultado.innerHTML = "";
  mostrarCarga();
  obtenerClima();
}

function mostrarCarga() {
  resultado.innerHTML = `<p class="text-center">🔄 Buscando clima...</p>`;
}

async function obtenerClima() {
  const ciudad = document.querySelector("#ciudad").value.trim();
  const pais = document.querySelector("#pais").value;

  if (ciudad === "" || pais === "") {
    mostrarError("Todos los campos son obligatorios");
    return;
  }

  await consultarAPI(ciudad, pais);
}

async function consultarAPI(ciudad, pais) {
  const appId = "5a62eb441ade448f7195e8cd229f2337";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}&units=metric`;

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error("Ciudad no encontrada o clave inválida");

    const datos = await respuesta.json();

    if (!datos.weather || !datos.main) {
      throw new Error("Respuesta incompleta de la API");
    }

    mostrarClima(datos);
  } catch (error) {
    mostrarError(`Error al obtener el clima: ${error.message}`);
  }
}

function mostrarClima(datos) {
  resultado.innerHTML = "";
  const { name, main: { temp, temp_max, temp_min, humidity, pressure }, weather: [info], wind: { speed } } = datos;

  const divClima = document.createElement("div");
  divClima.classList.add("bg-blue-100", "rounded", "p-4", "mt-4", "text-center");
  divClima.innerHTML = `
    <h2 class="text-xl font-bold"> Clima en ${name}</h2>
    <p class="text-lg">Temperatura actual: <strong>${temp} °C</strong></p>
    <p class="text-lg">Temperatura Máxima: ${temp_max} °C</p>
    <p class="text-lg">Temperatura Mínima: ${temp_min} °C</p>
  `;
  resultado.appendChild(divClima);
}

function mostrarError(mensaje) {
  const alertaExistente = document.querySelector(".alerta-error");
  if (alertaExistente) return;

  const alerta = document.createElement("div");
  alerta.classList.add("alerta-error", "bg-red-100", "border", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "text-center", "mt-4");
  alerta.innerHTML = `
    <strong class="font-bold">Error:</strong>
    <span>${mensaje}</span>
  `;
  container.appendChild(alerta);
  setTimeout(() => alerta.remove(), 3000);
}



