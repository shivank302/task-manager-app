let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!title || !dueDate) {
        alert("Title and Due Date required!");
        return;
    }

    const task = {
        id: Date.now(),
        title,
        description,
        dueDate,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    displayTasks();

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        checkReminder(task);

        const div = document.createElement("div");
        div.className = "task" + (task.completed ? " completed" : "");

        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p><strong>Due:</strong> ${task.dueDate}</p>
            <button onclick="toggleComplete(${task.id})">✔</button>
            <button onclick="editTask(${task.id})">✏</button>
            <button onclick="deleteTask(${task.id})">🗑</button>
        `;

        taskList.appendChild(div);
    });
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    displayTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("dueDate").value = task.dueDate;
    deleteTask(id);
}

function filterTasks(type) {
    currentFilter = type;
    displayTasks();
}

function checkReminder(task) {
    const today = new Date();
    const due = new Date(task.dueDate);
    const diffTime = due - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (!task.completed && diffDays <= 1 && diffDays > 0) {
        alert(`Reminder: Task "${task.title}" is due soon!`);
    }
}

displayTasks();
