document.addEventListener('DOMContentLoaded', getTodos);
document.getElementById('todo-form').addEventListener('submit', addTodo);
document.getElementById('todo-list').addEventListener('click', modifyOrDeleteTodo);
document.getElementById('filter-todo').addEventListener('change', filterTodo);

function addTodo(event) {
    event.preventDefault();
    const todoInput = document.getElementById('todo-input').value;
    if (todoInput === '') return;

    const todo = {
        text: todoInput,
        timestamp: new Date().toLocaleString(),
        completed: false
    };

    saveLocalTodos(todo);
    addTodoToDOM(todo);
    document.getElementById('todo-input').value = '';
}

function addTodoToDOM(todo) {
    const todoList = document.getElementById('todo-list');
    const todoItem = document.createElement('li');
    todoItem.classList.add('list-group-item');
    if (todo.completed) {
        todoItem.classList.add('completed');
    }
    todoItem.innerHTML = `
        <input type="checkbox" class="complete-checkbox" ${todo.completed ? 'checked' : ''}>
        <input type="text" class="todo-text" value="${todo.text}" readonly>
        <small class="text-muted todo-timestamp">${todo.timestamp}</small>
        <button class="btn btn-warning btn-sm float-right edit-btn" ${todo.completed ? 'style="display:none;"' : ''}>✏️</button>
        <button class="btn btn-danger btn-sm float-right mr-2 trash-btn">🗑</button>
    `;
    todoList.appendChild(todoItem);
}

function modifyOrDeleteTodo(event) {
    const item = event.target;
    const todoItem = item.parentElement;

    if (item.classList.contains('trash-btn')) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            todoItem.classList.add('slide-out');
            todoItem.addEventListener('animationend', function() {
                removeLocalTodos(todoItem);
                todoItem.remove();
            });
        }
    }

    if (item.classList.contains('complete-checkbox')) {
        todoItem.classList.toggle('completed');
        updateLocalTodos(todoItem);
        const editBtn = todoItem.querySelector('.edit-btn');
        editBtn.style.display = todoItem.classList.contains('completed') ? 'none' : 'inline-block';
    }

    if (item.classList.contains('edit-btn')) {
        const todoText = todoItem.querySelector('.todo-text');
        const checkbox = todoItem.querySelector('.complete-checkbox');
        const trashBtn = todoItem.querySelector('.trash-btn');
        if (todoText.readOnly) {
            todoText.readOnly = false;
            todoText.focus();
            checkbox.style.display = 'none';
            trashBtn.style.display = 'none';
            item.innerHTML = '💾'; // Change icon to save
        } else {
            todoText.readOnly = true;
            updateLocalTodos(todoItem);
            checkbox.style.display = 'inline-block';
            trashBtn.style.display = 'inline-block';
            item.innerHTML = '✏️'; // Change icon back to edit
        }
    }
}41576018

function saveLocalTodos(todo) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.forEach(todo => addTodoToDOM(todo));
}

function removeLocalTodos(todoItem) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const todoText = todoItem.querySelector('.todo-text').value;
    todos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateLocalTodos(todoItem) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const todoText = todoItem.querySelector('.todo-text').value;
    const todoIndex = todos.findIndex(todo => todo.text === todoText);
    if (todoIndex !== -1) {
        todos[todoIndex].text = todoText;
        todos[todoIndex].completed = todoItem.classList.contains('completed');
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function filterTodo() {
    const filter = document.getElementById('filter-todo').value;
    const todos = document.querySelectorAll('.list-group-item');
    todos.forEach(todo => {
        switch (filter) {
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'completed':
                if (todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if (!todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                } else {
                    todo.style.display = 'none';
                }
                break;
        }
    });
}














