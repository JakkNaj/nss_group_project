package cz.cvut.fel.nss.chat.chat.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document(collection = "chatRoom")
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    @Id
    private String id;
    private String name;
    private ChatRoomType type;
    private List<String> members;

    public void addMember(String username) {
        if (members == null) {
            members = new ArrayList<>();
        }
        members.add(username);
    }

    public enum ChatRoomType {
        ONE_ON_ONE, GROUP
    }
}
