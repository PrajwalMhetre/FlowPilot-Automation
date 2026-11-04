"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

type Lead = { id:string; created_at:string; full_name:string; email:string; company:string; website:string|null; role:string|null; monthly_enquiries:string|null; budget:string|null; priority:string|null; challenge:string; lead_score:number; lead_tier:string; status:string; internal_notes:string|null };
const statuses=["New","Contacted","Qualified","Won","Lost"];
export default function AdminPage() {
  const router=useRouter(); const [leads,setLeads]=useState<Lead[]>([]);
  const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const [email,setEmail]=useState("");
  const load=useCallback(async()=>{
    setLoading(true); setError("");
    try {
      const supabase=getSupabase(); const {data:{session},error:sessionError}=await supabase.auth.getSession();
      if(sessionError || !session){router.replace("/login");return;}
      setEmail(session.user.email??"");
      const {data,error:fnError}=await supabase.functions.invoke("flowpilot-admin",{method:"GET"});
      if(fnError) throw fnError;
      if(!data?.ok) throw new Error(data?.error??"Unable to load leads.");
      setLeads(data.leads??[]);
    } catch(e){setError(e instanceof Error?e.message:"CRM request failed.");}
    finally{setLoading(false);}
  },[router]);
  useEffect(()=>{void load();},[load]);
  async function update(lead:Lead, patch:Record<string,string>){
    setError("");
    try{
      const {data,error:fnError}=await getSupabase().functions.invoke("flowpilot-admin",{method:"PATCH",body:{id:lead.id,...patch}});
      if(fnError) throw fnError; if(!data?.ok) throw new Error(data?.error??"Update failed.");
      await load();
    }catch(e){setError(e instanceof Error?e.message:"Update failed.");}
  }
  async function logout(){await getSupabase().auth.signOut();router.replace("/login");}
  return <main className="dashboard">
    <header className="dash-head"><a className="brand" href="/">FlowPilot<span>.</span></a><div><span className="muted">{email}</span> <button className="quiet" onClick={logout}>Sign out</button></div></header>
    <section className="dash-title"><p className="eyebrow">OWNER CRM</p><h1>Lead pipeline</h1><p className="muted">Private owner workspace · {leads.length} leads loaded</p></section>
    {error&&<p className="error banner" role="alert">{error}</p>}
    {loading?<p className="muted">Loading secured CRM…</p>:leads.length===0?<p className="empty">No leads have been submitted yet.</p>:<section className="lead-list">{leads.map(lead=><article className="lead-card" key={lead.id}>
      <div className="lead-top"><div><p className="eyebrow">{lead.lead_tier} · Score {lead.lead_score}</p><h2>{lead.company}</h2><p className="muted">{lead.full_name} · <a href={"mailto:"+lead.email}>{lead.email}</a></p></div>
      <select aria-label={"Status for "+lead.company} value={lead.status} onChange={e=>void update(lead,{status:e.target.value})}>{statuses.map(s=><option key={s}>{s}</option>)}</select></div>
      <p>{lead.challenge}</p><p className="muted">{[lead.role,lead.monthly_enquiries,lead.budget,lead.priority].filter(Boolean).join(" · ")}</p>
      {lead.website&&<a href={lead.website} target="_blank" rel="noreferrer">{lead.website}</a>}
      <label>Internal notes<textarea maxLength={3000} defaultValue={lead.internal_notes??""} onBlur={e=>{if(e.target.value!==(lead.internal_notes??""))void update(lead,{internal_notes:e.target.value});}}/></label>
      <small className="muted">Received {new Date(lead.created_at).toLocaleString()}</small>
    </article>)}</section>}
  </main>;
}
