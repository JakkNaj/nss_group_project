package cz.cvut.fel.nss.user_management.entities.dto;

import cz.cvut.fel.nss.user_management.entities.PhoneNumbers;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UserDetailDto {
    private int userId;
    private LocalDate birthdate;
    private LocalDate accountCreated;
    private AddressDto address;
    private PhoneNumbers phones;
}
