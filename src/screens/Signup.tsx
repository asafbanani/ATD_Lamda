import logo from '../assets/atd_logo.svg'
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
          <img src={logo} alt="ATD Lamda logo" className="logo-mark" />
          <h1>Create your account</h1>
          <p className="lede">
            Start fresh, Tell us a few details and you will be inside
            in no time.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label className="field">
            <span>Full name</span>
            <input type="text" name="name" placeholder="Alex Doe" required />
          </label>

          <label className="field">
            <span>Email address</span>
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              required
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              required
            />
          </label>

          <div className="actions">
            <button type="submit" className="primary">
              Sign up
            </button>
            <button type="button" className="secondary" onClick={onShowLogin}>
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
