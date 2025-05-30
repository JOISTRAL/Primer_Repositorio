let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = 'all';

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function notify(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove("hidden");

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const counter = document.getElementById("taskCounter");
  taskList.innerHTML = "";

  let filtered = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    if (task.editing) {
      li.innerHTML = `
        <input class="edit-input" type="text" value="${task.text}" onkeydown="if(event.key==='Enter') updateTask(${index}, this.value)">
        <button onclick="updateTask(${index}, this.previousElementSibling.value)">💾</button>
        <button onclick="cancelEdit(${index})">✖️</button>
      `;
    } else {
      li.innerHTML = `
        <div class="task-content">
          <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
          <span class="task-text">${task.text}</span>
        </div>
        <div>
          <button onclick="editTask(${index})">✏️</button>
          <button onclick="deleteTask(${index})">❌</button>
        </div>
      `;
    }

    taskList.appendChild(li);
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  counter.textContent = `Total: ${total} | Completadas: ${done} | Pendientes: ${total - done}`;
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text !== "") {
    tasks.push({ text, completed: false, editing: false });
    input.value = "";
    saveTasks();
    renderTasks();
    notify("🆕 Tarea agregada");
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
  notify(tasks[index].completed ? "✅ Tarea completada" : "↩️ Tarea marcada como pendiente");
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  notify("🗑️ Tarea eliminada");
}

function editTask(index) {
  tasks[index].editing = true;
  renderTasks();
}

function cancelEdit(index) {
  tasks[index].editing = false;
  renderTasks();
}

function updateTask(index, newText) {
  tasks[index].text = newText;
  tasks[index].editing = false;
  saveTasks();
  renderTasks();
  notify("✏️ Tarea actualizada");
}

function setFilter(value) {
  filter = value;
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
  notify("🧹 Tareas completadas eliminadas");
}

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("toggleTheme");
  if (document.body.classList.contains("dark")) {
    btn.textContent = "☀️ Modo claro";
  } else {
    btn.textContent = "🌙 Modo oscuro";
  }
});

renderTasks();
