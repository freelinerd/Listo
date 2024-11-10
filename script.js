document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state">No hay tareas pendientes</p>';
        return;
    }

    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('taskPriority');
    const categorySelect = document.getElementById('taskCategory');
    const text = input.value.trim();

    if (text === '') return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: prioritySelect.value,
        category: categorySelect.value
    };

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    addTaskToDOM(task);
    input.value = '';
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('taskList');
    const emptyState = taskList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority}`;
    li.dataset.id = task.id;

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    if (task.completed) {
        taskText.classList.add('completed');
    }

    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag';
    categoryTag.textContent = task.category;

    const taskEditInput = document.createElement('input');
    taskEditInput.type = 'text';
    taskEditInput.className = 'task-edit-input';
    taskEditInput.value = task.text;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.onclick = () => toggleEditMode(task.id);

    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn-complete';
    completeBtn.textContent = task.completed ? '↩️' : '✓';
    completeBtn.onclick = () => toggleComplete(task.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(editBtn);
    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(categoryTag);
    li.appendChild(taskText);
    li.appendChild(taskEditInput);
    li.appendChild(actions);
    taskList.appendChild(li);
}

function toggleEditMode(id) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const taskText = taskItem.querySelector('.task-text');
    const taskEditInput = taskItem.querySelector('.task-edit-input');

    if (taskItem.classList.contains('task-edit-mode')) {
        // Save changes
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = taskEditInput.value;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskText.textContent = taskEditInput.value;
        }
        taskItem.classList.remove('task-edit-mode');
    } else {
        taskItem.classList.add('task-edit-mode');
        taskEditInput.focus();
    }
}

function toggleComplete(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function deleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    loadTasks();
}

document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.task-item')) {
        document.querySelectorAll('.task-edit-mode').forEach(item => {
            const id = parseInt(item.dataset.id);
            toggleEditMode(id);
        });
    }
});