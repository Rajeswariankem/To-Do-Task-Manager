const input_box = document.getElementById("task-input");
const btn = document.getElementById("add-btn");
const list = document.getElementById("task-list");

const com = document.getElementById("com-btn");
const del = document.getElementById("del-btn");

let totalcount = 0;
let completedcount = 0;
let deletedcount = 0;

const total = document.getElementById("total");
const completed = document.getElementById("completed");
const deleted = document.getElementById("deleted");

function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach((item) => {
    const checkbox = item.querySelector(".task-checkbox");
    const textel = item.querySelector(".task-text");
    const taskobj = {
      text: textel.textContent,
      completed: item.classList.contains("completed"),
    };
    tasks.push(taskobj);
  });

  localStorage.setItem("todo-app-tasks", JSON.stringify(tasks));
}

function saveStats() {
  const stats = {
    total: totalcount,
    completed: completedcount,
    deleted: deletedcount,
  };
  localStorage.setItem("todo-app-stats", JSON.stringify(stats));
}

btn.addEventListener("click", addTask);

input_box.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
function addTask() {
  const taskText = input_box.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const existing = document.querySelectorAll(".task-text");
  for (let task of existing) {
    if (task.textContent.trim().toLowerCase() === taskText.toLowerCase()) {
      alert("Task already exists!");
      input_box.value = "";
      return;
    }
  }
  const li = document.createElement("li");
  li.className = "task-item";
  const box = document.createElement("input");
  box.type = "checkbox";
  box.className = "task-checkbox";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = taskText;

  li.appendChild(box);
  li.appendChild(span);

  list.appendChild(li);
  totalcount++;
  total.textContent = totalcount;
  saveTasks();
  saveStats();
  input_box.value = "";
}

com.addEventListener("click", function () {
  const items = list.querySelectorAll(".task-item");
  if (items.length === 0) {
    alert("The list is empty — please add some tasks..!");
    return;
  }
  found = false;
  items.forEach(function (item) {
    const checkbox = item.querySelector(".task-checkbox");
    if (checkbox && checkbox.checked) {
      item.classList.add("completed");
      checkbox.checked = false;
      completedcount++;
      completed.textContent = completedcount;
      found = true;
      // checkbox.disabled = true;
    }
  });
  if (!found) {
    alert("Select a task to delete!");
  } else {
    saveTasks();
    saveStats();
  }
});

const undo = document.getElementById("undo-btn");
undo.addEventListener("click", function () {
  const items = list.querySelectorAll(".task-item");
  if (items.length === 0) {
    alert("The list is empty — please add some tasks..!");
    return;
  }
  let undone = false;
  items.forEach(function (item) {
    const checkbox = item.querySelector(".task-checkbox");
    if (checkbox && checkbox.checked && item.classList.contains("completed")) {
      item.classList.remove("completed");
      // checkbox.style.opacity = "1";
      // checkbox.style.boxShadow = "";
      // item.querySelector(".task-text").style.textDecoration = "none";
      // item.querySelector(".task-text").style.color = "#e0ecff";
      checkbox.checked = false;
      completedcount = Math.max(0, completedcount - 1);
      completed.textContent = completedcount;
      undone = true;
    }
  });
  if (undone) {
    saveTasks();
    saveStats();
  } else {
    alert("Select a completed task to undo!");
  }
});

del.addEventListener("click", function () {
  const items = list.querySelectorAll(".task-item");
  if (items.length === 0) {
    alert("The list is empty — please add some tasks..!");
    return;
  }
  found = false;
  items.forEach(function (item) {
    const checkbox = item.querySelector(".task-checkbox");
    if (checkbox && checkbox.checked) {
      item.remove();
      deletedcount++;
      deleted.textContent = deletedcount;
      found = true;
    }
  });
  if (!found) {
    alert("Select a task to delete!");
  } else {
    saveTasks();
    saveStats();
  }
});

const reset = document.getElementById("reset-btn");
reset.addEventListener("click", function () {
  if (!confirm("Are you sure you want to reset everything?")) return;

  list.innerHTML = "";
  totalcount = 0;
  completedcount = 0;
  deletedcount = 0;

  total.textContent = 0;
  completed.textContent = 0;
  deleted.textContent = 0;

  localStorage.removeItem("todo-app-tasks");
  localStorage.removeItem("todo-app-stats");
});

function loadTasks() {
  const saved = localStorage.getItem("todo-app-tasks");
  if (!saved) return;
  const tasks = JSON.parse(saved);
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    if (task.completed) {
      li.classList.add("completed");
    }
    li.appendChild(checkbox);
    li.appendChild(span);
    list.appendChild(li);
  });
}

function loadStats() {
  const saved = localStorage.getItem("todo-app-stats");
  if (!saved) return;
  const stats = JSON.parse(saved);

  totalcount = stats.total || 0;
  completedcount = stats.completed || 0;
  deletedcount = stats.deleted || 0;

  total.textContent = totalcount;
  completed.textContent = completedcount;
  deleted.textContent = deletedcount;
}

loadTasks();
loadStats();
