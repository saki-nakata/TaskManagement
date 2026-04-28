package com.taskmanagement.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class Task {
    private Integer id;

    @NotBlank(message = "タイトルは必須です")
    private String title;

    private String description;
    private String status;
    private String priority;

    @NotNull(message = "期日は必須です")
    private LocalDate dueDate;

    private int position;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
