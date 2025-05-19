// Variable global para almacenar la IP pública
let ipPublica = "";

// Función para obtener la IP pública
function obtenerIPPublica() {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      ipPublica = data.ip;
      console.log("IP pública obtenida:", ipPublica);
    })
    .catch((error) => {
      console.error("Error al obtener la IP pública:", error);
    });
}

// Cuando se cargue la página, obtenemos la IP pública
document.addEventListener("DOMContentLoaded", function () {
  obtenerIPPublica();
});

function sendCommand(command) {
  // Actualiza el estado en la interfaz
  document.getElementById("movement").innerText = command;

  // Construimos el objeto JSON usando la IP pública obtenida
  const data = {
    name: "Alef",
    ip: ipPublica || "IP no disponible", // Fallback si aún no se ha cargado
    status: command,
  };

  // Hacemos el POST usando fetch
  fetch("http://44.203.63.226/api/devices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      return response.json();
    })
    .then((result) => {
      console.log("Respuesta de la API:", result);
    })
    .catch((error) => {
      console.error("Error al enviar la orden:", error);
    });
}
