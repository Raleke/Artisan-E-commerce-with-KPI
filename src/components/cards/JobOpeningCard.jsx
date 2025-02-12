import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip,
} from "@heroui/react";
import { FcMoneyTransfer } from "react-icons/fc";
import { formattedWithCommas } from "../../utils/utiils";
import { AiOutlineMenuFold } from "react-icons/ai";

export default function JobOpeningCard({ details }) {
  return (
    <Card>
      <CardHeader className="flex-col">
        <h1 className="text-3xl">{details.tittle}</h1>
        <p className="text-small ">
          Company{" "}
          <Tooltip content="You have to been assigned to see the name">
            <span
              className="text-transparent select-none "
              style={{ textShadow: "0 0 5px rgba(0,0,0,0.5)" }}
            >
              {details.employer}
            </span>
          </Tooltip>
        </p>
      </CardHeader>
      <CardBody>
        <div className="flex justify-center  gap-4">
          <FcMoneyTransfer className="h-8 w-8" />
          <span className="text-xl content-center">
            ₦{formattedWithCommas(details.priceRange1)} - ₦
            {formattedWithCommas(details.priceRange2)}
          </span>
        </div>
        <p>{details.location}</p>
        <p>{details.date}</p>
      </CardBody>
      <CardFooter>
        <Button
          startContent=<AiOutlineMenuFold />
          color="primary"
          variant="flat"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
