let pending = JSON.parse(localStorage.getItem("pending")) || [];
let done = JSON.parse(localStorage.getItem("done")) || [];

function getDatePrefix() {
  const d = new Date();
  return d.getFullYear().toString() +
    String(d.getMonth()+1).padStart(2,'0') +
    String(d.getDate()).padStart(2,'0');
}

function getNextId() {
  const prefix = getDatePrefix();
  const todayItems = pending.concat(done).filter(i => i.id.startsWith(prefix));
  return `${prefix}-${String(todayItems.length + 1).padStart(3,'0')}`;
}

function saveData() {
  localStorage.setItem("pending", JSON.stringify(pending));
  localStorage.setItem("done", JSON.stringify(done));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (!text) return;

  const task = {
    id: getNextId(),
    text,
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString()
  };

  pending.unshift(task);
  saveData();
  input.value = "";
  render();
}

function markDone(id) {
  const index = pending.findIndex(t => t.id === id);
  if (index === -1) return;

  done.unshift(pending[index]);
  pending.splice(index, 1);
  saveData();
  render();
}

function render() {
  const pendingList = document.getElementById("pendingList");
  const doneList = document.getElementById("doneList");

  pendingList.innerHTML = "";
  doneList.innerHTML = "";

  pending.forEach(task => {
    pendingList.innerHTML += createCard(task, true);
  });

  done.forEach(task => {
    doneList.innerHTML += createCard(task, false);
  });
}

function createCard(task, isPending) {
  return `
    <div class="card">
      <strong>${task.id}</strong><br/>
      ${task.text}
      <div class="meta">${task.date} - ${task.time}</div>

      <div class="actions">
        ${isPending ? `<button onclick="markDone('${task.id}')">Transferido</button>` : ""}
      </div>
    </div>
  `;
}

function showTab(tab) {
  document.getElementById("pendingList").classList.add("hidden");
  document.getElementById("doneList").classList.add("hidden");

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

  if (tab === "pending") {
    document.getElementById("pendingList").classList.remove("hidden");
    document.querySelectorAll(".tab")[0].classList.add("active");
  } else {
    document.getElementById("doneList").classList.remove("hidden");
    document.querySelectorAll(".tab")[1].classList.add("active");
  }
}

render();