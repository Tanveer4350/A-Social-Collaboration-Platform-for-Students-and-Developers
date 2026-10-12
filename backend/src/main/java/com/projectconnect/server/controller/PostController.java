package com.projectconnect.server.controller;

import com.projectconnect.server.dto.ApiResponse;
import com.projectconnect.server.dto.CommentRequest;
import com.projectconnect.server.dto.CommentResponse;
import com.projectconnect.server.dto.PostRequest;
import com.projectconnect.server.dto.PostResponse;
import com.projectconnect.server.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.createPost(request));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> getFollowingFeed() {
        return ResponseEntity.ok(postService.getFollowingFeed());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<PostResponse>> getTrendingPosts() {
        return ResponseEntity.ok(postService.getTrendingPosts());
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<PostResponse>> getPostsByTag(@PathVariable String tag) {
        return ResponseEntity.ok(postService.getPostsByTag(tag));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<PostResponse>> getUserPosts(@PathVariable String username) {
        return ResponseEntity.ok(postService.getUserPosts(username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        boolean liked = postService.toggleLikePost(id);
        return ResponseEntity.ok(Map.of(
                "liked", liked,
                "message", liked ? "Post liked" : "Post unliked"
        ));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id, @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(postService.addComment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(new ApiResponse(true, "Post deleted successfully"));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        postService.deleteComment(commentId);
        return ResponseEntity.ok(new ApiResponse(true, "Comment deleted successfully"));
    }
}
