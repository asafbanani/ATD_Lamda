import logo from '../assets/atd_logo.svg'
import googleLogo from '../assets/google-logo.svg'
import '../App.css'

type LoginProps = {
  onShowSignup: () => void
}

function Login({ onShowSignup }: LoginProps) {
  return (
    <div className="page">
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <div className="panel">
        <div className="welcome">
          <img src={logo} alt="ATD Lamda logo" className="logo-mark" />
          <h1>Welcome back</h1>
          <p className="lede">
            Log in to manage your classes, track your progress, and stay connected with your tutor.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label className="field">
            <span>Email address</span>
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </label>

          <div className="actions">
            <button type="submit" className="primary">
              Login
            </button>
            <button type="button" className="secondary" onClick={onShowSignup}>
              Register
            </button>
          </div>

          <button type="button" className="google-btn">
            <img src={googleLogo} alt="Google logo" />
            Sign in with Google
          </button>

          <button type="button" className="text-button">
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
