package cz.cvut.fel.nss.chat.chat.repositories;

import cz.cvut.fel.nss.chat.chat.entities.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, Integer> {
    Page<ChatRoom> findAllByMembersContainingOrderByLastMessageTimestampDesc(Integer userId, Pageable pageable);
}
