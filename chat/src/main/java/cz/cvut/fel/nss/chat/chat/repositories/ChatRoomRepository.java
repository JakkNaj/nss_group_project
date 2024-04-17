package cz.cvut.fel.nss.chat.chat.repositories;

import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    List<ChatRoom> findByMembersContaining(String username);
}
