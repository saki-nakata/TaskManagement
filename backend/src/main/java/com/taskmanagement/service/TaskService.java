package com.taskmanagement.service;

import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.mapper.TaskMapper;
import com.taskmanagement.model.ReorderItem;
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
    public Task create(Task task) {
        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus("TODO");
        }
        if (task.getPriority() == null || task.getPriority().isBlank()) {
            task.setPriority("MEDIUM");
        }
        taskMapper.insert(task);
        return task;
    }

    @Transactional
    public Task update(Integer id, Task task) {
        if (taskMapper.findById(id) == null) {
            throw new ResourceNotFoundException("Task not found: " + id);
        }
        task.setId(id);
        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus("TODO");
        }
        if (task.getPriority() == null || task.getPriority().isBlank()) {
            task.setPriority("MEDIUM");
        }
        taskMapper.update(task);
        return taskMapper.findById(id);
    }

    @Transactional
    public void reorder(List<ReorderItem> items) {
        for (ReorderItem item : items) {
            taskMapper.updatePositionAndStatus(item);
        }
    }

    @Transactional
    public void delete(Integer id) {
        if (taskMapper.findById(id) == null) {
            throw new ResourceNotFoundException("Task not found: " + id);
        }
        taskMapper.deleteById(id);
    }
}
