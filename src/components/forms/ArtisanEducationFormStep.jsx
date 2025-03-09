import React from "react";
import { Select, SelectItem, Input } from "@heroui/react";
const EducationStep = ({ formData, errors, handleChange }) => {
  console.log(formData.education.level);
  console.log(formData);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Education</h2>
      <div>
        <Select
          label="Education Level"
          name="education.level" // Add name attribute
          selectedKeys={[formData.education.level]}
          onChange={(e) =>
            handleChange({
              target: {
                name: "education.level",
                value: e.target.value,
              },
            })
          }
          placeholder="Select education level"
        >
          <SelectItem key="No Education" value="No Education">
            No Education
          </SelectItem>
          <SelectItem key="Primary School" value="Primary School">
            Primary School
          </SelectItem>
          <SelectItem key="Secondary School" value="Secondary School">
            Secondary School
          </SelectItem>
          <SelectItem key="University" value="University">
            University
          </SelectItem>
          <SelectItem key="Technical School" value="Technical School">
            Technical School
          </SelectItem>
          <SelectItem key="College of Education" value="College of Education">
            College of Education
          </SelectItem>
          <SelectItem key="Polytechnic" value="Polytechnic">
            Polytechnic
          </SelectItem>
        </Select>
        {errors["education.level"] && (
          <span className="text-red-500 text-sm">
            {errors["education.level"]}
          </span>
        )}
      </div>
      {formData.education.level &&
        formData.education.level !== "No Education" && (
          <>
            <div>
              <Input
                label="Course"
                id="course"
                name="education.details.course"
                value={formData.education.details.course}
                onChange={handleChange}
                placeholder="Enter course"
              />
              {errors["education.details.course"] && (
                <span className="text-red-500 text-sm">
                  {errors["education.details.course"]}
                </span>
              )}
            </div>
            <div>
              <Input
                label="Graduation Year"
                id="gradYear"
                name="education.details.gradYear"
                value={formData.education.details.gradYear}
                onChange={handleChange}
                placeholder="Enter graduation year"
              />
              {errors["education.details.gradYear"] && (
                <span className="text-red-500 text-sm">
                  {errors["education.details.gradYear"]}
                </span>
              )}
            </div>
            <div>
              <Input
                label="Certificate Obtained"
                id="certObtained"
                name="education.details.certObtained"
                value={formData.education.details.certObtained}
                onChange={handleChange}
                placeholder="Enter certificate obtained"
              />
              {errors["education.details.certObtained"] && (
                <span className="text-red-500 text-sm">
                  {errors["education.details.certObtained"]}
                </span>
              )}
            </div>
          </>
        )}
    </div>
  );
};
export default EducationStep;
