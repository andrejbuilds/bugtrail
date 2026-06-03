function DashboardSummaryCard({
  icon,
  iconAlt = "",
  value,
  title,
  description,
  pillText,
  pillStyle,
  iconClassName = "",
}) {
  const summaryIconClassName = iconClassName
    ? `summary_card_icon ${iconClassName}`
    : "summary_card_icon";

  return (
    <div className="summary_card">
      <img className={summaryIconClassName} src={icon} alt={iconAlt} />
      <h2 className="summary_card_value">{value}</h2>
      <p className="summary_card_title">{title}</p>
      <p className="summary_card_description">{description}</p>
      <div className="summary_card_pill" style={pillStyle}>
        {pillText}
      </div>
    </div>
  );
}

export default DashboardSummaryCard;
