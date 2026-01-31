export default function CustodyLogsList({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-4">
      {logs.length === 0 && (
        <p className="text-gray-600">No custody records yet</p>
      )}

      {logs.map(log => (
        <div key={log._id} className="border rounded p-4 space-y-1">
          <p><strong>From:</strong> {log.from}</p>
          <p><strong>To:</strong> {log.to}</p>
          <p><strong>Purpose:</strong> {log.purpose}</p>
          <p><strong>Remarks:</strong> {log.remarks}</p>
          <p className="text-sm text-gray-600">
            {new Date(log.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}
