# 📚 LearnForge – Free Learning Platform

![GitHub Stars](https://img.shields.io/github/stars/GeekForForge/LearnForge?style=social)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Contributors](https://img.shields.io/github/contributors/GeekForForge/LearnForge)

> **An open-source learning platform** that provides structured roadmaps for programming education. LearnForge curates YouTube videos, blogs, and resources into a clean, distraction-free experience.
>
> 🚀 **Our mission**: Make high-quality education accessible, free, and well-organized for everyone.

## ✨ Features

- 🔑 **Google & GitHub OAuth** - Seamless authentication (coming soon)
- 🎥 **Ad-free YouTube Embedding** - Study without distractions
- 📑 **Structured Courses** - Spring Boot, React, DSA, Databases, and more
- 📊 **Progress Tracking** - Monitor your learning journey
- 🗄️ **Spring Boot Backend** - Robust REST APIs with JPA & MySQL
- ⚡ **React + Tailwind Frontend** - Modern, responsive UI
- 💾 **Database Management** - Efficient course and user data storage
- 🌙 **Responsive Design** - Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) - Modern UI library
- **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast development server
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Language**: JavaScript/JSX

### Backend
- **Framework**: [Spring Boot](https://spring.io/projects/spring-boot) - Java-based application framework
- **Security**: [Spring Security](https://spring.io/projects/spring-security) - Authentication & authorization
- **Data Access**: [Spring Data JPA](https://spring.io/projects/spring-data-jpa) - ORM abstraction
- **Database**: [MySQL](https://www.mysql.com/) - Relational database
- **Language**: Java

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Build Tool**: Maven
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites
- Java 11 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Git

### Backend Setup (Spring Boot)

```bash
# Clone the repository
git clone https://github.com/GeekForForge/LearnForge.git
cd LearnForge/Forge

# Build and run the Spring Boot application
./mvnw clean install
./mvnw spring-boot:run

# Backend will run on http://localhost:8080
```

**Key Configuration Files**:
- `application.properties` - Application configuration
- `pom.xml` - Maven dependencies
- Database setup scripts included

### Frontend Setup (React)

```bash
# Navigate to frontend directory
cd LearnForge/learning-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will run on http://localhost:5173
```

### Database Setup

```bash
# MySQL connection
mysql -u root -p

# Create database (if needed)
CREATE DATABASE learnforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import dataset.sql
mysql -u root -p learnforge < dataset.sql
```

## 📁 Project Structure

```
LearnForge/
├── Forge/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/geekforforge/
│   │   │   │   ├── model/          # Entity classes (Course, Lesson, User, etc.)
│   │   │   │   ├── repository/     # JPA Repositories for database operations
│   │   │   │   ├── service/        # Business logic layer
│   │   │   │   ├── controller/     # REST API endpoints
│   │   │   │   ├── config/         # Spring configurations
│   │   │   │   └── exception/      # Custom exceptions
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/
│   │   │           └── migration/  # Database migration scripts
│   │   └── test/
│   └── pom.xml
├── learning-platform/              # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── ...
│   │   ├── pages/                  # Page components (routes)
│   │   │   ├── Home.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Lessons.jsx
│   │   │   ├── Auth.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API client services
│   │   ├── context/                # React Context for state management
│   │   ├── styles/                 # Global styles
│   │   ├── App.jsx                 # Main App component
│   │   └── main.jsx                # Entry point
│   ├── public/                     # Static assets
│   ├── package.json
│   └── vite.config.js
├── .idea/                          # IDE configuration
├── LICENCE.md                      # License information
├── README.md                       # This file
├── dataset.sql                     # Initial database schema
└── .gitignore
```

## 🔌 API Endpoints

### Courses
```
GET    /api/courses               # Get all courses
GET    /api/courses/:id           # Get course by ID
POST   /api/courses               # Create new course (admin)
PUT    /api/courses/:id           # Update course (admin)
DELETE /api/courses/:id           # Delete course (admin)
```

### Lessons
```
GET    /api/lessons               # Get all lessons
GET    /api/courses/:courseId/lessons  # Get lessons for a course
POST   /api/lessons               # Create lesson (admin)
PUT    /api/lessons/:id           # Update lesson (admin)
DELETE /api/lessons/:id           # Delete lesson (admin)
```

### Users & Progress
```
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
GET    /api/users/:id/progress    # Get user progress
POST   /api/progress              # Mark lesson as complete
GET    /api/users/:id/certificates  # Get user certificates
```

## 🎓 Learning Paths

LearnForge currently features structured roadmaps for:

1. **Spring Boot Development**
   - Core concepts
   - RESTful APIs
   - Database integration
   - Security best practices

2. **React.js Frontend**
   - React fundamentals
   - Component lifecycle
   - State management
   - Advanced patterns

3. **Data Structures & Algorithms**
   - Arrays and Strings
   - Linked Lists
   - Trees and Graphs
   - Dynamic Programming

4. **Database Management**
   - SQL fundamentals
   - Database design
   - Performance optimization
   - Advanced queries

## 🛠️ Development Guide

### Running Tests

```bash
# Backend tests
cd Forge
./mvnw test

# Frontend tests
cd learning-platform
npm test
```

### Building for Production

```bash
# Backend build
cd Forge
./mvnw clean package

# Frontend build
cd learning-platform
npm run build
```

### Code Quality

- Follow Java conventions for backend code
- Use ESLint + Prettier for frontend code
- Write meaningful commit messages
- Add tests for new features

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m 'Add your feature'`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation
- Keep PRs focused and manageable
- Reference issues in PR descriptions

## 📝 License

This project is licensed under the MIT License. See [LICENCE.md](./LICENCE.md) for details.

## 📊 Project Statistics

- **Repository**: Open-source on GitHub
- **Active Contributors**: 4+
- **Latest Commit**: December 2, 2025
- **Total Commits**: 106
- **Languages**: JavaScript (78.9%), Java (17.2%), CSS (3.5%), Other (0.4%)

## 🐛 Bug Reports & Feature Requests

Found a bug? Have a feature idea? 

- **Report Issues**: [Open an issue](https://github.com/GeekForForge/LearnForge/issues)
- **Security Concerns**: Please email security@geekforforge.com
- **General Questions**: Check existing issues or discussions first

## 🗺️ Roadmap

### Current Focus
- [ ] OAuth integration (Google & GitHub)
- [ ] Video streaming optimization
- [ ] Mobile app (React Native)
- [ ] AI-powered course recommendations

### Future Plans
- [ ] Live mentoring/tutoring sessions
- [ ] Community forums
- [ ] Certification program
- [ ] Integration with coding platforms (LeetCode, HackerRank)
- [ ] Gamification & achievement system
- [ ] Multi-language support

## 📚 Resources & Documentation

- **API Documentation**: [Swagger UI](http://localhost:8080/swagger-ui.html) (when running)
- **React Documentation**: [React Docs](https://react.dev)
- **Spring Boot Docs**: [Spring.io](https://spring.io)
- **Tailwind CSS**: [Tailwind Docs](https://tailwindcss.com/docs)

## 👥 Meet the Team

**Lead Contributors**:
- [@samarth-sachin](https://github.com/samarth-sachin)
- [@shreee2005](https://github.com/shreee2005)
- [@sam1302-sks](https://github.com/sam1302-sks)
- [@Sakshant24](https://github.com/Sakshant24)

## 💬 Community & Support

- **GitHub Discussions**: [Join our community](https://github.com/GeekForForge/LearnForge/discussions)
- **Twitter**: [@GeekForForge](https://twitter.com/GeekForForge)
- **Email**: hello@geekforforge.com

## 🙏 Acknowledgments

Thank you to all our contributors and the open-source community for making education accessible!

---

**Made with ❤️ by GeekForForge**

⭐ If you find LearnForge helpful, please consider starring the repository!
