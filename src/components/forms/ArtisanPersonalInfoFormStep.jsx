import React, { useRef, useState } from "react";
import { Select, SelectItem, Input } from "@heroui/react";
import { FaCamera, FaRegEye, FaRegEyeSlash, FaUpload } from "react-icons/fa";
const PersonalInfoStep = ({
  formData,
  errors,
  handleChange,
  imagePreview,
  triggerImageUpload,
  profileInputRef,
  isVisible,
  toggleVisibility,
  isVisible1,
  toggleVisibility1,
  handleImageUpload,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl text-center font-bold mb-4">
        Personal Information
      </h2>
      <div className="flex justify-center mb-6">
        <div
          className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={triggerImageUpload}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center">
              <FaCamera className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Upload Photo</span>
            </div>
          )}
          <input
            ref={profileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {imagePreview && (
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg">
              <FaUpload className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
      {errors.image && (
        <span className="text-red-500 text-sm block text-center">
          {errors.image}
        </span>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="First Name"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.firstName && (
            <span className="text-red-500 text-sm">{errors.firstName}</span>
          )}
        </div>

        <div>
          <Input
            label="Last Name"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.lastName && (
            <span className="text-red-500 text-sm">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div>
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}
      </div>

      <div>
        <Input
          label="Date of Birth"
          id="dob"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          className="mt-1"
        />
        {errors.dob && (
          <span className="text-red-500 text-sm">{errors.dob}</span>
        )}
      </div>

      <div>
        <Select
          label="Gender"
          selectedKeys={[formData.gender]}
          onChange={(e) =>
            handleChange({
              target: { name: "gender", value: e.target.value },
            })
          }
          placeholder="Select Gender"
        >
          <SelectItem key="Male" value="Male">
            Male
          </SelectItem>
          <SelectItem key="Female" value="Female">
            Female
          </SelectItem>
        </Select>
        {errors.gender && (
          <span className="text-red-500 text-sm">{errors.gender}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Phone Number"
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
          )}
        </div>

        <div>
          <Input
            label="WhatsApp Number"
            id="whatsappNumber"
            name="whatsappNumber"
            type="tel"
            value={formData.whatsappNumber}
            onChange={handleChange}
            className="mt-1"
          />
          {errors.whatsappNumber && (
            <span className="text-red-500 text-sm">
              {errors.whatsappNumber}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Password"
            id="password"
            name="password"
            type={isVisible ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className="mt-1"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility()}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        <div>
          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type={isVisible1 ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility1()}
                aria-label="toggle password visibility"
              >
                {isVisible1 ? (
                  <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default PersonalInfoStep;
