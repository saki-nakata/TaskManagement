package com.taskmanagement.service;

import com.taskmanagement.mapper.TaskMapper;
import com.taskmanagement.model.Task;
import org.springframework.stereotype.Service;

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
}
