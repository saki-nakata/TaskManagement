package com.taskmanagement.mapper;

import com.taskmanagement.model.Task;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TaskMapper {
    List<Task> search(@Param("keyword") String keyword,
                      @Param("status")  String status);

    void insert(Task task);

    Task findById(@Param("id") Integer id);

    void update(Task task);
}
