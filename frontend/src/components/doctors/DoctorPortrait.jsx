import { FaUserDoctor } from "react-icons/fa6";
import { resolveMediaUrl } from "@/services/media";

function DoctorPortrait({ doctor, className = "" }) {
  if (doctor.image_url) {
    return (
      <img
        src={resolveMediaUrl(doctor.image_url)}
        alt={doctor.name}
        className={`${className} h-full w-full object-cover`}
      />
    );
  }

  const surname = doctor.name.trim().split(/\s+/).at(-1);

  return (
    <div
      role="img"
      aria-label={`Profile placeholder for ${doctor.name}`}
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${doctor.tone} ${className}`}
    >
      <span className="absolute -right-4 -top-10 font-display text-[9rem] leading-none text-white/25">
        {surname?.[0]}
      </span>
      <FaUserDoctor
        aria-hidden="true"
        className="relative z-10 h-24 w-24 text-white/75 drop-shadow-sm"
      />
      <span className="absolute bottom-4 rounded-full border border-white/60 bg-white/70 px-4 py-1 font-mono text-xs font-bold tracking-widest text-[hsl(var(--foreground))]">
        {doctor.initials}
      </span>
    </div>
  );
}

export default DoctorPortrait;
