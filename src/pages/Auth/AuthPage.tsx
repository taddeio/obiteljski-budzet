import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { useAppContext } from "../../context/AppContext";

type AuthMode = "signin" | "signup";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
  } = useAppContext();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prijava nije uspjela");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!displayName.trim()) {
      setError("Molimo unesite vaše ime");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, displayName);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registracija nije uspjela");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      // Navigation will happen automatically after redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google prijava nije uspjela");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await resetPassword(resetEmail);
      setSuccessMessage("Provjera e-pošte za link za resetiranje lozinke");
      setResetEmail("");
      setTimeout(() => setShowResetForm(false), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Resetiranje nije uspjelo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Obiteljski Budžet
          </h1>
          <p className="text-gray-600">Upravljajte obitelj financijama zajedno</p>
        </div>

        <Card>
          {!showResetForm ? (
            <>
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => {
                    setMode("signin");
                    setError("");
                  }}
                  className={`flex-1 py-3 font-medium border-b-2 transition-colors ${
                    mode === "signin"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Prijava
                </button>
                <button
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className={`flex-1 py-3 font-medium border-b-2 transition-colors ${
                    mode === "signup"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Registracija
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
                className="space-y-4 mb-6"
              >
                {mode === "signup" && (
                  <Input
                    label="Vaše ime"
                    type="text"
                    placeholder="Unesite vaše ime"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                )}

                <Input
                  label="E-pošta"
                  type="email"
                  placeholder="vasa@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Lozinka"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  variant="primary"
                >
                  {mode === "signin" ? "Prijavite se" : "Registrujte se"}
                </Button>
              </form>

              {/* Google Sign In */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">Ili</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                fullWidth
                variant="ghost"
                loading={loading}
              >
                Prijavite se s Google-om
              </Button>

              {/* Password Reset Link */}
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Zaboravili ste lozinku?
                </button>
              )}
            </>
          ) : (
            <>
              {/* Reset Password Form */}
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resetirajte lozinku
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4 mb-6">
                <Input
                  label="E-pošta"
                  type="email"
                  placeholder="vasa@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  variant="primary"
                >
                  Pošalji link za resetiranje
                </Button>
              </form>

              <button
                type="button"
                onClick={() => setShowResetForm(false)}
                className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Natrag na prijavu
              </button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
