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

// Al cargar la página, obtener la IP pública
document.addEventListener("DOMContentLoaded", obtenerIPPublica);

// Estado de grabación
let grabando = false;
let secuencia = [];

// Utilidad para desactivar/activar botones
function toggleButtons(disabled) {
  document.querySelectorAll("button").forEach((btn) => (btn.disabled = disabled));
}

// Función para enviar un comando
function sendCommand(command) {
  document.getElementById("movement").innerText = `⏳ Enviando: ${command}`;
  toggleButtons(true); // desactivar botones

  const data = {
    name: "Alef",
    ip: ipPublica || "IP no disponible",
    status: command,
  };

  fetch("http://3.237.77.120/api/devices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error en la petición");
      return response.json();
    })
    .then((result) => {
      console.log("Respuesta de la API:", result);
      document.getElementById("movement").innerText = `✅ Comando ejecutado: ${command}`;

      // Si está grabando, agregamos el comando a la secuencia
      if (grabando && secuencia.length < 10) {
        secuencia.push(command);
        console.log(`[INFO] Movimiento guardado en secuencia: ${command}`);
      }
    })
    .catch((error) => {
      console.error("Error al enviar la orden:", error);
      document.getElementById("movement").innerText = "❌ Error al enviar comando.";
    })
    .finally(() => {
      toggleButtons(false); // reactivar botones
    });
}

// Función para enviar la velocidad
function sendVelocidad(valor) {
  document.getElementById("movement").innerText = `⏳ Enviando velocidad...`;
  toggleButtons(true);

  fetch("http://3.237.77.120/api/velocidad", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ velocidad: valor }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al enviar velocidad");
      return response.json();
    })
    .then((data) => {
      document.getElementById("movement").innerText = `🚗 Velocidad: ${data.velocidad}`;
      console.log("Velocidad enviada:", data.velocidad);
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("movement").innerText = "❌ Error al enviar velocidad.";
    })
    .finally(() => {
      toggleButtons(false);
    });
}

// Iniciar grabación de movimientos
function iniciarGrabacion() {
  grabando = true;
  secuencia = [];
  document.getElementById("movement").innerText = "🔴 Grabando movimientos (máx. 10)...";
  console.log("[INFO] Grabación iniciada.");
}

// Cancelar grabación
function cancelarGrabacion() {
  grabando = false;
  secuencia = [];
  document.getElementById("movement").innerText = "⛔ Grabación cancelada.";
  console.log("[INFO] Grabación cancelada.");
}

// Enviar la secuencia grabada
function enviarSecuencia() {
  if (!grabando || secuencia.length === 0) {
    alert("⚠️ Primero graba una secuencia de movimientos.");
    return;
  }

  document.getElementById("movement").innerText = "⏳ Enviando secuencia...";
  toggleButtons(true);

  fetch("http://3.237.77.120/api/sequence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sequence: secuencia,
      ejecutar: true
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al enviar la secuencia.");
      return res.json();
    })
    .then((data) => {
      document.getElementById("movement").innerText = "✅ Secuencia enviada correctamente.";
      console.log("[INFO] Secuencia ejecutada:", data);
      grabando = false;
      secuencia = [];
    })
    .catch((err) => {
      console.error("Error al enviar la secuencia:", err);
      document.getElementById("movement").innerText = "❌ Error al enviar secuencia.";
    })
    .finally(() => {
      toggleButtons(false);
    });
}
