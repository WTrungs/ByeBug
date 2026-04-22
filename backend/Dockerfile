# Stage 1: Build the application
FROM maven:3.9.15-eclipse-temurin-25-noble AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:25.0.2_10-jre-noble
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
EXPOSE 3001
ENTRYPOINT ["java", "-jar", "app.jar"]