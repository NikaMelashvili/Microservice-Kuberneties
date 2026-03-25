package com.melashvili.commentservice.service;

import com.melashvili.commentservice.model.AddCommentDTO;
import com.melashvili.commentservice.model.Comment;
import com.melashvili.commentservice.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CommentService {

    private CommentRepository commentRepository;

    @Autowired
    public void setCommentRepository(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comment> getAllById(Long id) {
        List<Comment> allComments;
        allComments = commentRepository.findAllByUserId(id);
        return allComments;
    }

    public Void addComment(AddCommentDTO addCommentDTO) {
        Comment comment = new Comment();

        comment.setContent(addCommentDTO.getContent());
        comment.setPostId(addCommentDTO.getPostId());
        comment.setAuthor(addCommentDTO.getAuthor());
        comment.setDate(new Date());

        commentRepository.save(comment);

        return null;
    }
}
