import { useI18n } from "../lib/LocaleContext";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Moon, X } from "lucide-react";
export function Brand() {
  const { t, locale } = useI18n();
  return (
    <span className="brand">
      <Moon size={29} fill="currentColor" strokeWidth={0} />
      <span>
        moonstruck<span className="brand-dot">.</span>
      </span>
    </span>
  );
}
export function Bunny({ className = "" }: { className?: string }) {
  const { t, locale } = useI18n();
  return (
    <img
      src="/bunny.png"
      alt={t("Lumi, your bunny reading companion")}
      className={`bunny ${className}`}
    />
  );
}
export function IconButton({
  label,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
}) {
  const { t, locale } = useI18n();
  return (
    <button
      type="button"
      className="icon-button"
      title={t(label)}
      aria-label={t(label)}
      {...props}
    >
      {children}
    </button>
  );
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const { t, locale } = useI18n();
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`modal ${wide ? "wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Tab") {
            const elements = e.currentTarget.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input, select, textarea, [tabindex="0"]',
            );
            const first = elements[0];
            const last = elements[elements.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }}
        ref={(el) => {
          if (el && !el.contains(document.activeElement))
            el.querySelector<HTMLElement>("button, input")?.focus();
        }}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <IconButton label={t("Close dialog")} onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        {children}
      </section>
    </div>
  );
}
