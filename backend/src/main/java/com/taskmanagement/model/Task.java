package com.taskmanagement.model;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class Task {
    private Integer id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private int position;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
