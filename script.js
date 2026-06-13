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

  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );

  return emailMatch ? emailMatch[0] : "";
};

const showTemporaryMessage = (target, message, labelText = "안내") => {
  const valueElement = target.querySelector(".value");
  const labelElement = target.querySelector(".label");

  if (!valueElement) return;

  const originalValue = valueElement.textContent;
  const originalLabel = labelElement ? labelElement.textContent : "";

  valueElement.textContent = message;

  if (labelElement) {
    labelElement.textContent = labelText;
  }

  window.setTimeout(() => {
    valueElement.textContent = originalValue;

    if (labelElement) {
      labelElement.textContent = originalLabel;
    }
  }, 1400);
};

const emailInfoItem = Array.from(document.querySelectorAll(".info-item")).find(
  (item) => {
    const href = item.getAttribute("href") || "";
    const text = item.textContent || "";

    return href.startsWith("mailto:") || text.includes("@");
  }
);

if (emailInfoItem) {
  emailInfoItem.addEventListener("click", async (event) => {
    const email = getEmailText(emailInfoItem);

    if (!email) return;

    event.preventDefault();

    const isCopied = await copyToClipboard(email);

    if (isCopied) {
      showTemporaryMessage(emailInfoItem, "이메일이 복사되었습니다", "Copied");
    } else {
      showTemporaryMessage(emailInfoItem, "복사에 실패했습니다", "Error");
    }
  });
}

const downloadContactFile = () => {
  const contactData = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:이;보현;;;",
    "FN:이보현",
    "TITLE:게임기획자",
    "TEL;TYPE=CELL:010-5571-0831",
    "EMAIL:dkwgsk@gmail.com",
    "URL:https://github.com/LeeBohyun-8031",
    "END:VCARD",
  ].join("\n");

  const blob = new Blob([contactData], {
    type: "text/vcard;charset=utf-8",
  });

  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = downloadUrl;
  downloadLink.download = "이보현.vcf";
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(downloadUrl);
};

const phoneInfoItem = document.querySelector("[data-save-contact]");

if (phoneInfoItem) {
  phoneInfoItem.addEventListener("click", (event) => {
    event.preventDefault();

    downloadContactFile();
    showTemporaryMessage(phoneInfoItem, "연락처 파일이 저장되었습니다", "Saved");
  });
}