import React from "react";
import { Select, SelectItem, Input } from "@heroui/react";
import { FaFile } from "react-icons/fa";
const WorkExperienceStep = ({
  formData,
  errors,
  handleChange,
  cvFileName,
  triggerCvUpload,
  cvInputRef,
  handleCvUpload,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Work Experience</h2>
      <div onClick={triggerCvUpload}>
        <label
          htmlFor="cv"
          className="w-full flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:border-gray-400 transition-colors"
        >
          <FaFile className="w-6 h-6 text-gray-400" />
          <span className="text-sm text-gray-500 ml-2">
            {cvFileName || "Upload CV"}
          </span>
        </label>
        {errors.cv && <span className="text-red-500 text-sm">{errors.cv}</span>}

        <input
          type="file"
          id="cv"
          name="cv"
          ref={cvInputRef}
          onChange={handleCvUpload}
          className="hidden"
        />
      </div>
      <div>
        <Select
          label="Do you have work experience?"
          selectedKeys={[formData.workExperience.hasExperience]}
          onChange={(e) =>
            handleChange({
              target: {
                name: "workExperience.hasExperience",
                value: e.target.value,
              },
            })
          }
          placeholder="Select an option"
        >
          <SelectItem key="Yes">Yes</SelectItem>
          <SelectItem key="No">No</SelectItem>
        </Select>
        {errors.workExperience?.hasExperience && (
          <span className="text-red-500 text-sm">
            {errors.workExperience.hasExperience}
          </span>
        )}
      </div>
      {formData.workExperience.hasExperience === "Yes" && (
        <>
          <div>
            <Input
              label="Company Name"
              id="companyName"
              name="workExperience.details.companyName"
              value={formData.workExperience.details.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
            />
            {errors.workExperience?.details?.companyName && (
              <span className="text-red-500 text-sm">
                {errors.workExperience.details.companyName}
              </span>
            )}
          </div>
          <div>
            <Input
              label="Role"
              id="role"
              name="workExperience.details.role"
              value={formData.workExperience.details.role}
              onChange={handleChange}
              placeholder="Enter role"
            />
            {errors.workExperience?.details?.role && (
              <span className="text-red-500 text-sm">
                {errors.workExperience.details.role}
              </span>
            )}
          </div>
          <div>
            <Input
              label="Start Year"
              id="startYear"
              name="workExperience.details.startYear"
              value={formData.workExperience.details.startYear}
              onChange={handleChange}
              placeholder="Enter start year"
            />
            {errors.workExperience?.details?.startYear && (
              <span className="text-red-500 text-sm">
                {errors.workExperience.details.startYear}
              </span>
            )}
          </div>
          <div>
            <Input
              label="End Year"
              id="endYear"
              name="workExperience.details.endYear"
              value={formData.workExperience.details.endYear}
              onChange={handleChange}
              placeholder="Enter end year"
            />
            {errors.workExperience?.details?.endYear && (
              <span className="text-red-500 text-sm">
                {errors.workExperience.details.endYear}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default WorkExperienceStep;
