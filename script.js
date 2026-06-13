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

const copyToClipboard = async (text) => {
  if (!text) return false;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let isCopied = false;

  try {
    isCopied = document.execCommand("copy");
  } catch (error) {
    console.error("대체 복사 방식 실패:", error);
  }

  document.body.removeChild(textarea);

  return isCopied;
};

const getEmailText = (element) => {
  const href = element.getAttribute("href");

  if (href && href.startsWith("mailto:")) {
    return href.replace("mailto:", "").split("?")[0].trim();
  }

  const valueElement = element.querySelector(".value");
  const text = valueElement ? valueElement.textContent : element.textContent;

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  return emailMatch ? emailMatch[0] : "";
};

const showCopyMessage = (target, message) => {
  const valueElement = target.querySelector(".value");
  const labelElement = target.querySelector(".label");

  if (!valueElement) return;

  const originalValue = valueElement.textContent;
  const originalLabel = labelElement ? labelElement.textContent : "";

  valueElement.textContent = message;

  if (labelElement) {
    labelElement.textContent = "Copied";
  }

  window.setTimeout(() => {
    valueElement.textContent = originalValue;

    if (labelElement) {
      labelElement.textContent = originalLabel;
    }
  }, 1200);
};

const emailItems = Array.from(document.querySelectorAll(".info-item")).filter(
  (item) => {
    const href = item.getAttribute("href") || "";
    const text = item.textContent || "";

    return href.startsWith("mailto:") || text.includes("@");
  }
);

emailItems.forEach((emailItem) => {
  emailItem.addEventListener("click", async (event) => {
    const email = getEmailText(emailItem);

    if (!email) return;

    event.preventDefault();

    const isCopied = await copyToClipboard(email);

    if (isCopied) {
      showCopyMessage(emailItem, "이메일이 복사되었습니다");
    } else {
      showCopyMessage(emailItem, "복사에 실패했습니다");
    }
  });
});