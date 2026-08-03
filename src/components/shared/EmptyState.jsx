function EmptyState({ className, title, description }) {
  return (
    <div className={className}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;
