FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

# Copy only pom.xml first (for dependency caching)
COPY pom.xml .

# Download dependencies (faster rebuilds later)
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Expose your app port
EXPOSE 8081

# Run Spring Boot in dev mode
CMD ["mvn", "spring-boot:run"]
