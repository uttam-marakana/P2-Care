import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import DoctorPortrait from "./DoctorPortrait";

function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      data-testid={`card-doctor-${doctor.id}`}
      className="group overflow-hidden rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative h-52">
        <DoctorPortrait doctor={doctor} />
        <span className="absolute right-4 top-4 rounded-full bg-[hsl(var(--card)/.72)] px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--primary))]">
          Available
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold group-hover:text-[hsl(var(--primary))]">
          {doctor.name}
        </h3>
        <p className="mt-1 text-sm text-[hsl(var(--primary))]">
          {doctor.specialty}
        </p>
        <p className="mt-3 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
          {doctor.credentials}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-xs">
          <span className="text-[hsl(var(--muted-foreground))]">
            {doctor.experience} experience
          </span>
          <FaArrowRight
            size={16}
            className="text-[hsl(var(--primary))] transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

export default DoctorCard;
