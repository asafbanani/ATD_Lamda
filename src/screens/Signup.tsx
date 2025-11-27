import logo from '../assets/atd_logo.png'
import '../App.css'

type SignupProps = {
  onShowLogin: () => void
}

function Signup({ onShowLogin }: SignupProps) {
  return (
    <div className="page">
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <div className="panel">
        <div className="welcome">
          <img src={logo} alt="לוגו ATD למדא" className="logo-mark" />
          <h1>צרו חשבון חדש</h1>
          <p className="lede">התחילו את מסע הלמידה, הזמינו שיעורים ושיתפו פעולה עם המדריכים—all במקום אחד.</p>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label className="field">
            <span>שם מלא</span>
            <input type="text" name="name" placeholder="דנה כהן" required />
          </label>

          <label className="field">
            <span>כתובת אימייל</span>
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>

          <label className="field">
            <span>סיסמה</span>
            <input type="password" name="password" placeholder="צרו סיסמה" required />
          </label>

          <label className="field">
            <span>אישור סיסמה</span>
            <input type="password" name="confirmPassword" placeholder="הקלידו שוב סיסמה" required />
          </label>

          <div className="actions">
            <button type="submit" className="primary">
              הרשמה
            </button>
            <button type="button" className="secondary" onClick={onShowLogin}>
              חזרה להתחברות
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
