package com.melashvili.commentservice.controller;

import com.melashvili.commentservice.model.AddCommentDTO;
import com.melashvili.commentservice.model.Comment;
import com.melashvili.commentservice.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/comments")
public class CommentController {

    private CommentService commentService;

    @Autowired
    public void setCommentService(CommentService commentService) {
        this.commentService = commentService;
    }

    @RequestMapping(method = RequestMethod.POST, path = "/add")
    public ResponseEntity<Void> addComment(@RequestBody AddCommentDTO addCommentDTO) {
        return new ResponseEntity<>(commentService.addComment(addCommentDTO), HttpStatus.CREATED);
    }

    @RequestMapping(path = "/get/{id}")
    public ResponseEntity<List<Comment>> findAllComments(@PathVariable Long id) {
        return new ResponseEntity<>(commentService.getAllById(id), HttpStatus.OK);
    }
}
