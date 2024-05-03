package cz.cvut.fel.nss.user_management.entities;

public enum CountryEnum {
    USA("USA", "+1"),
    UK("UK", "+44"),
    CZ("Czech Republic", "+420");

    private final String country;
    private final String phoneCode;

    CountryEnum(String country, String phoneCode) {
        this.country = country;
        this.phoneCode = phoneCode;
    }

    public String getCountry() {
        return country;
    }

    public String getPhoneCode() {
        return phoneCode;
    }
}
