document.addEventListener('DOMContentLoaded', () => {
    let editTaskId = null;
    const titleInput = document.getElementById('task-title');
    const deadlineInput = document.getElementById('task-deadline');
    const priorityInput = document.getElementById('task-priority');
    const addBtn = document.getElementById('add-task-btn');

    const filterStatus = document.getElementById('filter-status');
    const filterPriority = document.getElementById('filter-priority');
    const filterDate = document.getElementById('filter-date');

    const taskList = document.getElementById('task-list');

    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    function renderTasks() {
        let tasks = getTasks();
        tasks = sortByDeadline(tasks);
        tasks = filterByStatus(tasks, filterStatus.value);
        tasks = filterByPriority(tasks, filterPriority.value);
        tasks = filterByDate(tasks, filterDate.value);

        taskList.innerHTML = '';
        tasks.forEach(task => {
            const tr = document.createElement('tr');
            tr.dataset.id = task.id;
            if (task.done) tr.classList.add('done');

            const deadlineText = new Date(task.deadline).toLocaleString();

            tr.innerHTML = `
                <td>${task.title}</td>
                <td>${deadlineText}</td>
                <td>${task.priority}</td>
                <td>${task.done ? "Đã làm" : "Chưa làm"}</td>
                <td>
                    <i class="fas ${task.done ? 'fa-undo' : 'fa-check'} toggle-btn" title="${task.done ? 'Chưa làm' : 'Hoàn thành'}"></i>
                    <i class="fas fa-pencil-alt edit-btn" title="Sửa"></i>
                    <i class="fas fa-trash delete-btn" title="Xóa"></i>
                </td>
            `;
            taskList.appendChild(tr);

            tr.querySelector('.toggle-btn').addEventListener('click', () => {
                task.done = !task.done;
                updateTask(task);
                renderTasks();
            });

            tr.querySelector('.edit-btn').addEventListener('click', () => {
                editTaskId = task.id;
                titleInput.value = task.title;
                deadlineInput.value = task.deadline;
                priorityInput.value = task.priority;
                addBtn.textContent = "Cập nhật";
            });

            tr.querySelector('.delete-btn').addEventListener('click', () => {
                removeTask(task.id);
                renderTasks();
            });
        });
    }

    addBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const deadline = deadlineInput.value;
        const priority = priorityInput.value;

        if (title === '' || deadline === '') {
            alert("Vui lòng nhập đầy đủ thông tin công việc và deadline.");
            return;
        }

        if (editTaskId) {
            const tasks = getTasks();
            const task = tasks.find(t => t.id === editTaskId);
            if (task) {
                task.title = title;
                task.deadline = deadline;
                task.priority = priority;
                updateTask(task);
            }
            editTaskId = null;
            addBtn.textContent = "Thêm công việc";

        } else {
            const newTask = {
                id: Date.now(),
                title: title,
                deadline: deadline,
                priority: priority,
                done: false
            };
            addTask(newTask);
            notifyBeforeDeadline(newTask);
        }

        titleInput.value = '';
        deadlineInput.value = '';
        renderTasks();
    });

    filterStatus.addEventListener('change', renderTasks);
    filterPriority.addEventListener('change', renderTasks);
    filterDate.addEventListener('change', renderTasks);

    renderTasks();

    getTasks().forEach(task => {
        if (!task.done) notifyBeforeDeadline(task);
    });
});
