/* ================= CONFIG ================= */
const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxhoJt6DdeT0AnPJbzgWJ4uR4ff9p08IXpsr3jMNFFq1YSr-L7jxtqFFtUkt08q4tscuw/exec";

/* ================= DOM ================= */
const overlay = document.getElementById("overlay");
const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn");
const error = document.getElementById("error");

const letterWrapper = document.getElementById("letterWrapper");
const envelope = document.getElementById("envelope");
const openLetterBtn = document.getElementById("openLetterBtn");

const paper = document.getElementById("paper");
const paperContent = document.getElementById("paperContent");
const nextPartBtn = document.getElementById("nextPartBtn");
const continueGiftBtn = document.getElementById("continueGiftBtn");

const letterName = document.getElementById("letterName");
const paperToName = document.getElementById("paperToName");

const giftOverlay = document.getElementById("giftOverlay");
const giftBox = document.getElementById("giftBox");
const giftText = document.getElementById("giftText");

const reflectionBlock = document.getElementById("reflectionBlock");
const reflectionInput = document.getElementById("reflectionInput");
const sendReflectionBtn = document.getElementById("sendReflectionBtn");
const reflectionMsg = document.getElementById("reflectionMsg");


openLetterBtn.addEventListener("click", () => {
  openLetter();

  // Reiniciar estado por seguridad
  paperContent.innerHTML = "";
  partIndex = 0;

  // Renderizar SIEMPRE la primera parte
  setTimeout(() => {
    renderNextPart();
  }, 350);
});

/* ================= NIEVE ================= */
(function createSnow(){
  const amount = 35;
  for (let i = 0; i < amount; i++) {
    const s = document.createElement("div");
    s.className = "snow";
    s.textContent = "❄";
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = (10 + Math.random() * 18) + "px";
    s.style.opacity = (0.35 + Math.random() * 0.65).toFixed(2);
    s.style.animationDuration = (6 + Math.random() * 6) + "s";
    s.style.animationDelay = (-Math.random() * 8) + "s";
    document.body.appendChild(s);
  }
})();

/* ================= UTIL: fecha/hora Madrid ================= */
function getMadridDateTime() {
  const now = new Date();
  const d = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);

  const t = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);

  return { date: d, time: t };
}

/* ================= INPUT: solo letras ================= */
nameInput.addEventListener("input", () => {
  nameInput.value = nameInput.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
});

/* ================= TEXTO ORIGINAL (sin borrar contenido) ================= */
/* Nota: solo he dividido en “partes” por cohesión, manteniendo tu texto íntegro. */
function buildParts(formattedName){
  return [

`2024 no fue un buen año, ni mucho menos, pero aunque eso ya quedó muy atrás, creo que es importante recordarlo para poder compararlo con el que, ha sido uno de los mejores años de mi vida. Y es curioso porque no ha pasado nada muy relevante, ni muy importante y creo que, en parte, para mí eso es lo que lo hace de los mejores.`,

`Yo siempre les decía a mis amigos: "tranquilo es una mala racha, ya vendrás mejores". No miento si digo que este año habré atravesado ¿1? ¿2? malas rachas. Por fin, puedo decir que estoy feliz casi al 100%, y lo más importante, que SOY feliz, en mayúsculas.`,

`Siempre he tendido a ver lo negativo de todo y a quedarme únicamente con eso, me encerraba en mi burbuja llena de oscuridad y no podía ver otra cosa que ese fondo negro. Llámame loco pero el 2025, ha sido como un rayo de luz para mi. Esa luz me ha alumbrado y guiado hacia donde sí debo estar y lo que sí debo ser.`,

`Y aunque estoy muy orgulloso de los grandes avances que he hecho este año personalmente, no podría haberlo logrado sin ti, ${formattedName}. Y eso me llena aún mas de orgullo. Rodearme de un entorno sano, feliz, real y fiel es un regalo que yo recibo a diario. Seguramente no merezca tanto, o quizás si, lo que tengo seguro es que no podría pedir nada mejor.`,

`Me da igual si eres uno de los de toda la vida, o nos conocemos hace poco, si eres de Murillo, o del pueblo de al lado, si comentamos la isla de las tentaciones o la casa de los gemelos, nos veamos poco, mucho, o casi nada, si estás aqui, gracias.`,

`He ido a mi primer apres-ski, he visitado nuevas ciudades, nuevos estadios de fútbol, he perdido dinero en LAS VEGAS, he visto casi morir al club de mi vida dos veces, y resurgir de entre las cenizas y he atravesado uno de los puentes mas espectaculares del mundo, entre otras tantas cosas.`,

`A nivel personal este año he aprendido tantas cosas. Decidí lanzarme a la piscina e irme con 18 personas que no conocía de absolutamente nada a Estados Unidos 20 días, ahora gracias a dios, varias de esas personas son mis amigos.`,

`Tengo 5 tíos espectaculares a mi lado con los que paso la mayor parte de mis días y no podría tener más suerte de vivir tantas cosas con ellos. `,

`Un año más, mi segunda familia de mi segunda casa, año tras año siguen ahí al pie del cañón, en verano o fuera de él.`,

`Tengo a mis personas de toda la vida, que las que valen, ahí siguen. Afortunadamente, me he adaptado de maravilla al mundo laboral y de momento, no podría estar en un mejor sitio ni tener unos mejores compañeros, que ya son más que simples compañeros.`,

`Y si eres una de las personas que ha entrado nuevas en mi vida, si estás leyendo esto, es porque quiero que permanezcas mucho tiempo más.`,

`De verdad, aunque suene a tópico gracias por estar ahí siempre, por considerarme un amigo tuyo y por perder unos minutos de tu día en leer esto.`,

`Gracias, porque sin ti, el año habría sido un poquito peor, un poquito menos divertido.`
  ];
}

/* ================= TYPEWRITER por párrafo ================= */
let typing = false;

function typeWriterToElement(text, el, speed = 14) {
  return new Promise((resolve) => {
    typing = true;
    el.textContent = "";
    let i = 0;

    // pinta inmediatamente 1er carácter (evita “milisegundos en blanco”)
    if (text.length > 0) {
      el.textContent = text.charAt(0);
      i = 1;
    }

    const timer = setInterval(() => {
      el.textContent += text.charAt(i++);
      paperContent.scrollTop = paperContent.scrollHeight;

      if (i >= text.length) {
        clearInterval(timer);
        typing = false;
        resolve();
      }
    }, speed);
  });
}

function addParagraphContainer() {
  const p = document.createElement("p");
  p.className = "paragraph";
  paperContent.appendChild(p);
  return p;
}

/* ================= ESTADO ================= */
let visitorName = null;
let parts = [];
let partIndex = 0;

/* ================= UI FLOW ================= */
function showLetter(name){
  letterName.textContent = name;
  paperToName.textContent = name;
  letterWrapper.classList.remove("d-none");
}

function hideOverlay(){
  overlay.style.display = "none";
}

function openLetter(){
  envelope.classList.add("open");
  setTimeout(() => {
    paper.classList.remove("d-none");
    // iniciar contenido “por partes”
    paperContent.innerHTML = "";
    partIndex = 0;
    continueGiftBtn.classList.add("d-none");
    nextPartBtn.classList.remove("d-none");
  }, 450);
}

async function renderNextPart(){
  if (typing) return;
  if (partIndex >= parts.length) return;

  const el = addParagraphContainer();
  await typeWriterToElement(parts[partIndex], el, 14);
  partIndex++;

  // al final, mostrar botón de continuar al regalo
  if (partIndex >= parts.length) {
    nextPartBtn.classList.add("d-none");
    continueGiftBtn.classList.remove("d-none");
  }
}

/* ================= REGALO ================= */
function showGift(){
  // ocultar carta
  letterWrapper.classList.add("fade-out");
  setTimeout(() => {
    letterWrapper.style.display = "none";
    giftOverlay.classList.remove("d-none");
    giftOverlay.setAttribute("aria-hidden", "false");
  }, 450);
}

function openGift(){
  giftBox.style.animation = "none";
  giftText.classList.remove("d-none");
  reflectionBlock.classList.remove("d-none");
}

/* ================= GOOGLE SHEETS (nombre+fecha+hora+reflexión) ================= */
function sendToSheet({ name, reflection }) {
  const { date, time } = getMadridDateTime();

  // No-cors: no podrás leer respuesta, pero se envía.
  return fetch("https://script.google.com/macros/s/AKfycbxhoJt6DdeT0AnPJbzgWJ4uR4ff9p08IXpsr3jMNFFq1YSr-L7jxtqFFtUkt08q4tscuw/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      date: date,
      time: time,
      reflection: reflection
    })
  });
}

/* ================= EVENTOS ================= */
startBtn.addEventListener("click", () => {
  const raw = (nameInput.value || "").trim();

  if (!raw) {
    error.classList.remove("d-none");
    return;
  }

  // Validación extra: no números ya lo limpia, pero reforzamos
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(raw)) {
    error.classList.remove("d-none");
    return;
  }

  error.classList.add("d-none");

  // Formateo nombre
  visitorName = raw
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  localStorage.setItem("visitorName", visitorName);

  // preparar partes
  parts = buildParts(visitorName);

  hideOverlay();
  showLetter(visitorName);
});

openLetterBtn.addEventListener("click", () => {
  openLetter();

  // Reiniciar estado por seguridad
  paperContent.innerHTML = "";
  partIndex = 0;

  // Renderizar SIEMPRE la primera parte
  setTimeout(() => {
    renderNextPart();
  }, 350);
});


nextPartBtn.addEventListener("click", () => {
  renderNextPart();
});

continueGiftBtn.addEventListener("click", () => {
  showGift();
});

giftBox.addEventListener("click", () => {
  openGift();
});

sendReflectionBtn.addEventListener("click", async () => {
  const text = (reflectionInput.value || "").trim();

  if (!text) {
    reflectionMsg.textContent = "Escribe algo antes de enviarlo 🙂";
    reflectionMsg.className = "text-warning mt-2";
    reflectionMsg.classList.remove("d-none");
    return;
  }

  // ENVÍO A GOOGLE SHEETS (NO BORRAR)
  try {
    await sendToSheet({ name: visitorName || "Desconocido", reflection: text });
  } catch (e) {
    // En no-cors es normal no ver respuesta; esto solo captura errores de red “duros”.
  }

  reflectionMsg.textContent = "Gracias por compartirlo 💙";
  reflectionMsg.className = "text-success mt-2";
  reflectionMsg.classList.remove("d-none");

  // Quitar textarea y cabecera, dejar SOLO felicitación
  setTimeout(() => {
    reflectionBlock.classList.add("fade-out");
  }, 450);

  setTimeout(() => {
    reflectionBlock.style.display = "none";
    giftText.classList.remove("d-none");
    giftText.style.fontSize = "2.4rem";
  }, 1050);
});

/* ================= AUTO-SKIP si ya hay nombre ================= */
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("visitorName");
  if (saved && saved.trim()) {
    visitorName = saved.trim();
    parts = buildParts(visitorName);
    hideOverlay();
    showLetter(visitorName);
  }
});
