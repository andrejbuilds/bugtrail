function ErrorState({ message, onRetry }) {
  return (
    <section className="async_state_panel error_state">
      <h2>Could not load data</h2>
      <p>{message}</p>
      <button type="button" className="new_project_btn async_state_button" onClick={onRetry}>
        Retry
      </button>
    </section>
  );
}

export default ErrorState;
