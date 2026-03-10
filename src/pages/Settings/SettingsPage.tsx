import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAppContext } from "../../context/AppContext";
import { Copy, Check } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, family, members, signOut } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteCode = async () => {
    if (!family?.inviteCode) return;

    try {
      const inviteUrl = `${window.location.origin}/?inviteCode=${family.inviteCode}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Postavke</h1>
        <p className="text-gray-600">Upravljajte vašim profilom i obitelji</p>
      </div>

      {/* Profile Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Profil</h2>
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ime
              </label>
              <p className="text-base text-gray-900">{user?.displayName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                E-pošta
              </label>
              <p className="text-base text-gray-900">{user?.email}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Family Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Obitelj</h2>
        <Card>
          <div className="space-y-4">
            {/* Family Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Naziv obitelji
              </label>
              <p className="text-base font-semibold text-gray-900">
                {family?.name}
              </p>
            </div>

            {/* Members */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Članovi ({members.length})
              </label>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {member.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.role === "owner" ? "Vlasnik" : "Član"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Section */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-600 mb-3">
                Pozovite nove članove
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                  <code className="text-sm font-mono font-semibold text-gray-900">
                    {family?.inviteCode}
                  </code>
                  <button
                    onClick={handleCopyInviteCode}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Kopiraj kod"
                  >
                    {copiedCode ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Podijelite ovaj kod s članovima obitelji da se pridruže
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* App Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Aplikacija</h2>
        <Card>
          <div className="space-y-3">
            <Button variant="ghost" fullWidth disabled>
              📥 Uvezi podatke
            </Button>
            <Button variant="ghost" fullWidth disabled>
              📤 Izvezi podatke
            </Button>
          </div>
        </Card>
      </div>

      {/* Sign Out Section */}
      <Card className="bg-red-50 border-red-200">
        <Button
          variant="danger"
          fullWidth
          onClick={handleSignOut}
          loading={loading}
        >
          Odjavite se
        </Button>
      </Card>
    </div>
  );
};
