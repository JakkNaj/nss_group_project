package cz.cvut.fel.nss.user_management.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PhoneNumbers extends UserDetailElement {
    private List<PhoneNumber> listOfPhoneNumbers;
}
