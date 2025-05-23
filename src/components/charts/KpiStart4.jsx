import React from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
  cn,
} from "@heroui/react";
import { HiViewGrid, HiServer, HiDocumentReport } from "react-icons/hi";
import { renderIcon } from "./utils";
const data = [
  {
    title: "Server Load",
    value: 38,
    status: "good",
    icon: HiServer,
  },
  {
    title: "Server Load",
    value: 98,
    status: "danger",
    icon: HiServer,
  },
  {
    title: "Average Memory Used",
    value: 64,
    status: "warn",
    icon: HiDocumentReport,
  },
];

export default function Component() {
  return (
    <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {data.map(({ title, value, status, icon: IconComponent }, index) => (
        <Card
          key={index}
          className="flex flex-col border border-transparent p-4 dark:border-default-100"
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border p-0.5",
              {
                "border-success-200 bg-success-50 dark:border-success-100":
                  status === "good",
                "border-warning-200 bg-warning-50 dark:border-warning-100":
                  status === "warn",
                "border-danger-200 bg-danger-50 dark:border-danger-100":
                  status === "danger",
              },
            )}
          >
            {renderIcon(status, IconComponent)}
          </div>

          <div className="pt-1">
            <dt className="my-2 text-sm font-medium text-default-500">
              {title}
            </dt>
            <dd className="text-2xl font-semibold text-default-700">
              {value}%
            </dd>
          </div>
          <Progress
            aria-label="status"
            className="mt-2"
            color={
              status === "good"
                ? "success"
                : status === "warn"
                  ? "warning"
                  : "danger"
            }
            value={value}
          />
          <Dropdown
            classNames={{
              content: "min-w-[120px]",
            }}
            placement="bottom-end"
          >
            <DropdownTrigger>
              <Button
                isIconOnly
                className="absolute right-2 top-2 w-auto rounded-full"
                size="sm"
                variant="light"
              >
                <HiViewGrid height={16} width={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              itemClasses={{
                title: "text-tiny",
              }}
              variant="flat"
            >
              <DropdownItem key="view-details">View Details</DropdownItem>
              <DropdownItem key="export-data">Export Data</DropdownItem>
              <DropdownItem key="set-alert">Set Alert</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Card>
      ))}
    </dl>
  );
}
