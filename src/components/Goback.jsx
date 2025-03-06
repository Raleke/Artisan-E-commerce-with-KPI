import { FaChevronLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

const GoBack = () => {
  const navigate = useNavigate();
  return (
    <Link
      className="flex items-center text-default-500 text-base"
      onClick={() => navigate(-1)} // Go back to the previous page
    >
      <FaChevronLeft /> Go Back
    </Link>
  );
};
export default GoBack;
