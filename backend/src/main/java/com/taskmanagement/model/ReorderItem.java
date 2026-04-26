package com.taskmanagement.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReorderItem {
    private Integer id;
    private String  status;
    private Integer position;
}
