export default function Badge({ type = 'info', children }) {
  return <span className={`badge ${type}`}>{children}</span>;
}
