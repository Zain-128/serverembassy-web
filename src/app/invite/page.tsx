"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Copy, Link2, Send, Trophy, Users } from "lucide-react";
import { useToast, getErrorMessage } from "@/components/Toast";
import { useAppSelector } from "@/store";
import { useSendInviteMutation, useGetMyInvitesQuery } from "@/store/authApi";
import { useGetInviteLeaderboardQuery } from "@/store/storeApi";
import { TextField } from "@/components/ui/fields";
import SectionHeader from "@/components/ui/SectionHeader";
import { EASE } from "@/lib/motion";

export default function InvitePage() {
  const router = useRouter();
  const { toast } = useToast();
  const token = useAppSelector((s) => s.auth.token);
  const [email, setEmail] = useState("");
  const [sendInvite, { isLoading: sending }] = useSendInviteMutation();
  const { data: myInvites } = useGetMyInvitesQuery(undefined, { skip: !token });
  const { data: leaderboard, isLoading: loadingBoard } = useGetInviteLeaderboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [copied, setCopied] = useState(false);

  const inviteLink =
    typeof window !== "undefined" ? `${window.location.origin}/invite` : "/invite";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("Link copied to clipboard", "success");
    } catch {
      toast("Could not copy link", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast("Please log in to invite friends", "warning");
      router.push("/login");
      return;
    }
    try {
      await sendInvite(email.trim()).unwrap();
      toast(`Invite sent to ${email.trim()}`, "success");
      setEmail("");
    } catch (err) {
      toast(getErrorMessage(err, "Could not send invite."), "error");
    }
  };

  return (
    <div className="container-se py-10">
      {/* hero */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
          <Trophy size={14} /> Referral program
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Invite friends, grow the community
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          Share your referral link or invite by email. See who brings the most friends to the table.
        </p>
      </motion.div>

      {/* send invite */}
      <motion.div
        className="mx-auto mt-8 max-w-md overflow-hidden rounded-3xl border border-line bg-white shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-brand-soft/50 to-transparent px-6 py-4">
          <Users size={18} className="text-brand" />
          <h2 className="font-display font-semibold text-navy">Send an invite</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <TextField
            label="Friend's email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@email.com"
          />
          <button
            type="submit"
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
          >
            <Send size={16} />
            {sending ? "Sending…" : "Send invite"}
          </button>
        </form>
        {token ? (
          <div className="rounded-2xl bg-page/60 px-6 py-4">
            <p className="text-xs font-medium text-muted">Share this link</p>
            <div className="mt-1.5 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-line">
                {inviteLink}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-brand ring-1 ring-line transition hover:bg-page"
              >
                <Copy size={13} />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ) : (
          <p className="px-6 pb-5 text-xs text-muted">
            <Link href="/login" className="text-brand underline">Log in</Link> to invite friends and track your referrals.
          </p>
        )}
      </motion.div>

      {token && myInvites && myInvites.inviteCount > 0 && (
        <motion.div
          className="mx-auto mt-6 max-w-md overflow-hidden rounded-3xl border border-line bg-white shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        >
          <div className="flex items-center gap-2 bg-gradient-to-r from-brand-soft/50 to-transparent px-6 py-4">
            <Link2 size={18} className="text-brand" />
            <h3 className="font-display font-semibold text-navy">Your invites</h3>
            <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">
              {myInvites.inviteCount}
            </span>
          </div>
          <ul className="divide-y divide-line px-6">
            {myInvites.invites.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between py-2.5">
                <span className="min-w-0 truncate text-muted">{inv.email}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    inv.status === "accepted"
                      ? "bg-green-50 text-green-700"
                      : inv.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {inv.status}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <div className="mt-14">
        <SectionHeader
          eyebrow="Leaderboard"
          title="Friend leaderboard"
          description="Who has invited the most friends?"
          align="center"
        />
        {loadingBoard ? (
          <div className="mx-auto mt-6 max-w-2xl space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-line/60" />
            ))}
          </div>
        ) : leaderboard && leaderboard.length ? (
          <motion.div
            className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-3xl border border-line bg-white shadow-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {leaderboard.map((entry, i) => {
              const isTop = i === 0;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 border-b border-line px-6 py-4 last:border-0 ${
                    isTop ? "bg-gradient-to-r from-brand-soft/60 to-white" : ""
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      i === 0
                        ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200"
                        : i === 1
                          ? "bg-slate-200 text-slate-700"
                          : i === 2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-page text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-navy">
                      {entry.fullName || "Server Embassy member"}
                      {isTop && (
                        <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">
                          <Trophy size={10} className="mr-1 inline" />Top inviter
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted">{entry.email}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-brand">
                    {entry.inviteCount} {entry.inviteCount === 1 ? "friend" : "friends"}
                  </span>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <p className="mt-6 text-center text-sm text-muted">
            No invites yet. Be the first to invite someone!
          </p>
        )}
      </div>
    </div>
  );
}