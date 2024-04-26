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
    private Integer chatLogId;
    private String name;
    private ChatRoomType type;
    private List<Integer> members;
    private Long lastMessageTimestamp;

    public void addMember(Integer userId) {
        if (members == null) {
            members = new ArrayList<>();
        }
        members.add(userId);
    }

    public void removeMember(Integer userId) {
        if (members != null) {
            members.remove(userId);
        }
    }

    public enum ChatRoomType {
        ONE_ON_ONE, GROUP
    }
}
