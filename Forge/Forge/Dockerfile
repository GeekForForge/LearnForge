# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /build

# Copy pom.xml and download dependencies
COPY pom.xml .
#RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /build/target/*.jar app.jar

# Expose port (Render will set PORT env variable)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
