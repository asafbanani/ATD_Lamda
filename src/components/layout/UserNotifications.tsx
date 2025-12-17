import { useEffect, useMemo, useRef, useState } from "react"
import type { NotificationItem } from "../../models/types"

type UserNotificationsProps = {
  userName: string
  userLabel: string
  notifications: NotificationItem[]
  onMarkAllRead: () => void
}

function UserNotifications({ userName, userLabel, notifications, onMarkAllRead }: UserNotificationsProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const hasUnread = useMemo(() => notifications.some((notification) => !notification.read), [notifications])
  const orderedNotifications = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications],
  )

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [open])

  useEffect(() => {
    if (open && hasUnread) onMarkAllRead()
  }, [open, hasUnread, onMarkAllRead])

  return (
    <div className="user-notify" ref={containerRef}>
      <button
        type="button"
        className={open ? "icon-button bell open" : "icon-button bell"}
        aria-label={"התרעות"}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3a5 5 0 0 0-5 5v2.586l-.707.707A1 1 0 0 0 7 13h10a1 1 0 0 0 .707-1.707L17 10.586V8a5 5 0 0 0-5-5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10 17a2 2 0 1 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {hasUnread && <span className="notify-dot" aria-hidden="true" />}
      </button>

      <div className="user-chip">
        <span className="avatar-circle">{userName.charAt(0)}</span>
        <div className="user-meta">
          <span className="user-label">{userLabel}</span>
          <strong className="user-name">{userName}</strong>
        </div>
      </div>

      {open && (
        <div className="notify-panel" role="dialog" aria-label={"התראות נוכחות"}>
          <div className="notify-panel__header">
            <div>
              <p className="eyebrow">{"התראות"}</p>
              <strong>{"נוכחות שאושרה ע\"י מורים"}</strong>
            </div>
            <span className="badge ghost">{orderedNotifications.length}</span>
          </div>

          {orderedNotifications.length === 0 ? (
            <p className="muted">{"אין התרעות חדשות"}</p>
          ) : (
            <ul className="notify-panel__list">
              {orderedNotifications.map((notification) => {
                const timeLabel = new Date(notification.createdAt).toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                return (
                  <li key={notification.id} className={notification.read ? "notify-item" : "notify-item unread"}>
                    <div className="notify-item__text">
                      <strong>{notification.title}</strong>
                      <p className="muted small">{notification.message}</p>
                    </div>
                    <span className="muted time">{timeLabel}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default UserNotifications
