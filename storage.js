function getTasks() {
    // Lấy danh sách công việc từ localStorage; nếu chưa có thì trả về mảng rỗng
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    return tasks ? tasks : [];
}

function saveTasks(tasks) {
    // Lưu mảng công việc vào localStorage dưới dạng JSON
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(task) {
    // Thêm công việc mới 
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
}

function updateTask(updatedTask) {
    // Cập nhật công việc 
    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
        tasks[index] = updatedTask;
        saveTasks(tasks);
    }
}

function removeTask(taskId) {
    // Xóa công việc theo id
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks(tasks);
}
