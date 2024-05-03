package cz.cvut.fel.nss.user_management.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PhoneNumber {
    private String telephoneNumber;
    private CountryEnum country;
}
