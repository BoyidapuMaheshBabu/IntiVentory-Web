import { useEffect, useState, useRef, type FormEvent } from "react";
import appIcon from "../docs/assets/intiventory-app-icon.svg";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type AuthView = "sign-in" | "sign-up" | "reset" | "update-password";
type Feedback = { kind: "success" | "error" | "info"; text: string };
type PasswordStrength = "very-weak" | "weak" | "medium" | "strong" | "very-strong";

const copy = {
  "sign-in": {
    title: "Welcome back",
    description: "Sign in to pick up where your household left off.",
    action: "Sign in",
    busy: "Signing in…",
  },
  "sign-up": {
    title: "Create your account",
    description: "Set up your account to start organizing your household.",
    action: "Create account",
    busy: "Creating account…",
  },
  reset: {
    title: "Reset your password",
    description: "Enter your email and we’ll send you a password reset link.",
    action: "Send reset link",
    busy: "Sending link…",
  },
  "update-password": {
    title: "Choose a new password",
    description: "Create a new password for your IntiVentory account.",
    action: "Update password",
    busy: "Updating password…",
  },
} satisfies Record<AuthView, { title: string; description: string; action: string; busy: string }>;

function App() {
  const [view, setView] = useState<AuthView>(() => window.location.hash.includes("type=recovery") ? "update-password" : "sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("very-weak");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setView("update-password");
        setFeedback(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Focus management on view change
  useEffect(() => {
    // Small delay to allow DOM to render
    const timer = setTimeout(() => {
      switch (view) {
        case "sign-in":
        case "sign-up":
        case "reset":
          if (emailRef.current) emailRef.current.focus();
          break;
        case "update-password":
          if (passwordRef.current) passwordRef.current.focus();
          break;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [view]);

  // Password strength meter
  useEffect(() => {
    setPasswordStrength("very-weak");
    if (password.length === 0) return;
    const len = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const scores = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    if (scores >= 4 && len >= 12) setPasswordStrength("very-strong");
    else if (scores >= 4 || (scores >= 3 && len >= 8)) setPasswordStrength("strong");
    else if (scores >= 3 || (scores >= 2 && len >= 6)) setPasswordStrength("medium");
    else if (scores >= 2 || len >= 4) setPasswordStrength("weak");
    else setPasswordStrength("very-weak");
  }, [password]);

  const changeView = (nextView: AuthView) => {
    setView(nextView);
    setFeedback(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setFeedback(null);

    // Validate confirm password for sign-up and update-password views
    if (view === "sign-up" || view === "update-password") {
      if (password !== confirmPassword) {
        setFeedback({ kind: "error", text: "Your passwords don't match. Please check them and try again." });
        return;
      }
      // For update-password, also check strength
      if (view === "update-password" && passwordStrength === "very-weak") {
        setFeedback({ kind: "error", text: "Password is too weak. Please choose a stronger password." });
        return;
      }
    }

    if (!supabase) {
      setFeedback({
        kind: "info",
        text: "The page is ready for local testing. Add your Supabase project URL and publishable key to .env.local to enable account access.",
      });
      return;
    }

    setLoading(true);
    try {
      if (view === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        setFeedback({
          kind: "success",
          text: "You’re signed in. Your household workspace will be available in the next development phase.",
        });
      } else if (view === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setFeedback({
          kind: "success",
          text: data.session
            ? "Your account has been created."
            : "Check your inbox for a verification link to finish creating your account.",
        });
      } else if (view === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setFeedback({
          kind: "success",
          text: "If an account exists for that email, a password reset link is on its way.",
        });
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setView("sign-in");
        setPassword("");
        setConfirmPassword("");
        setFeedback({ kind: "success", text: "Your password has been updated. Sign in with your new password." });
      }
    } catch (error) {
      setFeedback({
        kind: "error",
        text: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentCopy = copy[view];

  return (
    <main className="auth-layout">
      <section className="auth-side" aria-labelledby="auth-title">
        <div className="auth-content">
          <a className="brand-lockup" href="/" aria-label="IntiVentory home">
            <img src={appIcon} alt="" className="brand-icon" />
            <span>IntiVentory</span>
          </a>

          <div className="auth-heading">
            <h1 id="auth-title">{currentCopy.title}</h1>
            <p>{currentCopy.description}</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="setup-note" role="status">
              <span className="setup-note-dot" aria-hidden="true" />
              Local preview · Supabase connection not configured yet
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {view !== "update-password" && <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                ref={emailRef}
                required
              />
            </div>}

            {view !== "reset" && (
              <div className="field-group">
                <div className="field-label-row">
                  <label htmlFor="password">Password</label>
                  {view === "sign-in" && (
                    <button className="text-button" type="button" onClick={() => changeView("reset")}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="password-control">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={view === "sign-in" ? "current-password" : "new-password"}
                    placeholder={view === "sign-up" ? "At least 8 characters" : "Enter your password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    ref={passwordRef}
                    minLength={view === "sign-up" || view === "update-password" ? 8 : undefined}
                    required
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                  {(view === "sign-up" || view === "update-password") && (
                    <div className="password-strength">
                      <div className="password-strength-label">
                        <span>Password strength</span>
                        <span className={`password-strength-value ${passwordStrength}`}>
                          {passwordStrength === "very-weak" && "Very weak"}
                          {passwordStrength === "weak" && "Weak"}
                          {passwordStrength === "medium" && "Medium"}
                          {passwordStrength === "strong" && "Strong"}
                          {passwordStrength === "very-strong" && "Very strong"}
                        </span>
                      </div>
                      <div className="password-strength-meter">
                        <div className={`password-strength-bar ${passwordStrength}`} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(view === "sign-up" || view === "update-password") && (
              <div className="field-group">
                <label htmlFor="confirm-password">Confirm password</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  required
                />
              </div>
            )}

            {feedback && (
              <div className={"feedback feedback-" + feedback.kind} role={feedback.kind === "error" ? "alert" : "status"}>
                <span className="feedback-mark" aria-hidden="true">
                  {feedback.kind === "success" ? <CheckIcon /> : feedback.kind === "error" ? <AlertIcon /> : <InfoIcon />}
                </span>
                <p>{feedback.text}</p>
              </div>
            )}

            <button className="primary-button" type="submit" disabled={loading}>
              <span>{loading ? currentCopy.busy : currentCopy.action}</span>
              {!loading && <ArrowIcon />}
              {loading && <span className="button-spinner" aria-hidden="true" />}
            </button>
          </form>

          <div className="auth-switch">
            {view === "sign-in" && (
              <p>New to IntiVentory? <button className="text-button strong" type="button" onClick={() => changeView("sign-up")}>Create an account</button></p>
            )}
            {view === "sign-up" && (
              <p>Already have an account? <button className="text-button strong" type="button" onClick={() => changeView("sign-in")}>Sign in</button></p>
            )}
            {view === "reset" && (
              <p>Remembered your password? <button className="text-button strong" type="button" onClick={() => changeView("sign-in")}>Back to sign in</button></p>
            )}
            {view === "update-password" && <p>Reset link verified. Choose a new password above.</p>}
          </div>

          {view !== "sign-in" && view !== "sign-up" && view !== "reset" && view !== "update-password" && (
        <p className="auth-footnote">Your household, a little more organized.</p>
      )}
        </div>
        <footer className="auth-copyright">© {new Date().getFullYear()} IntiVentory</footer>
      </section>

      {view !== "sign-in" && view !== "sign-up" && view !== "reset" && view !== "update-password" && (
        <aside className="story-side" aria-label="About IntiVentory">
        <div className="story-content">
          <div className="story-heading">
            <p className="story-kicker">A calmer way to keep track</p>
            <h2>Know what’s at home.<br />Stay on top of the little things.</h2>
            <p className="story-description">
              Keep everyday essentials and household spending in one clear place.
            </p>
          </div>

          <div className="preview-window">
            <div className="preview-topbar">
              <div className="preview-brand">
                <span className="preview-brand-mark"><HouseIcon /></span>
                <span>Household overview</span>
              </div>
              <span className="preview-live"><span /> Sample view</span>
            </div>

            <div className="preview-body">
              <p className="preview-label">YOUR HOUSEHOLD</p>
              <h3>Everyday essentials</h3>
              <p className="preview-subtitle">A simple view of the things you keep at home.</p>

              <div className="preview-list">
                <div className="preview-row">
                  <span className="category-symbol symbol-food" aria-hidden="true">F</span>
                  <span className="preview-row-copy"><strong>Food &amp; kitchen</strong><small>Pantry essentials</small></span>
                  <span className="preview-chevron" aria-hidden="true">›</span>
                </div>
                <div className="preview-row">
                  <span className="category-symbol symbol-home" aria-hidden="true">H</span>
                  <span className="preview-row-copy"><strong>Home care &amp; cleaning</strong><small>Everyday home supplies</small></span>
                  <span className="preview-chevron" aria-hidden="true">›</span>
                </div>
                <div className="preview-row">
                  <span className="category-symbol symbol-personal" aria-hidden="true">P</span>
                  <span className="preview-row-copy"><strong>Personal care</strong><small>Daily-use essentials</small></span>
                  <span className="preview-chevron" aria-hidden="true">›</span>
                </div>
              </div>

              <div className="preview-bottom">
                <span className="preview-bottom-icon"><ListIcon /></span>
                <span><strong>Keep the small things in view.</strong><small>Stock, purchases and everyday use.</small></span>
              </div>
            </div>
          </div>

          <p className="story-tagline" lang="te">మన ఇంటి సరుకులు, మన ఇంటి లెక్కలు.</p>
        </div>
      </aside>
      )}
    </main>
  );
}

function EyeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.6" /></svg>;
}
function EyeOffIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 6.2A10.8 10.8 0 0 1 12 6c6.2 0 9.5 6 9.5 6a15 15 0 0 1-3.1 3.7M6.2 6.3C3.8 8 2.5 12 2.5 12s3.3 6 9.5 6c1.2 0 2.3-.2 3.2-.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>;
}
function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" /></svg>;
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" /></svg>;
}
function AlertIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5m0 3h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z" /></svg>;
}
function InfoIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></svg>;
}
function HouseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1Z" /></svg>;
}
function ListIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></svg>;
}

export default App;
