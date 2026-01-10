export default function Panel({ title, color = 'cyan', status, children }) {
  return (
    <div className={`panel panel--${color}`}>
      <div className="panel-header">
        <span className="panel-title">{title}</span>
        {status && <span className="panel-status">{status}</span>}
      </div>
      <div className="panel-content">
        {children}
      </div>
    </div>
  )
}
