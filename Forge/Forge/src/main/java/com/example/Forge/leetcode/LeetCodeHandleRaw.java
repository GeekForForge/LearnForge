package com.example.Forge.leetcode;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "leetcode_handle_raw")
public class LeetCodeHandleRaw {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = false)
    private String handle;

    @Column(columnDefinition = "json")
    private String rawJson;

    @Column(nullable = false)
    private Instant fetchedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getHandle() { return handle; }
    public void setHandle(String handle) { this.handle = handle; }
    public String getRawJson() { return rawJson; }
    public void setRawJson(String rawJson) { this.rawJson = rawJson; }
    public Instant getFetchedAt() { return fetchedAt; }
    public void setFetchedAt(Instant fetchedAt) { this.fetchedAt = fetchedAt; }
}
