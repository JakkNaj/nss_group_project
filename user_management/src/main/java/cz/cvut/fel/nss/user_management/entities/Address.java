package cz.cvut.fel.nss.user_management.entities;

import cz.cvut.fel.nss.user_management.entities.dto.AddressDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address extends UserDetailElement {
    private String houseNumber;
    private String street;
    private String city;
    private String zipCode;
    private CountryEnum country;

    public Address(AddressDto addressDto) {
        this.houseNumber = addressDto.getHouseNumber();
        this.street = addressDto.getStreet();
        this.city = addressDto.getCity();
        this.zipCode = addressDto.getZipCode();
        this.country = addressDto.getCountry();
    }
}
