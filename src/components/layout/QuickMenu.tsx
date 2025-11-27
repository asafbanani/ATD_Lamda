import { useEffect, useRef, useState } from "react"

type MenuItem = {
  key: string
  label: string
}

type QuickMenuProps = {
  items: MenuItem[]
  activeKey?: string
  onSelect: (key: string) => void
}

function QuickMenu({ items, activeKey, onSelect }: QuickMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [open])

  return (
    <div className="menu" ref={ref}>
      <button
        type="button"
        className={open ? "menu-button open" : "menu-button"}
        aria-label="\u05e4\u05ea\u05d7 \u05ea\u05e4\u05e8\u05d9\u05d8 \u05d1\u05e0\u05d9\u05d4\u05d5\u05dc"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>
      {open && (
        <div className="menu-dropdown">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className={item.key === activeKey ? "menu-item active" : "menu-item"}
              onClick={() => {
                onSelect(item.key)
                setOpen(false)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuickMenu
