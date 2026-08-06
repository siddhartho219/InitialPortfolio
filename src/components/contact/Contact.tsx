import ContactForm from "@/components/contact/ContactForm";
import AnimateSection from "@/components/ui/AnimateSection";
import {
  EMAIL,
  GITHUB,
  GH_USER,
  LINKEDIN,
  LINKEDIN_HANDLE,
  TWITTER,
  TWITTER_HANDLE,
  WHATSAPP,
} from "@/data/contact";

const SOCIAL_LINKS = [
  { label: "✉ EMAIL", href: `mailto:${EMAIL}`, external: false },
  {
    label: `⌥ github.com/${GH_USER}`,
    href: GITHUB,
    external: true,
  },
  {
    label: `◈ linkedin.com/in/${LINKEDIN_HANDLE}`,
    href: LINKEDIN,
    external: true,
  },
  { label: `𝕏 x.com/${TWITTER_HANDLE}`, href: TWITTER, external: true },
  { label: "💬 WhatsApp", href: WHATSAPP, external: true },
] as const;

export default function Contact() {
  return (
    <>
      <style>{`
        .contact {
          padding: 5rem 3rem;
        }
        .contact__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
          max-width: 1120px;
          margin: 0 auto;
        }
        @media (max-width: 767px) {
          .contact__grid {
            grid-template-columns: 1fr;
          }
        }
        .contact__heading {
          font-family: var(--fb);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 1rem;
          line-height: 1.45;
          white-space: pre-line;
        }
        .contact__intro {
          font-family: var(--fb);
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-s);
          margin: 0 0 1.5rem;
        }
        .contact__socials {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .contact__social {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          max-width: 100%;
          padding: 9px 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: var(--fm);
          font-size: 12px;
          color: var(--text-s);
          text-decoration: none;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .contact__social:hover {
          transform: translateX(3px);
          border-color: var(--border-h);
          color: var(--text);
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .contact-form__field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .contact-form__label {
          font-family: var(--fm);
          font-size: 10px;
          color: var(--text-m);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .contact-form__input {
          width: 100%;
          padding: 10px 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: var(--fm);
          font-size: 12px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s ease;
        }
        .contact-form__input:focus {
          border-color: var(--accent);
        }
        .contact-form__input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .contact-form__textarea {
          resize: vertical;
          min-height: 100px;
        }
        .contact-form__submit {
          margin-top: 0.25rem;
          padding: 12px 20px;
          width: fit-content;
          background: var(--violet);
          border: 1px solid transparent;
          border-radius: 8px;
          font-family: var(--fm);
          font-size: 12px;
          color: var(--text);
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.2s ease,
            opacity 0.2s ease;
        }
        .contact-form__submit:hover:not(:disabled) {
          background: color-mix(in srgb, var(--violet) 82%, var(--bg));
        }
        .contact-form__submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .contact-form__submit-inner {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .contact-form__spinner {
          width: 14px;
          height: 14px;
          border: 2px solid color-mix(in srgb, var(--text) 25%, transparent);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: contact-spin 0.7s linear infinite;
        }
        @keyframes contact-spin {
          to {
            transform: rotate(360deg);
          }
        }
        .contact-form__status {
          font-family: var(--fm);
          font-size: 12px;
          margin: 0;
          line-height: 1.5;
        }
        .contact-form__status--success {
          color: var(--green);
          padding: 1rem;
          background: color-mix(in srgb, var(--green) 8%, transparent);
          border: 1px solid color-mix(in srgb, var(--green) 20%, transparent);
          border-radius: 8px;
        }
        .contact-form__status--error {
          color: var(--text-s);
        }
        .contact-form__status--error a {
          color: var(--accent);
        }
      `}</style>

      <section id="contact" className="contact">
        <AnimateSection className="contact__grid" variant="settle">
          <div className="contact__left">
            <h3 className="contact__heading">
              {`Open to opportunities,\ncollaborations & interesting problems.`}
            </h3>
            <p className="contact__intro">
              Whether you have a project idea, want to collaborate on research, or
              just want to talk tech — my inbox is open.
            </p>
            <div className="contact__socials">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="contact__social"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="contact__right">
            <ContactForm />
          </div>
        </AnimateSection>
      </section>
    </>
  );
}
