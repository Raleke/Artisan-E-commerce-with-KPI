import React from "react";
import { Input, Button, Textarea, Select, SelectItem } from "@heroui/react";
const ProfessionalInfoStep = ({
  formData,
  errors,
  handleChange,
  handleAddSkill,
  handleAddJobCategory,
}) => {
  return (
    <div className="space-y-4">
      {/* Address Information UI */}
      <h2 className="text-xl font-bold mb-4">Professional Information</h2>
      <div>
        <Select
          label="Job Type"
          id="jobType"
          selectedKeys={[formData.jobType]}
          onChange={(e) =>
            handleChange({
              target: { name: "jobType", value: e.target.value },
            })
          }
          placeholder="Select job type"
        >
          <SelectItem key="Full-Time">Full Time</SelectItem>
          <SelectItem key="Contract">Contract</SelectItem>
        </Select>

        {errors.jobType && (
          <span className="text-red-500 text-sm">{errors.jobType}</span>
        )}
      </div>
      <div>
        <Input
          label="Years of Experience"
          id="yearsOfExperience"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          placeholder="Enter years of experience"
        />
        {errors.yearsOfExperience && (
          <span className="text-red-500 text-sm">
            {errors.yearsOfExperience}
          </span>
        )}
      </div>
      <div>
        <Textarea
          label="Artisan Description"
          id="artisanDescription"
          name="artisanDescription"
          value={formData.artisanDescription}
          onChange={handleChange}
          placeholder="Enter a brief description"
        />
        {errors.artisanDescription && (
          <span className="text-red-500 text-sm">
            {errors.artisanDescription}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Job Categories</h3>
        {formData.jobCategories.map((category, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <Input
              label={`Job Category ${index + 1}`}
              id={`jobCategory-${index}`}
              name={`jobCategories[${index}].jobCategory`}
              className="mb-2"
              value={category.jobCategory}
              onChange={handleChange}
              placeholder="Enter job category"
            />
            {errors[`jobCategory-${index}`] && (
              <span className="text-red-500 text-sm">
                {errors[`jobCategory-${index}`]}
              </span>
            )}

            <div className="mt-2 mb-2">
              <h4 className="text-md font-semibold">Skills</h4>
            </div>

            {Array.isArray(category.skills) &&
              category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="mb-2">
                  <Input
                    label={`Skill ${skillIndex + 1}`}
                    id={`skill-${index}-${skillIndex}`}
                    name={`jobCategories[${index}].skills[${skillIndex}]`}
                    value={skill}
                    onChange={handleChange}
                    placeholder="Enter skill"
                  />
                  {errors[`skill-${index}-${skillIndex}`] && (
                    <span className="text-red-500 text-sm">
                      {errors[`skill-${index}-${skillIndex}`]}
                    </span>
                  )}
                </div>
              ))}

            <Button
              type="button"
              onClick={() => handleAddSkill(index)}
              variant="flat"
              color="secondary"
              size="sm"
              className="mt-2"
            >
              Add Skill
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={handleAddJobCategory}
          variant="ghost"
          color="secondary"
          className="mt-2"
        >
          Add Job Category
        </Button>
      </div>
    </div>
  );
};
export default ProfessionalInfoStep;
