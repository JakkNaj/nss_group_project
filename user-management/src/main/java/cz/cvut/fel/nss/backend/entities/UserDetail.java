package cz.cvut.fel.nss.backend.entities;

import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Document(collection = "userDetail")
@Getter
@NoArgsConstructor
public class UserDetail {
    @Id
    private Integer id; // same as user username
    private Map<UserDetailKey, String> details;

    public void addDetail(int id, UserDetailKey key, String value) {
        if (details == null) {
            details = new HashMap<>();
            this.id = id;
        }
        details.put(key, value);
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("UserDetail{");
        sb.append("id = ").append(id).append('\n');
        for (Map.Entry<UserDetailKey, String> entry : details.entrySet()) {
            sb.append(entry.getKey()).append(" = ").append(entry.getValue()).append("\n");
        }
        return sb.toString();
    }
}
