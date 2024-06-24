package cz.cvut.fel.nss.user_relations.service;

import cz.cvut.fel.nss.user_relations.dao.BlockRepository;
import cz.cvut.fel.nss.user_relations.entity.Block;
import cz.cvut.fel.nss.user_relations.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BlockService {
    private final BlockRepository blockRepository;

    @Autowired
    public BlockService(BlockRepository blockRepository) {
        this.blockRepository = blockRepository;
    }

    public void blockUser(int blockedId) {
        //let's imagine our user is logged in
        //usually it would Principal.getUsername()
        int loggedUser = 1;

        Block block = new Block();
        block.setBlockingId(loggedUser);
        block.setBlockedId(blockedId);

        blockRepository.save(block);
    }

    public void unblockUser(int blockedId) {
        //let's imagine our user is logged in
        //usually it would Principal.getUsername()
        int loggedUser = 1;

        Optional<Block> block = blockRepository.findByBlockingIdAndBlockedId(loggedUser, blockedId);
        if (block.isEmpty()) {
            throw new BadRequestException("You can't unblock a user you didn't block");
        }

        blockRepository.delete(block.get());
    }
}
