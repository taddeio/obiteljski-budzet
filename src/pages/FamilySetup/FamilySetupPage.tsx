import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { useAppContext } from "../../context/AppContext";

type SetupMode = "create" | "join";

export const FamilySetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, createFamily, joinFamily } = useAppContext();

  const [mode, setMode] = useState<SetupMode>("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState(
    searchParams.get("inviteCode") || ""
  );

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!familyName.trim()) {
      setError("Molimo unesite naziv obitelji");
      return;
    }

    if (!user) {
      setError("Korisnik nije pronađen");
      return;
    }

    setLoading(true);

    try {
      await createFamily(familyName, user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kreiranje nije uspjelo");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inviteCode.trim()) {
      setError("Molimo unesite kôd za pozivnicu");
      return;
    }

    if (!user) {
      setError("Korisnik nije pronađen");
      return;
    }

    setLoading(true);

    try {
      await joinFamily(inviteCode.toUpperCase(), user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pridruživanje nije uspjelo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Postavite vašu obitelj
          </h1>
          <p className="text-gray-600">
            Kreirajte novu obitelj ili se pridružite postojećoj
          </p>
        </div>

        <div className="space-y-4">
          {/* Create Family Card */}
          <Card
            className={`cursor-pointer transition-all border-2 ${
              mode === "create"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => {
              setMode("create");
              setError("");
            }}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">👨‍👩‍👧‍👦</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Kreiraj obitelj</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Započnite s novom obitelji i pozovite članove
                </p>
              </div>
            </div>
          </Card>

          {/* Join Family Card */}
          <Card
            className={`cursor-pointer transition-all border-2 ${
              mode === "join"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => {
              setMode("join");
              setError("");
            }}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">🤝</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Pridruži se</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Pristupite postojećoj obitelji s kôdom za pozivnicu
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Section */}
        <Card className="mt-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {mode === "create" ? (
            <form onSubmit={handleCreateFamily} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Naziv obitelji
                </label>
                <Input
                  type="text"
                  placeholder="npr. Obitelj Horvat"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                fullWidth
                loading={loading}
                variant="primary"
              >
                Kreiraj obitelj
              </Button>
            </form>
          ) : (
            <form onSubmit={handleJoinFamily} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Kôd za pozivnicu
                </label>
                <Input
                  type="text"
                  placeholder="npr. ABC123"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Koristite kôd koji ste primili od člana obitelji
                </p>
              </div>

              <Button
                type="submit"
                fullWidth
                loading={loading}
                variant="primary"
              >
                Pridruži se obitelji
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
