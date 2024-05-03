package cz.cvut.fel.nss.user_management.entities.dto;

import cz.cvut.fel.nss.user_management.entities.Address;
import cz.cvut.fel.nss.user_management.entities.CountryEnum;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Optional;

@Getter
@Setter
@NoArgsConstructor
public class AddressDto {
    private int addressId;
    private String houseNumber;
    private String street;
    private String city;
    private String zipCode;
    private CountryEnum country;

    public AddressDto(Address address) {
        this.houseNumber = address.getHouseNumber();
        this.street = address.getStreet();
        this.city = address.getCity();
        this.zipCode = address.getZipCode();
        this.country = address.getCountry();
    }
}