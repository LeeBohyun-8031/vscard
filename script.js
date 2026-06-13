const profileImage = document.getElementById("profileImage");

const fallbackImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <rect width="240" height="240" rx="120" fill="#f3f4f6"/>
      <circle cx="120" cy="92" r="42" fill="#d1d5db"/>
      <path d="M48 210c10-48 42-74 72-74s62 26 72 74" fill="#d1d5db"/>
    </svg>
  `);

if (profileImage) {
  profileImage.addEventListener("error", () => {
    profileImage.src = fallbackImage;
  });
}