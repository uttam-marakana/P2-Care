import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import ImageWithFallback from "../common/ImageWithFallback";
import { imagePath } from "../common/imagePath";
import { resolveMediaUrl } from "@/services/media";

function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      data-testid={`card-doctor-${doctor.id}`}
      className="group overflow-hidden rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
    >
      <div className={`relative h-52 bg-gradient-to-br ${doctor.tone}`}>
        <ImageWithFallback
          src={
            resolveMediaUrl(doctor.image_url) || imagePath("doctor-care.jpg")
          }
          alt={`${doctor.name}, ${doctor.specialty}`}
          className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-multiply"
        />
        <span className="absolute bottom-4 left-4 grid h-16 w-16 place-items-center rounded-[20px] border border-white/40 bg-white/25 font-display text-2xl text-[hsl(var(--foreground))] backdrop-blur-sm">
          {doctor.initials}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-[hsl(var(--card)/.72)] px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--primary))]">
          Available
        </span>
        <div className="absolute right-[-14px] top-[-22px] text-[130px] font-display leading-none text-white/25">
          {doctor.name.split(" ").slice(-1)[0][0]}
        </div>
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
