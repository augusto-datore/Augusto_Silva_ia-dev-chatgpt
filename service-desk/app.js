const STORAGE_KEY = "serviceDeskTickets";

const seedTickets = [
  {
    id: 1001,
    requester: "Marina Costa",
    email: "marina.costa@empresa.com",
    category: "Acesso",
    priority: "Alta",
    status: "Aberto",
    title: "Senha expirada no sistema de vendas",
    description: "Ao tentar entrar no sistema de vendas, recebo a mensagem de senha expirada e não consigo redefinir pelo portal.",
    correction: "",
    createdAt: "2026-06-18T11:20:00.000Z",
    updatedAt: "2026-06-18T11:20:00.000Z",
    events: [
      "Chamado aberto por Marina Costa."
    ]
  },
  {
    id: 1002,
    requester: "Rafael Lima",
    email: "rafael.lima@empresa.com",
    category: "Hardware",
    priority: "Média",
    status: "Em atendimento",
    title: "Notebook reiniciando sozinho",
    description: "O notebook reinicia durante reuniões e apresentações. Isso ocorreu quatro vezes nesta semana.",
    correction: "Equipamento em análise para troca preventiva de memória.",
    createdAt: "2026-06-17T14:40:00.000Z",
    updatedAt: "2026-06-18T09:15:00.000Z",
    events: [
      "Chamado aberto por Rafael Lima.",
      "Status alterado para Em atendimento."
    ]
  }
];

const allowedStatuses = [
  "Aberto",
  "Em atendimento",
  "Aguardando usuário",
  "Resolvido"
];

const allowedPriorities = [
  "Baixa",
  "Média",
  "Alta",
  "Crítica"
];

const views = document.querySelectorAll(".view");
const tabs = document.querySelectorAll(".tab");
const ticketForm = document.querySelector("#ticketForm");
const ticketList = document.querySelector("#ticketList");
const ticketDetails = document.querySelector("#ticketDetails");
const ticketCounter = document.querySelector("#ticketCounter");
const historyTable = document.querySelector("#historyTable");
const searchInput = document.querySelector("#searchInput");
const clearData = document.querySelector("#clearData");
const toast = document.querySelector("#toast");

let toastTimeout;

let tickets = loadTickets();
let selectedTicketId = tickets[0]?.id ?? null;

function activateView(tab) {
  const targetView = document.getElementById(tab.dataset.view);

  if (!targetView) return;

  tabs.forEach((item) => {
    const isActive = item === tab;

    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  views.forEach((view) => {
    const isActive = view === targetView;

    view.classList.toggle("is-active", isActive);
    view.hidden = !isActive;
  });

  render();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateView(tab);
  });

  tab.addEventListener("keydown", (event) => {
    const currentIndex = Array.from(tabs).indexOf(tab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    tabs[nextIndex].focus();
    activateView(tabs[nextIndex]);
  });
});


// ABERTURA DE CHAMADOS

ticketForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const requester = document.querySelector("#requester").value.trim();
  const email = document.querySelector("#email").value.trim();
  const category = document.querySelector("#category").value;
  const priority = document.querySelector("#priority").value;
  const title = document.querySelector("#title").value.trim();
  const description = document.querySelector("#description").value.trim();

  if (!requester || !email || !category || !priority || !title || !description) {
    showToast("Preencha todos os campos antes de enviar.");
    return;
  }

  const now = new Date().toISOString();

  const newTicket = {
    id: nextId(),
    requester,
    email,
    category,
    priority,
    status: "Aberto",
    title,
    description,
    correction: "",
    createdAt: now,
    updatedAt: now,
    events: [`Chamado aberto por ${requester}.`]
  };

  const previousSelectedId = selectedTicketId;

  tickets.unshift(newTicket);
  selectedTicketId = newTicket.id;

  if (!saveTickets()) {
    tickets.shift();
    selectedTicketId = previousSelectedId;
    return;
  }

  ticketForm.reset();

  showToast(`Chamado #${newTicket.id} aberto com sucesso.`);

  render();
});


// BUSCA DE CHAMADOS

searchInput.addEventListener("input", renderTicketList);

clearData.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Isso apagará os chamados salvos neste navegador e restaurará os dados de demonstração. Deseja continuar?"
  );

  if (!confirmed) return;

  const previousTickets = tickets;
  const previousSelectedId = selectedTicketId;

  tickets = seedTickets.map((ticket) => ({
    ...ticket,
    events: [...ticket.events]
  }));

  selectedTicketId = tickets[0]?.id ?? null;

  if (!saveTickets()) {
    tickets = previousTickets;
    selectedTicketId = previousSelectedId;

    render();
    return;
  }

  showToast("Dados de demonstração restaurados.");

  render();
});


// CARREGAMENTO DOS CHAMADOS

function loadTickets() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      const initialTickets = seedTickets.map((ticket) => ({
        ...ticket,
        events: [...ticket.events]
      }));

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialTickets)
      );

      return initialTickets;
    }

    const parsedTickets = JSON.parse(stored);

    if (!Array.isArray(parsedTickets)) {
      throw new Error("O conteúdo salvo não é uma lista de chamados.");
    }

    return parsedTickets
      .map(normalizeTicket)
      .filter((ticket) => ticket !== null);

  } catch (error) {
    console.error("Não foi possível carregar os chamados:", error);

    showToast(
      "Não foi possível ler os dados salvos. A base de demonstração será carregada."
    );

    return seedTickets.map((ticket) => ({
      ...ticket,
      events: [...ticket.events]
    }));
  }
}


// VALIDAÇÃO DOS CHAMADOS

function normalizeTicket(ticket) {
  if (!ticket || typeof ticket !== "object") {
    return null;
  }

  const id = Number(ticket.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  if (
    typeof ticket.requester !== "string" ||
    typeof ticket.email !== "string" ||
    typeof ticket.category !== "string" ||
    typeof ticket.title !== "string" ||
    typeof ticket.description !== "string" ||
    typeof ticket.correction !== "string"
  ) {
    return null;
  }

  if (!allowedStatuses.includes(ticket.status)) {
    return null;
  }

  if (!allowedPriorities.includes(ticket.priority)) {
    return null;
  }

  if (
    typeof ticket.createdAt !== "string" ||
    typeof ticket.updatedAt !== "string" ||
    Number.isNaN(Date.parse(ticket.createdAt)) ||
    Number.isNaN(Date.parse(ticket.updatedAt))
  ) {
    return null;
  }

  if (
    !Array.isArray(ticket.events) ||
    !ticket.events.every((event) => typeof event === "string")
  ) {
    return null;
  }

  return {
    ...ticket,
    id,
    events: [...ticket.events]
  };
}


function saveTickets() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tickets)
    );

    return true;

  } catch (error) {
    console.error("Não foi possível salvar os chamados:", error);

    showToast(
      "Erro ao salvar. Verifique o armazenamento do navegador."
    );

    return false;
  }
}


// GERAÇÃO DE ID

function nextId() {
  if (tickets.length === 0) {
    return 1001;
  }

  const highestId = Math.max(
    ...tickets.map((ticket) => Number(ticket.id) || 0)
  );

  return highestId + 1;
}


// ATUALIZAÇÃO DAS TELAS

function render() {
  renderTicketList();
  renderTicketDetails();
  renderHistory();
}

function renderTicketList() {
  const term = searchInput.value.trim().toLowerCase();
  const filteredTickets = tickets.filter((ticket) => {
    return (
      String(ticket.id).includes(term) ||
      ticket.title.toLowerCase().includes(term)
    );
  });

  ticketCounter.textContent = `${filteredTickets.length} chamado${filteredTickets.length === 1 ? "" : "s"}`;

  if (filteredTickets.length === 0) {
    ticketList.innerHTML = '<div class="empty-state"><p>Nenhum chamado encontrado.</p></div>';
    return;
  }

  ticketList.innerHTML = filteredTickets.map((ticket) => `
    <button class="ticket-card ${ticket.id === selectedTicketId ? "is-selected" : ""}" data-ticket-id="${ticket.id}">
      <span class="ticket-title">#${ticket.id} - ${escapeHtml(ticket.title)}</span>
      <span class="ticket-meta">${escapeHtml(ticket.requester)} • ${formatDate(ticket.updatedAt)}</span>
      <span class="badge-row">
        <span class="badge ${statusClass(ticket.status)}">${ticket.status}</span>
        <span class="badge ${priorityClass(ticket.priority)}">${ticket.priority}</span>
      </span>
    </button>
  `).join("");

  document.querySelectorAll(".ticket-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedTicketId = Number(card.dataset.ticketId);
      renderTicketList();
      renderTicketDetails();
    });
  });
}

function renderTicketDetails() {
  const ticket = tickets.find((item) => item.id === selectedTicketId);

  if (!ticket) {
    ticketDetails.innerHTML = `
      <div class="empty-state">
        <h3>Selecione um chamado</h3>
        <p>Ao escolher um item da fila, os campos de status, prioridade e correção aparecem aqui.</p>
      </div>
    `;
    return;
  }

  ticketDetails.innerHTML = `
    <div class="details-header">
      <div>
        <p class="eyebrow">Chamado #${ticket.id}</p>
        <h3>${escapeHtml(ticket.title)}</h3>
        <p class="ticket-meta">Aberto por ${escapeHtml(ticket.requester)} em ${formatDate(ticket.createdAt)}</p>
      </div>
      <span class="badge ${statusClass(ticket.status)}">${ticket.status}</span>
    </div>

    <div class="details-grid">
      <label>
        Status
        <select id="detailStatus">
          <option ${ticket.status === "Aberto" ? "selected" : ""}>Aberto</option>
          <option ${ticket.status === "Em atendimento" ? "selected" : ""}>Em atendimento</option>
          <option ${ticket.status === "Aguardando usuário" ? "selected" : ""}>Aguardando usuário</option>
          <option ${ticket.status === "Resolvido" ? "selected" : ""}>Resolvido</option>
        </select>
      </label>
      <label>
        Prioridade
        <select id="detailPriority">
          <option ${ticket.priority === "Baixa" ? "selected" : ""}>Baixa</option>
          <option ${ticket.priority === "Média" ? "selected" : ""}>Média</option>
          <option ${ticket.priority === "Alta" ? "selected" : ""}>Alta</option>
          <option ${ticket.priority === "Crítica" ? "selected" : ""}>Crítica</option>
        </select>
      </label>
    </div>

    <label>
      Descrever correção
      <textarea id="detailCorrection" rows="5" placeholder="Informe a solução aplicada ou próxima ação.">${escapeHtml(ticket.correction)}</textarea>
    </label>

    <div class="description-box">
      <strong>Descrição do usuário</strong>
      <p>${escapeHtml(ticket.description)}</p>
      <p class="ticket-meta">${escapeHtml(ticket.category)} • ${escapeHtml(ticket.email)}</p>
    </div>

    <div class="form-actions">
      <button class="primary" id="saveTicket">Salvar alterações</button>
    </div>

    <div class="history-box">
      <strong>Histórico deste chamado</strong>
      <ul>
        ${ticket.events.map((event) => `<li class="history-line">${escapeHtml(event)}</li>`).join("")}
      </ul>
    </div>
  `;

  document.querySelector("#saveTicket").addEventListener("click", () => updateSelectedTicket(ticket.id));
}

function updateSelectedTicket(ticketId) {
  const ticket = tickets.find(
    (item) => Number(item.id) === Number(ticketId)
  );

  if (!ticket) return;

  const newStatus = document.querySelector("#detailStatus").value;
  const newPriority = document.querySelector("#detailPriority").value;

  const newCorrection = document
    .querySelector("#detailCorrection")
    .value
    .trim();

  const eventList = [];

  if (ticket.status !== newStatus) {
    eventList.push(
      `Status alterado de ${ticket.status} para ${newStatus}.`
    );
  }

  if (ticket.priority !== newPriority) {
    eventList.push(
      `Prioridade alterada de ${ticket.priority} para ${newPriority}.`
    );
  }

  if (ticket.correction !== newCorrection) {
    eventList.push(
      newCorrection
        ? `Correção registrada: ${newCorrection}`
        : "Registro de correção removido."
    );
  }

  if (eventList.length === 0) {
    showToast("Nenhuma alteração foi realizada.");
    return;
  }

  const previousTicket = {
    ...ticket,
    events: [...(ticket.events || [])]
  };

  ticket.status = newStatus;
  ticket.priority = newPriority;
  ticket.correction = newCorrection;
  ticket.updatedAt = new Date().toISOString();

  ticket.events = [
    ...(ticket.events || []),
    ...eventList
  ];

  if (!saveTickets()) {
    Object.assign(ticket, previousTicket);

    render();

    return;
  }

  showToast(`Chamado #${ticket.id} atualizado.`);

  render();
}


// HISTÓRICO GERAL

function renderHistory() {
  historyTable.innerHTML = tickets.map((ticket) => `
    <tr>
      <td>#${ticket.id}</td>
      <td>${escapeHtml(ticket.title)}</td>
      <td>${escapeHtml(ticket.requester)}</td>
      <td><span class="badge ${statusClass(ticket.status)}">${ticket.status}</span></td>
      <td><span class="badge ${priorityClass(ticket.priority)}">${ticket.priority}</span></td>
      <td>${formatDate(ticket.updatedAt)}</td>
    </tr>
  `).join("");
}

function statusClass(status) {
  return `status-${status.toLowerCase().replaceAll(" ", "-")}`;
}

function priorityClass(priority) {
  return `priority-${priority.toLowerCase()}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  toast.textContent = message;

  toast.classList.add("is-visible");

  window.clearTimeout(toastTimeout);

  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

render();
