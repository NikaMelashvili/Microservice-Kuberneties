package com.melashvili.commentservice.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddCommentDTO {
    private Long postId;

    private String content;

    private String author;
}
