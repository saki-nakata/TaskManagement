package com.taskmanagement.service;

import com.taskmanagement.mapper.TaskMapper;
import com.taskmanagement.model.Task;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskMapper taskMapper;

    public TaskService(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }

    public List<Task> search(String keyword, String status) {
        return taskMapper.search(keyword, status);
    }

    @Transactional
    public Task update(Integer id, Task task) {
        task.setId(id);
        if (task.getStatus() == null || task.getStatus().isBlank()) task.setStatus("TODO");
        if (task.getPriority() == null || task.getPriority().isBlank()) task.setPriority("MEDIUM");
        taskMapper.update(task);
        return taskMapper.findById(id);
    }

    @Transactional
    public Task create(Task task) {
        if (task.getStatus() == null || task.getStatus().isBlank()) task.setStatus("TODO");
        if (task.getPriority() == null || task.getPriority().isBlank()) task.setPriority("MEDIUM");
        taskMapper.insert(task);
        return task;
    }
}
