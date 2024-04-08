# Chat Application

Before running the application, ensure you have performed a clean install of the parent-pom located in the root directory of the project.

## Steps to Run the Application:

1. **Setup Run Configuration:**
    - Create a run configuration with the following parameters:
        - Main class: `src/main/java/cz/cvut/fel/nss/chat/ChatApplication.java`

2. **Configure Application Properties:**
    - Navigate to `src/main/resources/application.properties`.
    - Fill out the password. If you don't have it, please contact Tobias for assistance.
    - Alternatively, you can set up and run your own instance of MongoDB.

3. **Start Kafka and Zookeeper:**
    - Download Kafka and Zookeeper from the <a href="https://kafka.apache.org/downloads">official Apache Kafka website.</a>
    - replace `/config/server.properties` with `src/main/resources/kafka/server.properties`
    - replace `/config/zookeeper.properties` with `src/main/resources/kafka/zookeeper.properties`
    - Start Zookeeper: `bin/zookeeper-server-start.sh config/zookeeper.properties`
    - Start Kafka: `bin/kafka-server-start.sh config/server.properties`

3. **Run the Application:**
    - Execute the application.

4. **Launch the Chat Interface:**
    - Open `src/main/resources/static/index.html` in a web browser.

5. **Enjoy the Chat:**
    - Start using the chat functionality and enjoy seamless communication!

---

By following these steps, you'll be able to set up and run the chat application smoothly. If you encounter any issues or require further assistance, don't hesitate to reach out for support. Happy chatting!
