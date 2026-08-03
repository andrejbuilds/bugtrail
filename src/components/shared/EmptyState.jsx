function EmptyState({ className, title, description, actionLabel, onAction }) {
  return (
    <div className={className}>
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="new_project_btn empty_state_action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
