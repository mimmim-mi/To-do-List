function filterByStatus(tasks, status) {
    if (status === 'all') return tasks;
    if (status === 'done') return tasks.filter(t => t.done);
    if (status === 'undone') return tasks.filter(t => !t.done);
    return tasks;
}

function filterByPriority(tasks, priority) {
    if (priority === 'all') return tasks;
    return tasks.filter(t => t.priority === priority);
}

function filterByDate(tasks, selectedDate) {
    if (!selectedDate) return tasks;

    return tasks.filter(t => {
        const taskDate = t.deadline.split("T")[0];  
        return taskDate === selectedDate;
    });
}

function sortByDeadline(tasks) {
    return tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

function notifyBeforeDeadline(task) {
    if (!("Notification" in window) || !('permission' in Notification)) {
        return;
    }
    if (Notification.permission === "granted") {
        const now = Date.now();
        const deadline = new Date(task.deadline).getTime();
        const notifyTime = deadline - 5 * 60 * 1000;
        const delay = notifyTime - now;

        if (delay > 0) {
            setTimeout(() => {
                new Notification(`Công việc "${task.title}" sắp hết hạn!`);
            }, delay);
        }
    }
}
