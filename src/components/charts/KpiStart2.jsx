import React from "react";
import { Button, Card, Chip, cn } from "@heroui/react";
import { renderIcon } from "./utils.jsx";
import {
  HiTrendingUp,
  HiTrendingDown,
  HiOutlineArrowNarrowRight,
  HiCreditCard,
  HiCash,
  HiOutlineUsers,
} from "react-icons/hi";
const data = [
  {
    title: "Total Users",
    value: "5,400",
    change: "33%",
    changeType: "good",
    trendChipPosition: "top",
    icon: HiOutlineUsers,
  },
  {
    title: "Total Sales",
    value: "$15,400",
    change: "0.0%",
    changeType: "warn",
    trendChipPosition: "top",
    icon: HiCreditCard,
  },
  {
    title: "Net Profit",
    value: "$10,400",
    change: "3.3%",
    changeType: "danger",
    trendChipPosition: "top",
    icon: HiCash,
  },
];

export default function Component() {
  return (
    <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {data.map(
        (
          {
            title,
            value,
            change,
            changeType,
            icon: IconComponent,
            trendChipPosition,
          },
          index,
        ) => (
          <Card
            key={index}
            className="border border-transparent dark:border-default-100"
          >
            <div className="flex p-4">
              <div
                className={cn(
                  "mt-1 flex h-8 w-8 items-center justify-center rounded-md",
                  {
                    "bg-success-50": changeType === "good",
                    "bg-warning-50": changeType === "warn",
                    "bg-danger-50": changeType === "danger",
                  },
                )}
              >
                {renderIcon(changeType, IconComponent)}
              </div>

              <div className="flex flex-col gap-y-2">
                <dt className="mx-4 text-small font-medium text-default-500">
                  {title}
                </dt>
                <dd className="px-4 text-2xl font-semibold text-default-700">
                  {value}
                </dd>
              </div>

              <Chip
                className={cn("absolute right-4", {
                  "top-4": trendChipPosition === "top",
                  "bottom-4": trendChipPosition === "bottom",
                })}
                classNames={{
                  content: "font-semibold text-[0.65rem]",
                }}
                color={
                  changeType === "good"
                    ? "success"
                    : changeType === "warn"
                      ? "warning"
                      : "danger"
                }
                radius="sm"
                size="sm"
                startContent={
                  changeType === "good" ? (
                    <HiTrendingUp height={12} width={12} />
                  ) : changeType === "warn" ? (
                    <HiOutlineArrowNarrowRight height={12} width={12} />
                  ) : (
                    <HiTrendingDown height={12} width={12} />
                  )
                }
                variant="flat"
              >
                {change}
              </Chip>
            </div>

            <div className="bg-default-100">
              <Button
                fullWidth
                className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100"
                radius="none"
                variant="light"
              >
                View All
              </Button>
            </div>
          </Card>
        ),
      )}
    </dl>
  );
}
