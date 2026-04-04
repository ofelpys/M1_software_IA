import Badge from '../Badge';

export default function MetricCard({ tone, label, value, badgeType, badgeText }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-top"></div>
      <p>{label}</p>
      <strong>{value}</strong>
      <Badge type={badgeType}>{badgeText}</Badge>
    </article>
  );
}
