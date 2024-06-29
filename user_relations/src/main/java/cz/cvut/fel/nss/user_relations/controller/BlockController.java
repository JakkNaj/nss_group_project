package cz.cvut.fel.nss.user_relations.controller;

import cz.cvut.fel.nss.user_relations.service.BlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/block")
public class BlockController {

    @Autowired
    BlockService blockService;

    @PostMapping("/{userId}")
    public ResponseEntity<Void> blockUser(@PathVariable int userId){
        blockService.blockUser(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unblockUser(@PathVariable int userId){
        blockService.unblockUser(userId);
        return ResponseEntity.noContent().build();
    }
}
