import { useEffect, useRef, useState } from 'react'
import { services } from './data/services.js'
import logo from './assets/logo1.png'
import './App.css'

// ── BUBBLE BACKGROUND ──────────────────────────────────────
const BUBBLE_COLORS = [
  'rgba(180,45,191,IDX)',
  'rgba(96,0,130,IDX)',
  'rgba(228,116,220,IDX)',
  'rgba(82,51,78,IDX)',
  'rgba(108,38,125,IDX)',
]

function Bubbles() {
  const bubbles = Array.from({ length: 38 }, (_, i) => {
    const size = Math.floor(Math.random() * 220 + 60)
    const color = BUBBLE_COLORS[i % BUBBLE_COLORS.length]
    const opacity = (Math.random() * 0.10 + 0.04).toFixed(2)
    return {
      id: i,
      size,
      left: `${Math.random() * 110 - 5}%`,
      top: `${Math.random() * 110 - 5}%`,
      color: color.replace('IDX', opacity),
    }
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {bubbles.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          borderRadius: '50%',
          width: b.size,
          height: b.size,
          left: b.left,
          top: b.top,
          background: `radial-gradient(circle at 38% 38%, ${b.color.replace(/,[\d.]+\)/, ',0.7)')}, ${b.color} 55%, transparent 80%)`,
        }} />
      ))}
    </div>
  )
}

// ── NAV ────────────────────────────────────────────────────
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.82)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <div className="nav-inner">
          <a href="#home"><img src={logo} alt="Butterfield Consulting" className="nav-logo" /></a>
          <ul className="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a href="#contact" className="nav-cta">Get in touch</a>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#services" onClick={close}>Services</a>
            <a href="#about" onClick={close}>About</a>
            <a href="#contact" onClick={close}>Contact</a>
          </div>
        )}
      </nav>
    </>
  )
}

// ── SERVICE CARD ───────────────────────────────────────────
function ServiceCard({ icon, title, desc, legal }) {
  return (
    <div className={`glass bento-card${legal ? ' legal-card' : ''}`}>
      <div className={`service-icon${legal ? ' legal-icon' : ''}`}>{icon}</div>
      <h3 className="service-title">{title}</h3>
      <p className="service-desc">{desc}</p>
    </div>
  )
}

// ── CONTACT FORM ───────────────────────────────────────────
const SUPABASE_URL = 'https://tjyjnhoihomqhvgasjlv.supabase.co/functions/v1/send-email'

function ContactForm() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', company: '', service: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#600082;">New Website Enquiry</h2>
          <p><strong>Name:</strong> ${form.first_name} ${form.last_name}</p>
          <p><strong>Email:</strong> ${form.email}</p>
          ${form.company ? `<p><strong>Company:</strong> ${form.company}</p>` : ''}
          ${form.service ? `<p><strong>Area of interest:</strong> ${form.service}</p>` : ''}
          <hr style="border:none;border-top:1px solid #eee;margin:1rem 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;">${form.message}</p>
        </div>
      `
      const res = await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'Hello@butterfieldco.co.za',
          subject: `Website enquiry from ${form.first_name} ${form.last_name}`,
          html,
          replyTo: form.email,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setForm({ first_name: '', last_name: '', email: '', company: '', service: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={submit} className="contact-form">
      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input name="first_name" required placeholder="Jane" value={form.first_name} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input name="last_name" required placeholder="Smith" value={form.last_name} onChange={handle} />
        </div>
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" required placeholder="jane@company.co.za" value={form.email} onChange={handle} />
      </div>
      <div className="form-group">
        <label>Company Name</label>
        <input name="company" placeholder="Optional" value={form.company} onChange={handle} />
      </div>
      <div className="form-group">
        <label>Area of Interest</label>
        <select name="service" value={form.service} onChange={handle}>
          <option value="">Select a service...</option>
          <option>Compliance &amp; Industrial Relations</option>
          <option>Talent Management &amp; Acquisition</option>
          <option>Performance &amp; Development</option>
          <option>Strategic Organisational Design</option>
          <option>Legal Advisory</option>
          <option>General Enquiry</option>
        </select>
      </div>
      <div className="form-group">
        <label>Message</label>
        <textarea name="message" required placeholder="Tell us a bit about what you need..." value={form.message} onChange={handle} />
      </div>

      {status === 'success' && (
        <div className="form-feedback success">Message sent — we'll be in touch shortly.</div>
      )}
      {status === 'error' && (
        <div className="form-feedback error">Something went wrong. Please email us directly at Hello@butterfieldco.co.za</div>
      )}

      <button type="submit" className="form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send message →'}
      </button>
    </form>
  )
}

// ── MAIN APP ───────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Bubbles />
      <Nav />

      {/* HERO */}
      <section id="home" className="section">
        <div className="wrapper">
          <div className="hero-label">HR &amp; Industrial Relations · Legal Advisory</div>
          <h1 className="hero-title">
            Your dedicated <em>HR partner,</em><br />
            from compliance<br />to culture.
          </h1>
          <p className="hero-sub">
            Butterfield Consulting partners with growing businesses to navigate the complexity of people management — so you can focus on what matters most.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Get in touch →</a>
            <a href="#services" className="btn-ghost">Our services</a>
          </div>
          <div className="hero-badge">
            <img src={logo} alt="Butterfield Consulting" className="hero-badge-logo" />
            <div className="hero-badge-divider" />
            <div className="hero-badge-text">HR &amp; IR Consulting<br />Randburg, Johannesburg</div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section">
        <div className="wrapper">
          <p className="section-label">What we do</p>
          <h2 className="section-title">How we help<br />your business thrive</h2>

          <div className="bento bento-2" style={{ marginBottom: '1rem' }}>
            {services.slice(0, 2).map(s => (
              <ServiceCard key={s.id} {...s} />
            ))}
          </div>
          <div className="bento bento-2" style={{ marginBottom: '1rem' }}>
            {services.slice(2, 4).map(s => (
              <ServiceCard key={s.id} {...s} />
            ))}
          </div>

          <div className="glass bento-card engagement-card" style={{ marginTop: '0' }}>
            <p className="section-label" style={{ marginBottom: '0.6rem' }}>Flexible Engagements</p>
            <h3 className="service-title">Ad-hoc or Retainer</h3>
            <p className="service-desc" style={{ marginBottom: '1.1rem' }}>
              Whether you need once-off support or an ongoing HR partner embedded in your business, we work the way you need us to.
            </p>
            <div>
              <span className="pill">Ad-hoc projects</span>
              <span className="pill">Monthly retainer</span>
              <span className="pill">Crisis support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="wrapper">
          <p className="section-label">The person behind the work</p>
          <h2 className="section-title">Meet Angie</h2>
          <div className="about-grid">
            <div className="about-card-left">
              <div className="about-initials">AE</div>
              <div className="about-name">Angie E Silva-Moultrie</div>
              <div className="about-role">Founder &amp; Principal Consultant</div>
              <div className="about-qual">
                LLB — University of Johannesburg<br />
                LLM — University of Cape Town<br />
                5+ years in HR &amp; IR consulting<br /><br />
                <span className="pill">Retail</span>
                <span className="pill">Manufacturing</span>
                <span className="pill">Software</span>
              </div>
            </div>
            <div className="glass about-card-right">
              <p className="about-bio">"People are the heartbeat of every business. When you invest in them well, everything else follows."</p>
              <p className="about-body">Angie founded Butterfield Consulting with a clear conviction: that businesses — especially growing ones — deserve an HR partner who genuinely cares about both the organisation and the people within it. With a legal background from two of South Africa's leading universities and hands-on experience across retail, manufacturing, and software industries, she brings a rare combination of legal rigour and human warmth to every client relationship.</p>
              <p className="about-body">She works primarily with small to mid-sized businesses navigating the demands of scaling — helping them build the people structures, policies, and cultures they need to grow sustainably. Whether it's a complex disciplinary matter or a company-wide organisational redesign, Angie approaches every engagement with the same commitment: practical, thoughtful, people-first solutions.</p>
              <p className="about-body">Based in Randburg, Johannesburg, Butterfield Consulting works with clients across South Africa on both a retainer and ad-hoc basis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="wrapper">
          <p className="section-label">Let's talk</p>
          <h2 className="section-title">Get in touch</h2>
          <div className="contact-grid">
            <div className="glass contact-info">
              <h3 className="contact-title">We'd love to hear from you</h3>
              <p className="contact-body">Whether you're dealing with an immediate HR challenge or planning ahead for your growing team, we're here to help.</p>
              <span className="contact-detail-label">Email</span>
              <p className="contact-detail"><a href="mailto:Hello@butterfieldco.co.za">Hello@butterfieldco.co.za</a></p>
              <span className="contact-detail-label">Location</span>
              <p className="contact-detail">Randburg, Johannesburg<br />South Africa</p>
              <span className="contact-detail-label">Availability</span>
              <p className="contact-detail">Monday – Friday, 08:00 – 17:00</p>
            </div>
            <div className="glass contact-form-card">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <img src={logo} alt="Butterfield Consulting" className="footer-logo" />
          <div className="footer-right">
            <span className="footer-nsbc">Member of the NSBC</span>
            {/* REPLACE # WITH YOUR LINKEDIN URL */}
            <a href="#" className="footer-linkedin" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
          <p className="footer-copy">© 2025 Butterfield Consulting. All rights reserved. | Randburg, Johannesburg, South Africa</p>
        </div>
      </footer>
    </>
  )
}