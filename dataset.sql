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
CREATE TABLE question (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  topic VARCHAR(255),
  subtopic VARCHAR(255),
  difficulty VARCHAR(255),
  question TEXT,
  answer VARCHAR(255),
  explanation TEXT
);
CREATE TABLE question_options (
  question_id BIGINT NOT NULL,
  options VARCHAR(255),
  FOREIGN KEY (question_id) REFERENCES question(id)
);

CREATE TABLE arena_result (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255),
  topic VARCHAR(255),
  difficulty VARCHAR(255),
  score INT,
  total_questions INT,
  accuracy DOUBLE,
  time_taken INT,
  played_at DATETIME
);
CREATE TABLE user_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    xp_points INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- question_completion table (MySQL / Workbench version)
CREATE TABLE question_completion (
    user_email       VARCHAR(100) NOT NULL,
    company_slug     VARCHAR(80)  NOT NULL,       -- e.g. 'accenture'
    question_uid     VARCHAR(160) NOT NULL,       -- stable unique ID per question
    completed        BOOLEAN      NOT NULL DEFAULT TRUE,
    completed_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    question_title   TEXT,
    question_link    TEXT,
    PRIMARY KEY (user_email, company_slug, question_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Helpful secondary index for lookups
CREATE INDEX idx_completion_user_company
    ON question_completion (user_email, company_slug);






-- Add index for faster queries
CREATE INDEX idx_lesson_resources ON lesson_resources(lesson_id, resource_type);

UPDATE lessons
SET video_url = 'https://youtu.be/qcQKq4XABNk'
WHERE lesson_id = 1;
ALTER TABLE users 
ADD COLUMN avatar_url VARCHAR(255),
ADD COLUMN provider_id VARCHAR(100);
select * from users;
