import React from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Input,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@heroui/react";

const CreateJobForm = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: {
      applicationDeadline: new Date(),
      jobTitle: "",
      workType: "",
      commuteType: "",
      location: "",
      qualification: "SSCE",
      pay: {
        amount: "",
        frequency: "",
      },
      requiredSkill: "",
      category: "",
      slots: 1,
      accommodation: "No",
    },
  });

  const handleSubmit = (data) => {
    console.log(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <CardHeader className="flex flex-col">
        <h2 className="text-2xl font-bold">Create New Job Posting</h2>
        <p className="text-gray-500">Fill in the details to post a new job</p>
      </CardHeader>

      <CardBody>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Input
            label="Job Title"
            {...form.register("jobTitle", {
              required: "Job title is required",
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Pay Amount (₦)"
              {...form.register("pay.amount", {
                required: "Pay amount is required",
                min: 0,
              })}
            />
            <Select
              label="Pay Frequency"
              {...form.register("pay.frequency", {
                required: "Pay frequency is required",
              })}
            >
              <SelectItem value="Per Day">Per Day</SelectItem>
              <SelectItem value="Per Job">Per Job</SelectItem>
              <SelectItem value="Per Week">Per Week</SelectItem>
              <SelectItem value="Per Month">Per Month</SelectItem>
            </Select>
          </div>

          <Select
            label="Work Type"
            {...form.register("workType", {
              required: "Work type is required",
            })}
          >
            <SelectItem key="Full-time">Full-time</SelectItem>
            <SelectItem key="Part-time">Part-time</SelectItem>
            <SelectItem key="Contract">Contract</SelectItem>
          </Select>

          <Select
            label="Commute Type"
            {...form.register("commuteType", {
              required: "Commute type is required",
            })}
          >
            <SelectItem key="Onsite">Onsite</SelectItem>
            <SelectItem key="Remote">Remote</SelectItem>
          </Select>

          <Input
            label="Location"
            {...form.register("location", { required: "Location is required" })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Category"
              {...form.register("category", {
                required: "Job category is required",
              })}
            />
            <Input
              label="Required Skill"
              {...form.register("requiredSkill", {
                required: "Required skill is required",
              })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Number of Slots"
              {...form.register("slots", {
                required: "Number of slots is required",
                min: 1,
              })}
            />
            <RadioGroup
              label="Accommodation Provided"
              {...form.register("accommodation", {
                required: "Accommodation status is required",
              })}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </RadioGroup>
          </div>

          <CardFooter className="flex justify-end space-x-2 px-0">
            <Button variant="flat" type="button">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Create Job Posting
            </Button>
          </CardFooter>
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateJobForm;
