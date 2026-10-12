package com.projectconnect.server.initializer;

import com.projectconnect.server.model.*;
import com.projectconnect.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostCommentRepository commentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectApplicationRepository applicationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already present
        }

        System.out.println(">>> Initializing ProjectConnect sample demo data...");

        String encodedPw = passwordEncoder.encode("password123");

        // 1. Create Users
        User tanveer = new User("tanveer", "tanveer@thapar.edu", encodedPw, "Tanveer Singh", Role.ROLE_DEVELOPER);
        tanveer.setHeadline("Full Stack Engineer & Distributed Systems Enthusiast | BE CSE Thapar");
        tanveer.setBio("Passionate about building scalable web applications with Spring Boot, React, and cloud architectures. Currently leading development on ProjectConnect!");
        tanveer.setEducation("Thapar Institute of Engineering & Technology, Patiala (BE 3rd Year)");
        tanveer.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");
        tanveer.setGithubUrl("https://github.com/tanveer");
        tanveer.setLinkedinUrl("https://linkedin.com/in/tanveersingh");
        tanveer.setSkills(new HashSet<>(Arrays.asList("Java", "Spring Boot", "React", "MySQL", "Docker", "REST APIs", "WebSocket", "Microservices")));
        tanveer.setInterests(new HashSet<>(Arrays.asList("System Design", "Cloud Computing", "Open Source", "Hackathons")));

        User simerose = new User("simerose", "simerose@thapar.edu", encodedPw, "Simerose Kaur", Role.ROLE_STUDENT);
        simerose.setHeadline("Frontend Developer & UI/UX Specialist | BE CSE Thapar Batch 3C18");
        simerose.setBio("Crafting seamless user experiences with modern React, Tailwind CSS, and Figma. Love turning complex problems into intuitive designs.");
        simerose.setEducation("Thapar Institute of Engineering & Technology, Patiala (BE 3rd Year)");
        simerose.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80");
        simerose.setGithubUrl("https://github.com/simerose");
        simerose.setLinkedinUrl("https://linkedin.com/in/simerosekaur");
        simerose.setSkills(new HashSet<>(Arrays.asList("React", "JavaScript", "TypeScript", "Tailwind CSS", "UI/UX", "HTML5", "CSS3", "Figma")));
        simerose.setInterests(new HashSet<>(Arrays.asList("Web Design", "Design Systems", "Accessibility", "Frontend Architecture")));

        User harleen = new User("harleen", "harleen@thapar.edu", encodedPw, "Harleen Singh", Role.ROLE_STUDENT);
        harleen.setHeadline("Backend & Database Architect | BE CSE Thapar Batch 3C18");
        harleen.setBio("Focused on database performance, SQL optimization, JPA/Hibernate mapping, and secure RESTful microservice communication.");
        harleen.setEducation("Thapar Institute of Engineering & Technology, Patiala (BE 3rd Year)");
        harleen.setAvatarUrl("https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80");
        harleen.setGithubUrl("https://github.com/harleen");
        harleen.setLinkedinUrl("https://linkedin.com/in/harleensingh");
        harleen.setSkills(new HashSet<>(Arrays.asList("Java", "Spring Data JPA", "PostgreSQL", "Hibernate", "SQL", "Spring Security", "JWT")));
        harleen.setInterests(new HashSet<>(Arrays.asList("Database Design", "Performance Tuning", "API Security", "Data Modeling")));

        User sarah = new User("sarah_ai", "sarah@stanford.edu", encodedPw, "Sarah Miller", Role.ROLE_DEVELOPER);
        sarah.setHeadline("AI Researcher & Machine Learning Engineer");
        sarah.setBio("Exploring generative AI, LLM fine-tuning, and RAG pipelines using Python, PyTorch, and LangChain.");
        sarah.setEducation("Stanford University (MS Computer Science)");
        sarah.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
        sarah.setGithubUrl("https://github.com/sarahmiller");
        sarah.setLinkedinUrl("https://linkedin.com/in/sarahmiller");
        sarah.setSkills(new HashSet<>(Arrays.asList("Python", "PyTorch", "LangChain", "FastAPI", "TensorFlow", "NLP", "Machine Learning")));
        sarah.setInterests(new HashSet<>(Arrays.asList("Generative AI", "Deep Learning", "LLMs", "Research")));

        User alex = new User("alex_dev", "alex@techlead.io", encodedPw, "Alex Chen", Role.ROLE_DEVELOPER);
        alex.setHeadline("Senior Full-Stack & DevOps Engineer");
        alex.setBio("Kubernetes fanatic, Next.js explorer, and open-source enthusiast. Happy to mentor student projects!");
        alex.setEducation("UC Berkeley (B.S. EECS)");
        alex.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
        alex.setGithubUrl("https://github.com/alexchen");
        alex.setLinkedinUrl("https://linkedin.com/in/alexchen");
        alex.setSkills(new HashSet<>(Arrays.asList("TypeScript", "Next.js", "Node.js", "Kubernetes", "AWS", "Docker", "GraphQL")));
        alex.setInterests(new HashSet<>(Arrays.asList("Cloud Architecture", "DevOps", "Micro-frontends", "Mentorship")));

        tanveer = userRepository.save(tanveer);
        simerose = userRepository.save(simerose);
        harleen = userRepository.save(harleen);
        sarah = userRepository.save(sarah);
        alex = userRepository.save(alex);

        // Follow relationships
        tanveer.getFollowing().add(simerose);
        tanveer.getFollowing().add(harleen);
        tanveer.getFollowing().add(sarah);
        simerose.getFollowing().add(tanveer);
        simerose.getFollowing().add(harleen);
        harleen.getFollowing().add(tanveer);
        alex.getFollowing().add(tanveer);

        userRepository.save(tanveer);
        userRepository.save(simerose);
        userRepository.save(harleen);
        userRepository.save(alex);

        // 2. Create Projects
        Project p1 = new Project();
        p1.setTitle("ProjectConnect - Social Collaboration Platform");
        p1.setTagLine("Empowering students and developers to connect, build teams, and collaborate.");
        p1.setDescription("A full-stack enterprise web application built for university collaboration. Provides technical user profiles, rich social feeds with syntax highlighting, project team management, real-time messaging with WebSockets, and skill-based matching.");
        p1.setOwner(tanveer);
        p1.setStatus(ProjectStatus.OPEN);
        p1.setMaxMembers(5);
        p1.setRepositoryUrl("https://github.com/tanveer/ProjectConnect");
        p1.setLiveDemoUrl("http://localhost:5173");
        p1.setRequiredSkills(new HashSet<>(Arrays.asList("Java", "Spring Boot", "React", "WebSocket", "MySQL")));
        p1.setTechStack(new HashSet<>(Arrays.asList("Spring Boot 3", "React.js", "Vite", "Tailwind CSS", "SockJS", "Hibernate")));
        p1.getMembers().add(simerose);
        p1.getMembers().add(harleen);
        p1 = projectRepository.save(p1);

        Project p2 = new Project();
        p2.setTitle("AI-Powered Code Reviewer & Security Scanner");
        p2.setTagLine("Automated pull request analysis and vulnerability detection using LLMs.");
        p2.setDescription("An intelligent bot that connects to GitHub Webhooks, parses ASTs in Python/Java/TypeScript, and generates detailed contextual code review suggestions and security vulnerability alerts.");
        p2.setOwner(sarah);
        p2.setStatus(ProjectStatus.OPEN);
        p2.setMaxMembers(4);
        p2.setRepositoryUrl("https://github.com/sarahmiller/ai-code-reviewer");
        p2.setRequiredSkills(new HashSet<>(Arrays.asList("Python", "FastAPI", "LangChain", "Docker", "Machine Learning")));
        p2.setTechStack(new HashSet<>(Arrays.asList("Python 3.12", "FastAPI", "LangChain", "OpenAI / Gemini API", "PostgreSQL")));
        p2 = projectRepository.save(p2);

        Project p3 = new Project();
        p3.setTitle("Campus Sync - Real-Time Student Collaboration Hub");
        p3.setTagLine("Student schedule coordinator, hackathon team finder, and study group builder.");
        p3.setDescription("A campus portal facilitating student team building for capstone projects, hackathons, and peer study groups. Features interactive calendars, group chats, and skill matching.");
        p3.setOwner(simerose);
        p3.setStatus(ProjectStatus.IN_PROGRESS);
        p3.setMaxMembers(4);
        p3.setRepositoryUrl("https://github.com/simerose/campus-sync");
        p3.setRequiredSkills(new HashSet<>(Arrays.asList("React", "TypeScript", "Tailwind CSS", "REST APIs")));
        p3.setTechStack(new HashSet<>(Arrays.asList("React 18", "TypeScript", "Tailwind CSS", "Node.js")));
        p3.getMembers().add(tanveer);
        p3 = projectRepository.save(p3);

        // 3. Create Applications
        ProjectApplication app1 = new ProjectApplication(p2, tanveer, "Hi Sarah! I have strong backend experience in Java/Python and would love to help build the webhook ingestion engine and AST parsers.");
        app1.setStatus(ApplicationStatus.PENDING);
        applicationRepository.save(app1);

        ProjectApplication app2 = new ProjectApplication(p1, alex, "Looks like an awesome project! Would love to contribute DevOps automation and Docker CI/CD pipelines.");
        app2.setStatus(ApplicationStatus.ACCEPTED);
        p1.getMembers().add(alex);
        projectRepository.save(p1);
        applicationRepository.save(app2);

        // 4. Create Posts
        Post post1 = new Post();
        post1.setAuthor(tanveer);
        post1.setContent("🚀 Excited to announce our project **ProjectConnect**! We've designed a dedicated social collaboration platform for students and developers.\n\nHere is how we configured stateless JWT authentication with Spring Security 6:");
        post1.setCodeSnippet("@Bean\npublic SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n    return http\n        .cors(cors -> cors.configurationSource(corsConfigurationSource()))\n        .csrf(AbstractHttpConfigurer::disable)\n        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n        .authorizeHttpRequests(auth -> auth\n            .requestMatchers(\"/api/auth/**\", \"/ws/**\").permitAll()\n            .anyRequest().authenticated()\n        )\n        .addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class)\n        .build();\n}");
        post1.setLanguage("java");
        post1.setTags(new HashSet<>(Arrays.asList("SpringBoot", "Java", "Security", "WebDev", "FullStack")));
        post1.getLikes().add(simerose);
        post1.getLikes().add(harleen);
        post1.getLikes().add(sarah);
        post1 = postRepository.save(post1);

        Post post2 = new Post();
        post2.setAuthor(simerose);
        post2.setContent("🎨 Just wrapped up the modern UI design system for ProjectConnect! Using Tailwind CSS with glassmorphism and clean typography makes the developer experience so snappy.\n\nHere is a reusable React custom hook for handling real-time WebSocket subscriptions with auto-reconnect:");
        post2.setCodeSnippet("import { useEffect, useRef } from 'react';\nimport SockJS from 'sockjs-client';\nimport { Client } from '@stomp/stompjs';\n\nexport function useWebSocket(url, topic, onMessage) {\n  const stompClient = useRef(null);\n  useEffect(() => {\n    const client = new Client({\n      webSocketFactory: () => new SockJS(url),\n      reconnectDelay: 5000,\n      onConnect: () => {\n        client.subscribe(topic, msg => onMessage(JSON.parse(msg.body)));\n      }\n    });\n    client.activate();\n    stompClient.current = client;\n    return () => client.deactivate();\n  }, [url, topic]);\n}");
        post2.setLanguage("typescript");
        post2.setTags(new HashSet<>(Arrays.asList("React", "Frontend", "UIUX", "TailwindCSS", "WebSocket")));
        post2.getLikes().add(tanveer);
        post2.getLikes().add(alex);
        post2 = postRepository.save(post2);

        Post post3 = new Post();
        post3.setAuthor(sarah);
        post3.setContent("💡 Pro-tip when building RAG (Retrieval Augmented Generation) pipelines: always chunk your documents by semantic headings rather than fixed token lengths. It increases retrieval accuracy by over 35% on technical code documentation!");
        post3.setTags(new HashSet<>(Arrays.asList("AI", "MachineLearning", "Python", "RAG", "LLM")));
        post3.getLikes().add(tanveer);
        post3.getLikes().add(alex);
        post3 = postRepository.save(post3);

        // 5. Create Comments
        PostComment c1 = new PostComment(post1, simerose, "Clean architecture! The stateless session configuration makes horizontal scaling super straightforward.");
        PostComment c2 = new PostComment(post1, harleen, "Looking forward to integrating the JPA repository layer with this security config!");
        commentRepository.save(c1);
        commentRepository.save(c2);

        PostComment c3 = new PostComment(post2, tanveer, "Love the custom hook approach! Makes subscribing to project channels so easy.");
        commentRepository.save(c3);

        // 6. Create Messages
        Message m1 = new Message(simerose, tanveer, null, "Hey Tanveer! I just pushed the responsive navigation bar component to the repo.");
        m1.setRead(true);
        Message m2 = new Message(tanveer, simerose, null, "Awesome! I reviewed the PR and it looks great. Testing it with the backend auth token now.");
        m2.setRead(true);
        Message m3 = new Message(simerose, tanveer, null, "Great, let me know if any payload adjustments are needed!");
        m3.setRead(false);

        Message m4 = new Message(harleen, tanveer, null, "Hey! I verified the H2 and MySQL relational schema mappings. All foreign key constraints are working properly.");
        m4.setRead(true);

        Message pMsg1 = new Message(tanveer, null, p1, "Welcome team to ProjectConnect channel! Let's build something amazing.");
        Message pMsg2 = new Message(simerose, null, p1, "Ready to go! All frontend views are ready for integration.");
        Message pMsg3 = new Message(harleen, null, p1, "Backend REST controllers and JPA repositories are fully configured!");

        messageRepository.saveAll(Arrays.asList(m1, m2, m3, m4, pMsg1, pMsg2, pMsg3));

        // 7. Create Notifications
        Notification n1 = new Notification(
                tanveer,
                simerose,
                NotificationType.COMMENT,
                "Simerose Kaur commented on your post: \"Clean architecture! The stateless session configuration...\"",
                "/posts/" + post1.getId()
        );
        n1.setRead(false);

        Notification n2 = new Notification(
                tanveer,
                alex,
                NotificationType.APPLICATION_RECEIVED,
                "Alex Chen applied to join your project \"ProjectConnect - Social Collaboration Platform\"",
                "/projects/" + p1.getId()
        );
        n2.setRead(false);

        Notification n3 = new Notification(
                tanveer,
                sarah,
                NotificationType.FOLLOW,
                "Sarah Miller started following you.",
                "/profile/sarah_ai"
        );
        n3.setRead(true);

        notificationRepository.saveAll(Arrays.asList(n1, n2, n3));

        System.out.println(">>> ProjectConnect sample demo data initialized successfully!");
    }
}
