function CloseIcon() {
  return (
    <svg className="modal_close_icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ModalShell({
  title,
  description,
  children,
  footerNote,
  primaryAction,
  secondaryAction,
  onClose,
  formId,
  size = "default",
}) {
  return (
    <div className="modal_overlay">
      <section className={`modal_shell modal_shell_${size}`} role="dialog" aria-modal="true" aria-labelledby="modal_title">
        <header className="modal_header">
          <div>
            <h2 id="modal_title">{title}</h2>
            <p>{description}</p>
          </div>
          <button type="button" className="modal_icon_button" aria-label="Close modal" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        <div className="modal_body">{children}</div>

        <footer className="modal_footer">
          <p>{footerNote}</p>
          <div className="modal_footer_actions">
            <button type="button" className="modal_secondary_button" onClick={onClose}>
              {secondaryAction}
            </button>
            <button type={formId ? "submit" : "button"} form={formId} className="modal_primary_button">
              {primaryAction}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default ModalShell;
