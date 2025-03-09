import React from "react";
import { Input, Autocomplete, AutocompleteItem } from "@heroui/react";
const AddressStep = ({ formData, errors, handleChange, setFormData }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Contact & Address</h2>
      <div>
        <Autocomplete
          items={[
            { id: 1, label: "Lagos", key: "Lagos" },
            { id: 2, label: "Abuja", key: "Abuja" },
            { id: 3, label: "Kano", key: "Kano" },
            { id: 4, label: "Ibadan", key: "Ibadan" },
            { id: 5, label: "Port Harcourt", key: "Port Harcourt" },
          ]}
          label="State"
          placeholder="Select state"
          selectedKey={formData.state}
          onSelectionChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              state: value,
            }));
          }}
        >
          {(item) => (
            <AutocompleteItem key={item.key} value={item.value}>
              {item.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
        {errors.state && (
          <span className="text-red-500 text-sm">{errors.state}</span>
        )}
      </div>
      <div>
        <Input
          label="City"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
        />
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
      <div>
        <Input
          label="Country"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          disabled
        />
      </div>
    </div>
  );
};
export default AddressStep;
