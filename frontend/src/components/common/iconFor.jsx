import { FaBaby, FaBone, FaBrain, FaSpa, FaHeartPulse, FaStethoscope } from "react-icons/fa6";

function iconFor(icon) {
  const props = { size: 21, strokeWidth: 1.7 };
  if (icon === "heart") return <FaHeartPulse {...props} />;
  if (icon === "bone") return <FaBone {...props} />;
  if (icon === "brain") return <FaBrain {...props} />;
  if (icon === "baby") return <FaBaby {...props} />;
  if (icon === "flower") return <FaSpa {...props} />;
  return <FaStethoscope {...props} />;
}

export default iconFor;
