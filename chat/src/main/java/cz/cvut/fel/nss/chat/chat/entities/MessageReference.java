package cz.cvut.fel.nss.chat.chat.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.json.JSONException;
import org.json.JSONObject;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class MessageReference {
    private String referencedMessageId;
    private String referencedMessageContent;

    public MessageReference(JSONObject jsonObject) {
        try {
            this.referencedMessageId = jsonObject.getString("referencedMessageId");
            this.referencedMessageContent = jsonObject.getString("referencedMessageContent");
        } catch (JSONException e) {
            throw new RuntimeException("Issue making MessageReference from JSON", e);
        }
    }

    @Override
    public String toString() {
        return "MessageReference{" +
                "referencedMessageId='" + referencedMessageId + '\'' +
                ", referencedMessageContent='" + referencedMessageContent + '\'' +
                '}';
    }
}
