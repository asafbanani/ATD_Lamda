import logo from '../assets/atd_logo.png'
import '../App.css'

function Login() {
  return (
    <div className="page">
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <div className="panel">
        <div className="welcome">
          <img src={logo} alt="לוגו ATD למדא" className="logo-mark" />
          <h1>ברוכים השבים</h1>
          <p className="lede">התחברו כדי לנהל את השיעורים, לעקוב אחרי ההתקדמות ולהישאר בקשר עם המדריך.</p>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label className="field">
            <span>כתובת אימייל</span>
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>

          <label className="field">
            <span>סיסמה</span>
            <input type="password" name="password" placeholder="הזינו סיסמה" required />
          </label>

          <div className="actions">
            <button type="submit" className="primary">
              התחברות
            </button>
          </div>

          <button type="button" className="text-button">
            שכחתם סיסמה?
          </button>
          <p className="powered-by">מופעל על ידי ATD</p>
        </form>
      </div>
    </div>
  )
}

export default Login
