/** "Copy email" button, with a fallback that selects the address when the clipboard is blocked. */
import { profile } from "./content.js";
import { t } from "./i18n.js";
import { $ } from "./utils.js";

export function setupCopyEmail() {
  const button = $("#copyBtn");
  const text = $("#copyTxt");
  const flash = (key, ms) => {
    text.textContent = t(key);
    setTimeout(() => { text.textContent = t("contact.copy"); }, ms);
  };
  const selectAddress = () => {
    const range = document.createRange();
    range.selectNodeContents($("#mailAddr"));
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    flash("contact.copyfail", 2600);
  };

  button.addEventListener("click", () => {
    try {
      navigator.clipboard.writeText(profile.email).then(() => flash("contact.copied", 2200), selectAddress);
    } catch (e) {
      selectAddress();
    }
  });
}
