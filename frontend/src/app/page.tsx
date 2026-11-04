const capabilities = [
  ["Capture", "Collect enquiries through validated, structured intake."],
  ["Qualify", "Apply consistent qualification rules and prioritisation."],
  ["Route", "Send work to the right owner with an auditable status."],
  ["Measure", "Track operational outcomes without losing context."]
];
export default function Home() {
  return <main className="shell">
    <nav><a className="brand" href="/">FlowPilot<span>.</span></a><a href="#workflow">Platform</a></nav>
    <section className="hero">
      <p className="eyebrow">AUTOMATION OPERATIONS PLATFORM</p>
      <h1>Move every enquiry<br/><em>forward.</em></h1>
      <p className="intro">A clear, controlled workflow for capturing, qualifying and routing business enquiries.</p>
      <a className="button" href="#workflow">Explore the workflow <span>→</span></a>
    </section>
    <section id="workflow" className="grid">{capabilities.map(([title, body], i) =>
      <article key={title}><small>0{i+1}</small><h2>{title}</h2><p>{body}</p></article>)}</section>
    <footer>© {new Date().getFullYear()} FlowPilot Automation · Built for reliable operations.</footer>
  </main>;
}