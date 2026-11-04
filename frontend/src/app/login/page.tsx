"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      router.replace("/admin"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Sign-in failed."); }
    finally { setBusy(false); }
  }
  return <main className="auth-shell"><form className="auth-card" onSubmit={submit}>
    <a className="brand" href="/">FlowPilot<span>.</span></a><p className="eyebrow">OWNER ACCESS</p>
    <h1>Sign in</h1><p className="muted">Use your provisioned Supabase owner account.</p>
    <label>Email<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
    <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
    {error && <p className="error" role="alert">{error}</p>}
    <button className="button" disabled={busy}>{busy?"Signing in…":"Sign in securely"}</button>
    <a className="muted back" href="/">← Back to website</a>
  </form></main>;
}
