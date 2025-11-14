// DOM Elements
        const todoForm = document.getElementById('todoForm');
        const todoInput = document.getElementById('todoInput');
        const dateInput = document.getElementById('dateInput');
        const taskError = document.getElementById('taskError');
        const dateError = document.getElementById('dateError');
        const todosContainer = document.getElementById('todosContainer');
        const emptyState = document.getElementById('emptyState');
        const filterDate = document.getElementById('filterDate');
        const clearFilterBtn = document.getElementById('clearFilter');
        const clearAllBtn = document.getElementById('clearAll');

        // Initialize todos array from localStorage or empty array
        let todos = JSON.parse(localStorage.getItem('todos')) || [];

        // Display todos on page load
        displayTodos();

        // Form submission handler
        todoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Reset errors
            resetErrors()
            // Validate form
            if (validateForm()) {
                // Add todo to array
                addTodo(todoInput.value, dateInput.value);
                // Clear form
                todoForm.reset();
                // Display todos
                displayTodos();
            }
        });

        // Filter functionality
        filterDate.addEventListener('change', function() {
            displayTodos(this.value);
        });

        // Clear filter functionality
        clearFilterBtn.addEventListener('click', function() {
            filterDate.value = '';
            displayTodos();
        });

        // Clear all functionality
        clearAllBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete all tasks?')) {
                todos = [];
                saveTodos();
                displayTodos();
            }
        });

        // Function to add a todo
        function addTodo(task, date) {
            const todo = {
                id: Date.now(),
                task: task,
                date: date,
                completed: false
            };

            todos.push(todo);
            saveTodos();
        }

        // Function to delete a todo
        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            displayTodos();
        }

        // Function to display todos
        function displayTodos(filterDate = '') {
            // Clear container
            todosContainer.innerHTML = '';

            // Filter todos if date is provided
            let filteredTodos = todos;
            if (filterDate) {
                filteredTodos = todos.filter(todo => todo.date === filterDate);
            }

            // Show empty state if no todos
            if (filteredTodos.length === 0) {
                todosContainer.appendChild(emptyState);
                emptyState.style.display = 'block';
                emptyState.textContent = filterDate ?
                    'No tasks for this date' :
                    'No tasks yet. Add a task to get started!';
                return;
            }

            emptyState.style.display = 'none';

            // Create and append todo items
            filteredTodos.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.className = 'todo-item';

                const todoContent = document.createElement('div');
                todoContent.className = 'todo-content';

                const todoTitle = document.createElement('div');
                todoTitle.className = 'todo-title';
                todoTitle.textContent = todo.task;

                const todoDate = document.createElement('div');
                todoDate.className = 'todo-date';
                todoDate.textContent = formatDate(todo.date);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-delete';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

                todoContent.appendChild(todoTitle);
                todoContent.appendChild(todoDate);
                todoItem.appendChild(todoContent);
                todoItem.appendChild(deleteBtn);

                todosContainer.appendChild(todoItem);
            });
        }

        // Function to validate form
        function validateForm() {
            let isValid = true;

            if (todoInput.value.trim() === '') {
                todoInput.classList.add('error');
                taskError.style.display = 'block';
                isValid = false;
            }

            if (dateInput.value === '') {
                dateInput.classList.add('error');
                dateError.style.display = 'block';
                isValid = false;
            }

            return isValid;
        }

        // Function to reset errors
        function resetErrors() {
            todoInput.classList.remove('error');
            dateInput.classList.remove('error');
            taskError.style.display = 'none';
            dateError.style.display = 'none';
        }

        // Function to save todos to localStorage
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        // Function to format date for display
        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }
