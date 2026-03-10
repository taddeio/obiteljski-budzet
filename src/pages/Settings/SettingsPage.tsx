import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAppContext } from "../../context/AppContext";
import { Copy, Check, RefreshCw, Share2, LogOut, Users, User as UserIcon } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, family, members, signOut, regenerateInviteCode } = useAppContext();
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  const isOwner = family?.ownerId === user?.id;

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setSignOutLoading(false);
    }
  };

  const inviteUrl = family?.inviteCode
    ? `${window.location.origin}${window.location.pathname}?inviteCode=${family.inviteCode}`
    : null;

  const handleCopyCode = async () => {
    const textToCopy = inviteUrl || family?.inviteCode;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleShare = async () => {
    if (!inviteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pridruži se obitelji ${family?.name}`,
          text: `Pridruži mi se u Obiteljski Budžet aplikaciji!`,
          url: inviteUrl,
        });
      } catch {
        // User cancelled share — ignore
      }
    } else {
      handleCopyCode();
    }
  };

  const handleRegenCode = async () => {
    setRegenLoading(true);
    try {
      await regenerateInviteCode();
    } catch (error) {
      console.error("Failed to regenerate code:", error);
    } finally {
      setRegenLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Postavke</h1>
        <p className="text-gray-500 text-sm">Profil i upravljanje obitelji</p>
      </div>

      {/* Profile */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <UserIcon size={14} /> Moj profil
        </h2>
        <Card>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ backgroundColor: members.find(m => m.id === user?.id)?.color || "#6B7280" }}
            >
              {(user?.displayName || user?.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-base truncate">
                {user?.displayName || "—"}
              </p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              <p className="text-xs text-blue-600 mt-0.5">
                {isOwner ? "Vlasnik obitelji" : "Član obitelji"}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Family Members */}
      {family && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Users size={14} /> Obitelj · {family.name}
          </h2>
          <Card>
            <div className="space-y-2">
              {members.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-2">Nema članova</p>
              ) : (
                members.map((member) => {
                  const isMe = member.id === user?.id;
                  const name = member.displayName || member.email || "Nepoznat";
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                        style={{ backgroundColor: member.color }}
                      >
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {name} {isMe && <span className="text-gray-400 font-normal">(ja)</span>}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{member.email}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        member.role === "owner"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {member.role === "owner" ? "Vlasnik" : "Član"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </section>
      )}

      {/* Invite */}
      {family && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Pozovite nove članove
          </h2>
          <Card>
            {family.inviteCode ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pozivni kod</p>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
                    <code className="flex-1 text-lg font-mono font-bold text-gray-900 tracking-widest">
                      {family.inviteCode}
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Kopiraj"
                    >
                      {copiedCode
                        ? <Check size={18} className="text-green-600" />
                        : <Copy size={18} className="text-gray-500" />
                      }
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Podijelite ovaj kod — svaki član ga može unijeti pri prvom pokretanju aplikacije
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" fullWidth onClick={handleShare}>
                    <Share2 size={16} className="mr-2" />
                    Podijeli link
                  </Button>
                  {isOwner && (
                    <button
                      onClick={handleRegenCode}
                      disabled={regenLoading}
                      className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-50"
                      title="Generiraj novi kod"
                    >
                      <RefreshCw size={16} className={regenLoading ? "animate-spin" : ""} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-2 space-y-3">
                <p className="text-sm text-gray-500">Pozivni kod nije dostupan</p>
                {isOwner && (
                  <Button variant="primary" onClick={handleRegenCode} loading={regenLoading}>
                    Generiraj pozivni kod
                  </Button>
                )}
              </div>
            )}
          </Card>
        </section>
      )}

      {/* App */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Aplikacija
        </h2>
        <Card className="space-y-2">
          <Button variant="ghost" fullWidth disabled>
            📥 Uvezi podatke
          </Button>
          <Button variant="ghost" fullWidth disabled>
            📤 Izvezi podatke
          </Button>
        </Card>
      </section>

      {/* Sign out */}
      <Card className="border-red-100">
        <Button
          variant="danger"
          fullWidth
          onClick={handleSignOut}
          loading={signOutLoading}
        >
          <LogOut size={16} className="mr-2" />
          Odjava
        </Button>
      </Card>
    </div>
  );
};
