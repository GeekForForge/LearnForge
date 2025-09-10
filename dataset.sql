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
select * from lesson_progress;
