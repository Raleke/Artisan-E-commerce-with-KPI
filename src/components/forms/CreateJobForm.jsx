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
      companyName: "",
      employerEmail: "",
      applicationDeadline: new Date(),
      workType: "",
      commuteType: "",
      location: "",
      qualification: "SSCE",
      pay: {
        amount: "",
        frequency: "",
      },
      requiredSkill: "",
      slots: 1,
      accommodation: "No",
    },
  });

  const handleSubmit = (data) => {
    onSubmit({
      ...data,
      datePosted: new Date(),
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <CardHeader className="flex flex-col">
        <h2 className="text-2xl font-bold">Create New Job Posting</h2>
        <p className="text-gray-500">Fill in the details to post a new job</p>
      </CardHeader>

      <CardBody>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              isDisabled
              {...form.register("companyName", {
                required: "Company name is required",
              })}
            />
            <Input
              type="email"
              label="Employer Email"
              {...form.register("employerEmail", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>

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
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </Select>

          <Select
            label="Commute Type"
            {...form.register("commuteType", {
              required: "Commute type is required",
            })}
          >
            <SelectItem value="Onsite">Onsite</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </Select>

          <Input
            label="Location"
            {...form.register("location", { required: "Location is required" })}
          />

          <Input
            label="Required Skills"
            {...form.register("requiredSkill", {
              required: "Required skills are required",
            })}
          />

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
