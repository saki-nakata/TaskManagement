package com.example.taskmanagement.task;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TaskMapper {
    List<Task> findAll();
}
