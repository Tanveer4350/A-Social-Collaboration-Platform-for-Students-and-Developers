package com.projectconnect.server.controller;

import com.projectconnect.server.dto.ConversationSummaryDto;
import com.projectconnect.server.dto.MessageRequest;
import com.projectconnect.server.dto.MessageResponse;
import com.projectconnect.server.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@Valid @RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(request));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationSummaryDto>> getConversationsList() {
        return ResponseEntity.ok(messageService.getConversationsList());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MessageResponse>> getDirectConversation(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getDirectConversation(userId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MessageResponse>> getProjectConversation(@PathVariable Long projectId) {
        return ResponseEntity.ok(messageService.getProjectConversation(projectId));
    }

    // STOMP WebSocket Message Mapping
    @MessageMapping("/chat.send")
    public void processWebSocketMessage(@Payload MessageRequest request) {
        messageService.sendMessage(request);
    }
}
