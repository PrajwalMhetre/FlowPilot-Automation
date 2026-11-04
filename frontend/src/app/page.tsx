import Link from "next/link";
"use client";
import { useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";
const fields = [
 ["role","Your role",["Founder / Managing Director","Operations","Owner","Marketing","Other"]],
 ["volume","Monthly enquiries",["1–10","11–30","31–75","76–150","150+"]],
 ["budget","Monthly automation budget",["Under €250","€250–€500","€500–€1,000","€1,000+"]],
 ["priority","Main priority",["Lead response","Lead qualification","CRM routing","Follow-up tracking","Other"]]
] as const;
export default function Home() {
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setError("");setMessage("");
  const form=new FormData(e.currentTarget);
  const payload={name:String(form.get("name")??""),email:String(form.get("email")??""),company:String(form.get("company")??""),website:String(form.get("website")??""),role:String(form.get("role")??""),volume:String(form.get("volume")??""),budget:String(form.get("budget")??""),priority:String(form.get("priority")??""),challenge:String(form.get("challenge")??""),consent:form.get("consent")==="on",website_confirm:String(form.get("website_confirm")??"")};
  try{const {data,error}=await getSupabase().functions.invoke("flowpilot-lead-intake",{body:payload});if(error)throw error;if(!data?.ok)throw new Error(data?.error??"Submission failed.");setMessage(data.message??"Your enquiry has been received.");e.currentTarget.reset();}
  catch(err){setError(err instanceof Error?err.message:"Unable to submit your enquiry.");}
  finally{setBusy(false);}
 }
 return <main className="shell">
  <nav><Link className="brand" href="/">FlowPilot<span>.</span></a><a href="#workflow">Platform</a><a href="/login">Owner login ↗</a></nav>
  <section className="hero"><p className="eyebrow">AUTOMATION OPERATIONS PLATFORM</p><h1>Move every enquiry<br/><em>forward.</em></h1><p className="intro">A clear, controlled workflow for capturing, qualifying and routing business enquiries.</p><a className="button" href="#enquiry">Discuss your workflow <span>→</span></a></section>
  <section id="workflow" className="grid">{[["Capture","Collect enquiries through validated, structured intake."],["Qualify","Apply consistent qualification rules and prioritisation."],["Route","Send work to the right owner with an auditable status."],["Measure","Track operational outcomes without losing context."]].map(([title,body],i)=><article key={title}><small>0{i+1}</small><h2>{title}</h2><p>{body}</p></article>)}</section>
  <section id="enquiry" className="form-section"><div><p className="eyebrow">START A CONVERSATION</p><h2>Where does your enquiry process slow down?</h2><p className="muted">Share the basics. We will review the workflow before proposing automation.</p></div>
  <form className="intake-form" onSubmit={submit}>
   <div className="form-row"><label>Name<input name="name" required minLength={2} maxLength={100}/></label><label>Work email<input name="email" type="email" required maxLength={254}/></label></div>
   <div className="form-row"><label>Company<input name="company" required minLength={2} maxLength={160}/></label><label>Website (optional)<input name="website" type="url" placeholder="https://example.com"/></label></div>
   {fields.map(([name,label,options])=><label key={name}>{label}<select name={name}><option value="">Select…</option>{options.map(option=><option key={option}>{option}</option>)}</select></label>)}
   <label>What would you like to improve?<textarea name="challenge" required minLength={10} maxLength={2000} rows={5}/></label>
   <label className="consent"><input type="checkbox" name="consent" required/> I agree to be contacted about this enquiry and have read the <a href="https://flowpilot-europe-automation.vercel.app/privacy.html" target="_blank" rel="noreferrer">privacy notice</a>.</label>
   <input name="website_confirm" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
   {error&&<p className="error" role="alert">{error}</p>}{message&&<p className="success" role="status">{message}</p>}
   <button className="button" disabled={busy}>{busy?"Submitting…":"Send enquiry →"}</button>
  </form></section>
  <footer>© {new Date().getFullYear()} FlowPilot Automation · Built for reliable operations.</footer>
 </main>;
}
