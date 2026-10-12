package com.projectconnect.server.service;

import com.projectconnect.server.dto.CommentRequest;
import com.projectconnect.server.dto.CommentResponse;
import com.projectconnect.server.dto.PostRequest;
import com.projectconnect.server.dto.PostResponse;
import com.projectconnect.server.model.NotificationType;
import com.projectconnect.server.model.Post;
import com.projectconnect.server.model.PostComment;
import com.projectconnect.server.model.User;
import com.projectconnect.server.repository.PostCommentRepository;
import com.projectconnect.server.repository.PostRepository;
import com.projectconnect.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostCommentRepository postCommentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public PostResponse createPost(PostRequest request) {
        User currentUser = userService.getCurrentUser();
        Post post = new Post();
        post.setAuthor(currentUser);
        post.setContent(request.getContent());
        post.setCodeSnippet(request.getCodeSnippet());
        post.setLanguage(request.getLanguage());
        post.setMediaUrl(request.getMediaUrl());
        post.setTags(request.getTags());

        Post saved = postRepository.save(post);
        return PostResponse.fromPost(saved, currentUser);
    }

    public List<PostResponse> getAllPosts() {
        User currentUser = userService.getCurrentUserOrNull();
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(p -> PostResponse.fromPost(p, currentUser))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getFollowingFeed() {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getFollowing() == null || currentUser.getFollowing().isEmpty()) {
            return getAllPosts();
        }

        List<User> authors = new ArrayList<>(currentUser.getFollowing());
        authors.add(currentUser);

        return postRepository.findFeedByAuthors(authors).stream()
                .map(p -> PostResponse.fromPost(p, currentUser))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getTrendingPosts() {
        User currentUser = userService.getCurrentUserOrNull();
        return postRepository.findAll().stream()
                .sorted((p1, p2) -> {
                    int score2 = (p2.getLikes() != null ? p2.getLikes().size() * 2 : 0) + (p2.getComments() != null ? p2.getComments().size() * 3 : 0);
                    int score1 = (p1.getLikes() != null ? p1.getLikes().size() * 2 : 0) + (p1.getComments() != null ? p1.getComments().size() * 3 : 0);
                    return Integer.compare(score2, score1);
                })
                .map(p -> PostResponse.fromPost(p, currentUser))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getPostsByTag(String tag) {
        User currentUser = userService.getCurrentUserOrNull();
        return postRepository.findByTag(tag).stream()
                .map(p -> PostResponse.fromPost(p, currentUser))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getUserPosts(String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        User currentUser = userService.getCurrentUserOrNull();
        return postRepository.findByAuthorOrderByCreatedAtDesc(author).stream()
                .map(p -> PostResponse.fromPost(p, currentUser))
                .collect(Collectors.toList());
    }

    public PostResponse getPostById(Long id) {
        User currentUser = userService.getCurrentUserOrNull();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));
        return PostResponse.fromPost(post, currentUser);
    }

    @Transactional
    public boolean toggleLikePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean liked;
        if (post.getLikes().contains(currentUser)) {
            post.getLikes().remove(currentUser);
            liked = false;
        } else {
            post.getLikes().add(currentUser);
            liked = true;

            // Trigger notification
            notificationService.createNotification(
                    post.getAuthor(),
                    currentUser,
                    NotificationType.LIKE,
                    currentUser.getFullName() + " liked your post.",
                    "/posts/" + post.getId()
            );
        }

        postRepository.save(post);
        return liked;
    }

    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        PostComment comment = new PostComment(post, currentUser, request.getContent());
        PostComment saved = postCommentRepository.save(comment);

        // Trigger notification
        notificationService.createNotification(
                post.getAuthor(),
                currentUser,
                NotificationType.COMMENT,
                currentUser.getFullName() + " commented on your post: \"" +
                        (request.getContent().length() > 40 ? request.getContent().substring(0, 37) + "..." : request.getContent()) + "\"",
                "/posts/" + post.getId()
        );

        return CommentResponse.fromComment(saved, currentUser);
    }

    @Transactional
    public void deletePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: You can only delete your own posts");
        }

        postRepository.delete(post);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        User currentUser = userService.getCurrentUser();
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getId().equals(currentUser.getId()) &&
            !comment.getPost().getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }

        postCommentRepository.delete(comment);
    }
}
