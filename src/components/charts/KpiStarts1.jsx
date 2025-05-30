import React from "react";
import { Card, Chip, cn } from "@heroui/react";
import {
  HiTrendingUp,
  HiTrendingDown,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";

const data = [
  {
    title: "Total Revenue",
    value: "$228,451",
    change: "33%",
    changeType: "positive",
    trendType: "up",
  },
  {
    title: "Total Expenses",
    value: "$71,887",
    change: "13.0%",
    changeType: "negative",
    trendType: "up",
  },
  {
    title: "Total Profit",
    value: "$156,540",
    change: "0.0%",
    changeType: "neutral",
    trendType: "neutral",
  },
  {
    title: "New Customers",
    value: "1,234",
    change: "1.0%",
    changeType: "positive",
    trendType: "up",
  },
];

const data2 = [
  {
    title: "Monthly Sales",
    value: "$345,892",
    change: "12.5%",
    changeType: "positive",
    trendType: "up",
    trendChipVariant: "flat",
    trendChipPosition: "bottom",
  },
  {
    title: "Operating Costs",
    value: "$98,234",
    change: "18.3%",
    changeType: "negative",
    trendType: "up",
    trendChipVariant: "flat",
    trendChipPosition: "bottom",
  },
  {
    title: "Net Income",
    value: "$247,658",
    change: "15.2%",
    changeType: "neutral",
    trendType: "neutral",
    trendChipVariant: "flat",
    trendChipPosition: "bottom",
  },
  {
    title: "Active Users",
    value: "2,847",
    change: "4.7%",
    changeType: "positive",
    trendType: "up",
    trendChipVariant: "flat",
    trendChipPosition: "bottom",
  },
];

const TrendCard = ({
  title,
  value,
  change,
  changeType,
  trendType,
  trendChipPosition = "top",
  trendChipVariant = "light",
}) => {
  return (
    <Card className=" border border-transparent dark:border-default-100">
      <div className="flex p-4">
        <div className="flex flex-col gap-y-2">
          <dt className="text-small font-medium text-default-500">{title}</dt>
          <dd className="text-2xl font-semibold text-default-700">{value}</dd>
        </div>
        <Chip
          className={cn("absolute right-4", {
            "top-4": trendChipPosition === "top",
            "bottom-4": trendChipPosition === "bottom",
          })}
          classNames={{
            content: "font-medium text-[0.65rem]",
          }}
          color={
            changeType === "positive"
              ? "success"
              : changeType === "neutral"
                ? "warning"
                : "danger"
          }
          radius="sm"
          size="sm"
          startContent={
            trendType === "up" ? (
              <HiTrendingUp height={12} width={12} />
            ) : trendType === "neutral" ? (
              <HiOutlineArrowNarrowRight height={12} width={12} />
            ) : (
              <HiTrendingDown height={12} width={12} />
            )
          }
          variant={trendChipVariant}
        >
          {change}
        </Chip>
      </div>
    </Card>
  );
};

export default function Component() {
  return (
    <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map((props, index) => (
        <TrendCard key={index} {...props} />
      ))}
      {data2.map((props, index) => (
        <TrendCard key={index} {...props} />
      ))}
    </dl>
  );
}
