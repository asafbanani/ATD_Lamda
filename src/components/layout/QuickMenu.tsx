import { useEffect, useRef, useState } from "react"

function QuickMenu() {
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

  const items = ["\u05db\u05d9\u05ea\u05d5\u05ea", "\u05ea\u05dc\u05de\u05d9\u05d3\u05d9\u05dd", "\u05d3\u05d5\u05d7 X", "\u05d3\u05d5\u05d7 Z", "\u05d7\u05e9\u05d1\u05d5\u05e0\u05d5\u05ea"]

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
            <button key={item} type="button" className="menu-item" onClick={() => setOpen(false)}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuickMenu
