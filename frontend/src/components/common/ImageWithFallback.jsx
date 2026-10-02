import { useState } from "react";

function ImageWithFallback({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState(src);
  const fallback =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#e7f0ef"/><path d="M600 250v300M450 400h300" stroke="#15575b" stroke-width="34" stroke-linecap="round"/></svg>',
    );

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (imageSrc !== fallback) setImageSrc(fallback);
      }}
    />
  );
}

export default ImageWithFallback;
