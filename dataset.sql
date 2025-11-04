-- USERS TABLE
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY,       -- UUID
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    provider VARCHAR(50)
);

-- COURSES TABLE
CREATE TABLE courses (
    course_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_title VARCHAR(200) NOT NULL,
    course_description TEXT,
    category VARCHAR(100)
);

-- LESSONS TABLE
CREATE TABLE lessons (
    lesson_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_name VARCHAR(200) NOT NULL,
    video_url VARCHAR(500),
    duration VARCHAR(50),
    course_id BIGINT,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- PROGRESS TABLE
CREATE TABLE progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    completed_lessons INT DEFAULT 0,
    user_id CHAR(36),
    course_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);
CREATE TABLE lesson_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    lesson_id BIGINT NOT NULL,
    watch_time_seconds INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP,
    play_count INT DEFAULT 0,
    pause_count INT DEFAULT 0,
    last_position VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id)
);

-- Create a new table for lesson resources
CREATE TABLE lesson_resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_id BIGINT NOT NULL,
    resource_type ENUM('LEETCODE', 'GITHUB', 'GFG', 'OTHER') NOT NULL,
    resource_url VARCHAR(500) NOT NULL,
    resource_title VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resource_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);
CREATE TABLE video_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id BIGINT NOT NULL,
    watch_time DOUBLE NOT NULL,
    duration DOUBLE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id),
    CONSTRAINT fk_video_progress_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_video_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);
CREATE TABLE user_streaks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_active_date DATE,
    total_lessons_completed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);




-- Add index for faster queries
CREATE INDEX idx_lesson_resources ON lesson_resources(lesson_id, resource_type);

UPDATE lessons
SET video_url = 'https://youtu.be/qcQKq4XABNk'
WHERE lesson_id = 1;
ALTER TABLE users 
ADD COLUMN avatar_url VARCHAR(255),
ADD COLUMN provider_id VARCHAR(100);
select * from users;
