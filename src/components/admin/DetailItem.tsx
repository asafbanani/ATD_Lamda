type DetailItemProps = { label: string; value: string | number }

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="detail-item">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default DetailItem
