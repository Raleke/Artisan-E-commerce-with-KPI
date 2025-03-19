import React, { useState, useEffect } from "react";
import { Input, Autocomplete, AutocompleteItem } from "@heroui/react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AddressStep = ({ formData, errors, handleChange, setFormData }) => {
  const apiClientPrivate = useAxiosPrivate();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      const res = await apiClientPrivate.get("/countries");
      setCountries(res.data);
      setIsLoading(false);
    };
    fetchCountries();
  }, [apiClientPrivate]);

  const fetchStates = async (countryCode) => {
    setIsLoading(true);
    const res = await apiClientPrivate.get(
      `/countries/states?countryCode=${countryCode}`,
    );
    setStates(res.data);
    setIsLoading(false);
  };

  const fetchCities = async (stateCode) => {
    setIsLoading(true);
    const res = await apiClientPrivate.get(
      `/states/cities?stateCode=${stateCode}`,
    );
    setCities(res.data);
    setIsLoading(false);
  };

  console.log(states);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Contact & Address</h2>
      <div>
        <Autocomplete
          items={countries}
          label="Country"
          placeholder="Select country"
          selectedKey={selectedCountryCode}
          onSelectionChange={(value) => {
            const selectedCountry = countries.find(
              (country) => country.country_code === value,
            );
            console.log(selectedCountry);
            setSelectedCountryCode(value);
            setSelectedCountryName(selectedCountry?.name);
            setFormData((prev) => ({
              ...prev,
              country: selectedCountry.name,
              state: "",
              city: "",
            }));
            fetchStates(value);
          }}
          isLoading={isLoading}
        >
          {(item) => (
            <AutocompleteItem key={item.country_code} value={item.country_code}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        {errors.country && (
          <span className="text-red-500 text-sm">{errors.country}</span>
        )}
      </div>
      <div>
        <Autocomplete
          items={states}
          label="State"
          placeholder="Select state"
          selectedKey={selectedStateCode}
          onSelectionChange={(value) => {
            const selectedState = states.find(
              (state) => state.state_code === value,
            );
            setSelectedStateCode(value);
            setSelectedStateName(selectedState?.name);
            setFormData((prev) => ({
              ...prev,
              state: selectedState.name,
              city: "",
            }));
            fetchCities(value);
          }}
          isLoading={isLoading}
        >
          {(item) => (
            <AutocompleteItem key={item.state_code} value={item.state_code}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        {errors.state && (
          <span className="text-red-500 text-sm">{errors.state}</span>
        )}
      </div>
      <div>
        <Autocomplete
          items={cities}
          label="City"
          placeholder="Select city"
          selectedKey={selectedCityCode}
          onSelectionChange={(value) => {
            console.log(value);
            const selectedCity = cities.find((city) => city.id === value);
            console.log(selectedCity);
            setSelectedCityCode(value);
            setSelectedCityName(selectedCity.name);
            setFormData((prev) => ({
              ...prev,
              city: selectedCity.name,
            }));
          }}
          isLoading={isLoading}
        >
          {(item) => (
            <AutocompleteItem key={item.id} value={item.id}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        {errors.city && (
          <span className="text-red-500 text-sm">{errors.city}</span>
        )}
      </div>
      <div>
        <Input
          label="Street Address"
          id="streetAddress"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          placeholder="Enter street address"
        />
        {errors.streetAddress && (
          <span className="text-red-500 text-sm">{errors.streetAddress}</span>
        )}
      </div>
    </div>
  );
};

export default AddressStep;
