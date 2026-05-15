let pending = [];
let done = [];

function getDatePrefix() {
  const d = new Date();
  return d.getFullYear().toString() +
    String(d.getMonth()+1).padStart(2,'0') +
    String(d.getDate()).padStart(2,'0');
}

async function getNextId() {
  const snapshot = await db.collection("tasks").get();
  const prefix = getDatePrefix();

  const todayItems = snapshot.docs.filter(doc =>
    doc.data().id.startsWith(prefix)
  );

  return `${prefix}-${String(todayItems.length + 1).padStart(3,'0')}`;
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (!text) return;

  const id = await getNextId();

  const task = {
    id,
    text,
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
    status: "pending"
  };

  await db.collection("tasks").add(task);

  input.value = "";
}

async function markDone(docId) {
  await db.collection("tasks").doc(docId).update({
    status: "done"
  });
}

function render(snapshot) {
  const pendingList = document.getElementById("pendingList");
  const doneList = document.getElementById("doneList");

  pendingList.innerHTML = "";
  doneList.innerHTML = "";

  snapshot.forEach(doc => {
    const task = doc.data();

    const card = `
      <div class="card">
        <strong>${task.id}</strong><br/>
        ${task.text}
        <div class="meta">${task.date} - ${task.time}</div>
        ${
          task.status === "pending"
            ? `<div class="actions">
                <button onclick="markDone('${doc.id}')">Transferido</button>
               </div>`
            : ""
        }
      </div>
    `;

    if (task.status === "pending") {
      pendingList.innerHTML += card;
    } else {
      doneList.innerHTML += card;
    }
  });
}

db.collection("tasks")
  .orderBy("id", "desc")
  .onSnapshot(render);

function showTab(tab) {
  document.getElementById("pendingList").classList.add("hidden");
  document.getElementById("doneList").classList.add("hidden");

  document.querySelectorAll(".tab").forEach(t =>
    t.classList.remove("active")
  );

  if (tab === "pending") {
    pendingList.classList.remove("hidden");
    document.querySelectorAll(".tab")[0].classList.add("active");
  } else {
    doneList.classList.remove("hidden");
    document.querySelectorAll(".tab")[1].classList.add("active");
  }
}
