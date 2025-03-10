import React from "react";
import { Controller, useForm } from "react-hook-form";
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
  DateInput,
} from "@heroui/react";
import { FaCalendar } from "react-icons/fa6";
import {
  now,
  parseAbsoluteToLocal,
  getLocalTimeZone,
  CalendarDate,
} from "@internationalized/date";
import useAuth from "../../hooks/useAuth";
import { usePostEmployerJob } from "../../adapters/Requests";

const CreateJobForm = () => {
  const currentDate = now();
  const deadline = currentDate.add({ days: 7 });
  const defaultDeadline = new CalendarDate(
    deadline.year,
    deadline.month,
    deadline.day,
  );

  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      applicationDeadline: defaultDeadline,
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

  console.log(user);
  const { mutate: postJob } = usePostEmployerJob();

  const handleFormSubmit = (data) => {
    const applicationDeadline =
      data.applicationDeadline.toDate(getLocalTimeZone());
    const transformedData = {
      ...data,
      applicationDeadline,
      employerId: user.id,
    };
    postJob(transformedData);
  };

  const handleCancel = () => {
    reset({
      applicationDeadline: defaultDeadline,
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
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <CardHeader className="flex flex-col">
        <h2 className="text-2xl font-bold">Create New Job Posting</h2>
        <p className="text-gray-500">Fill in the details to post a new job</p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Input
            label="Job Title"
            {...register("jobTitle", {
              required: "Job title is required",
            })}
            isInvalid={!!errors.jobTitle}
            errorMessage={errors.jobTitle?.message}
          />

          <Controller
            name="applicationDeadline"
            control={control}
            rules={{ required: "Application deadline is required" }}
            render={({ field }) => (
              <DateInput
                label="Application Deadline"
                {...field}
                isInvalid={!!errors.applicationDeadline}
                errorMessage={errors.applicationDeadline?.message}
                endContent={
                  <FaCalendar className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
            )}
          />

          <Input
            label="Qualification"
            {...register("qualification", {
              required: "Qualification is required",
            })}
            isInvalid={!!errors.qualification}
            errorMessage={errors.qualification?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Pay Amount (₦)"
              {...register("pay.amount", {
                required: "Pay amount is required",
                min: 0,
              })}
              isInvalid={!!errors.pay?.amount}
              errorMessage={errors.pay?.amount?.message}
            />
            <Controller
              name="pay.frequency"
              control={control}
              rules={{ required: "Pay frequency is required" }}
              render={({ field }) => (
                <Select
                  label="Pay Frequency"
                  {...field}
                  isInvalid={!!errors.pay?.frequency}
                  errorMessage={errors.pay?.frequency?.message}
                >
                  <SelectItem key="Per Day" value="Per Day">
                    Per Day
                  </SelectItem>
                  <SelectItem key="Per Job" value="Per Job">
                    Per Job
                  </SelectItem>
                  <SelectItem key="Per Week" value="Per Week">
                    Per Week
                  </SelectItem>
                  <SelectItem key="Per Month" value="Per Month">
                    Per Month
                  </SelectItem>
                </Select>
              )}
            />
          </div>

          <Controller
            name="workType"
            control={control}
            rules={{ required: "Work type is required" }}
            render={({ field }) => (
              <Select
                label="Work Type"
                {...field}
                isInvalid={!!errors.workType}
                errorMessage={errors.workType?.message}
              >
                <SelectItem key="Full-time" value="Full-time">
                  Full-time
                </SelectItem>
                <SelectItem key="Part-time" value="Part-time">
                  Part-time
                </SelectItem>
                <SelectItem key="Contract" value="Contract">
                  Contract
                </SelectItem>
              </Select>
            )}
          />

          <Controller
            name="commuteType"
            control={control}
            rules={{ required: "Commute type is required" }}
            render={({ field }) => (
              <Select
                label="Commute Type"
                {...field}
                isInvalid={!!errors.commuteType}
                errorMessage={errors.commuteType?.message}
              >
                <SelectItem key="Onsite" value="Onsite">
                  Onsite
                </SelectItem>
                <SelectItem key="Remote" value="Remote">
                  Remote
                </SelectItem>
              </Select>
            )}
          />

          <Input
            label="Location"
            {...register("location", { required: "Location is required" })}
            isInvalid={!!errors.location}
            errorMessage={errors.location?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Category"
              {...register("category", {
                required: "Job category is required",
              })}
              isInvalid={!!errors.category}
              errorMessage={errors.category?.message}
            />
            <Input
              label="Required Skill"
              {...register("requiredSkill", {
                required: "Required skill is required",
              })}
              isInvalid={!!errors.requiredSkill}
              errorMessage={errors.requiredSkill?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Number of Slots"
              {...register("slots", {
                required: "Number of slots is required",
                min: 1,
              })}
              isInvalid={!!errors.slots}
              errorMessage={errors.slots?.message}
            />
            <Controller
              name="accommodation"
              control={control}
              rules={{ required: "Accommodation status is required" }}
              render={({ field }) => (
                <RadioGroup
                  label="Accommodation Provided"
                  {...field}
                  isInvalid={!!errors.accommodation}
                  errorMessage={errors.accommodation?.message}
                >
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </RadioGroup>
              )}
            />
          </div>

          <CardFooter className="flex justify-end space-x-2 px-0">
            <Button variant="flat" type="button" onClick={handleCancel}>
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
