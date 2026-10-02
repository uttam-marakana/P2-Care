export const imagePath = (file) =>
  `${import.meta.env.BASE_URL.replace(/\/?$/, "/")}images/${file}`;
