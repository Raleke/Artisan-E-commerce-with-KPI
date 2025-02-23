import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip,
} from "@heroui/react";
import { AiOutlineMenuFold, AiOutlineDelete } from "react-icons/ai";
import { formatCurrency, formatDate } from "../../utils/utiils";
import {
  FaArrowRight,
  FaBriefcase,
  FaBus,
  FaCalendar,
  FaGraduationCap,
  FaMapPin,
  FaRegBuilding,
  FaRegClock,
  FaUser,
} from "react-icons/fa";

export default function JobDetailsCard({
  details,
  userRole,
  isOwner,
  onDelete,
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center w-full justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {details.title}
            </h1>
          </div>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <FaRegBuilding className="h-6 w-6" />
            <Tooltip content="You have to be assigned to see the name">
              <span className="blur-sm  transition-all duration-200">
                {details.employer}
              </span>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-success-600">
              {formatCurrency(details.pay.amount)} ({details.pay.frequency})
            </span>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FaBriefcase className="h-6 w-6 text-muted-foreground" />
            <span>{details.workType}</span>
          </div>

          <div className="flex items-center space-x-2">
            <FaBus className="h-6 w-6 text-muted-foreground" />
            <span>{details.commuteType}</span>
          </div>

          <div className="flex items-center space-x-2">
            <FaMapPin className="h-6 w-6 text-muted-foreground" />
            <span>{details.location}</span>
          </div>

          <div className="flex items-center space-x-2">
            <FaCalendar className="h-6 w-6 text-muted-foreground" />
            <span>Posted {formatDate(details.datePosted)}</span>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-start space-x-2">
            <FaGraduationCap className="h-6 w-6 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium">Qualification</p>
              <p className="text-muted-foreground">{details.qualification}</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <FaUser className="h-6 w-6 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium">Required Skills</p>
              <p className="text-muted-foreground">{details.requiredSkill}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <FaRegClock className="h-6 w-6 text-muted-foreground" />
            <div>
              <span className="font-medium">Slots available:</span>
              <span className="ml-2">{details.slots}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Application deadline: {formatDate(details.applicationDeadline)}
          </p>
        </div>
      </CardBody>

      <CardFooter className="flex justify-end space-x-2 pt-4">
        {userRole === "artisan" && (
          <Button color="primary" endContent=<FaArrowRight />>
            Apply Now
          </Button>
        )}

        {userRole === "employer" && isOwner && (
          <Button color="primary" startContent=<AiOutlineMenuFold />>
            View Applications
          </Button>
        )}

        {isOwner && (
          <Button
            color="danger"
            onClick={onDelete}
            startContent=<AiOutlineDelete />
          >
            Delete Job
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
