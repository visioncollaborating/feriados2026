const calendarData = {
  0: [["1", "Año Nuevo (Feriado)"]],
  3: [["2", "Jueves Santo (Feriado)"], ["3", "Viernes Santo (Feriado)"]],
  4: [["1", "Día del Trabajo (Feriado)"]],
  5: [["7", "Día de la Bandera (Feriado)"], ["29", "San Pedro y San Pablo (Feriado)"]],
  6: [["6", "Día del Maestro"], ["23", "Día Fuerza Aérea (Feriado)"], ["28", "Fiestas Patrias (Feriado)"], ["29", "Fiestas Patrias (Feriado)"]],
  7: [["6", "Batalla de Junín (Feriado)"], ["30", "Santa Rosa de Lima (Feriado)"]],
  8: [["7", "Día del Agente Inmobiliario"]],
  9: [["5", "Día Mundial del Hábitat"], ["8", "Combate de Angamos (Feriado)"]],
  10: [["1", "Todos los Santos (Feriado)"], ["8", "Día Mundial del Urbanismo"]],
  11: [["8", "Inmaculada Concepción (Feriado)"], ["9", "Batalla de Ayacucho (Feriado)"], ["25", "Navidad (Feriado)"]]
};

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const monthShort = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const images = Array.from({ length: 12 }, (_, index) => `img/${index + 1}.jpg`);

const els = {
  image: document.getElementById("mainImg"),
  title: document.getElementById("monthTitle"),
  summary: document.getElementById("eventSummary"),
  number: document.getElementById("monthNumber"),
  progress: document.getElementById("progressBar"),
  count: document.getElementById("eventCount"),
  list: document.getElementById("list"),
  prev: document.getElementById("prevBtn"),
  next: document.getElementById("nextBtn"),
  dots: document.getElementById("monthDots"),
  hero: document.getElementById("hero")
};

let currentMonth = 0;
let touchStartX = 0;

function classifyEvent(title) {
  const isHoliday = title.toLowerCase().includes("feriado");
  if (title.includes("Navidad")) return { type: "Celebración", icon: "✦" };
  if (title.includes("Fiestas Patrias")) return { type: "Fecha nacional", icon: "◆" };
  if (title.includes("Maestro")) return { type: "Conmemoración", icon: "✎" };
  if (title.includes("Inmobiliario") || title.includes("Urbanismo") || title.includes("Hábitat")) return { type: "Fecha profesional", icon: "⌂" };
  return { type: isHoliday ? "Feriado nacional" : "Conmemoración", icon: isHoliday ? "★" : "•" };
}

function cleanTitle(title) {
  return title.replace(/\s*\(Feriado\)\s*/i, "");
}

function buildDots() {
  els.dots.innerHTML = months.map((month, index) => `
    <button class="month-dot${index === currentMonth ? " active" : ""}" type="button" data-month="${index}" aria-label="Ir a ${month}" aria-current="${index === currentMonth ? "true" : "false"}"></button>
  `).join("");
}

function renderEvents(events) {
  if (!events.length) {
    els.list.innerHTML = `
      <div class="empty-state">
        <strong>Sector despejado</strong>
        No hay eventos registrados durante este mes.
      </div>`;
    return;
  }

  els.list.innerHTML = events.map((event, index) => {
    const [day, title] = event;
    const meta = classifyEvent(title);
    return `
      <article class="event-card" style="animation-delay:${index * 70}ms">
        <div class="event-date" aria-label="${day} de ${months[currentMonth]}">
          <span class="event-day">${day.padStart(2, "0")}</span>
          <span class="event-month">${monthShort[currentMonth]}</span>
        </div>
        <div class="event-info">
          <span class="event-title">${cleanTitle(title)}</span>
          <span class="event-type">${meta.type}</span>
        </div>
        <span class="event-icon" aria-hidden="true">${meta.icon}</span>
      </article>`;
  }).join("");
}

function render({ animateImage = true } = {}) {
  const events = calendarData[currentMonth] || [];
  const total = events.length;

  els.title.textContent = months[currentMonth];
  els.summary.textContent = total === 1 ? "1 evento este mes" : `${total} eventos este mes`;
  els.number.textContent = `${String(currentMonth + 1).padStart(2, "0")} / 12`;
  els.progress.style.width = `${((currentMonth + 1) / 12) * 100}%`;
  els.count.textContent = total;
  els.prev.disabled = currentMonth === 0;
  els.next.disabled = currentMonth === 11;

  if (animateImage) {
    els.image.classList.add("is-changing");
    window.setTimeout(() => {
      els.image.src = images[currentMonth];
      els.image.alt = `Imagen del mes de ${months[currentMonth].toLowerCase()}`;
      els.image.onload = () => els.image.classList.remove("is-changing");
    }, 170);
  } else {
    els.image.src = images[currentMonth];
  }

  renderEvents(events);
  buildDots();
}

function move(direction) {
  const target = Math.max(0, Math.min(11, currentMonth + direction));
  if (target === currentMonth) return;
  currentMonth = target;
  render();
}

els.prev.addEventListener("click", () => move(-1));
els.next.addEventListener("click", () => move(1));

els.dots.addEventListener("click", (event) => {
  const button = event.target.closest("[data-month]");
  if (!button) return;
  const target = Number(button.dataset.month);
  if (target !== currentMonth) {
    currentMonth = target;
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") move(-1);
  if (event.key === "ArrowRight") move(1);
});

els.hero.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

els.hero.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) < 45) return;
  move(distance > 0 ? -1 : 1);
}, { passive: true });

render({ animateImage: false });
