import "./ChooseRole.css"; 
 
/* ------------------------------------------------------------------ */ 
/* Types                                                               */ 
/* ------------------------------------------------------------------ */ 
 
export type Role = "student" | "provider" | "admin"; 
 
type ChooseRoleProps = { 
    /** Called when a role button is clicked. Optional. */ 
    onSelectRole?: (role: Role) => void; 
}; 
 
type RoleCard = { 
    id: Role; 
    badge: string; 
    title: string; 
    tag: string; 
    description: string; 
    features: string[]; 
    cta: string; 
    footnote: string; 
    image: string; 
    imageLabel: string; 
}; 
 
/* ------------------------------------------------------------------ */ 
/* Page data — edit the text here, not inside the JSX                  */ 
/* ------------------------------------------------------------------ */ 
 
const ROLES: RoleCard[] = [ 
    { 
        id: "student", 
        badge: "Most popular", 
        title: "Student", 
        tag: "Find & apply", 
        description: 
            "Discover scholarships matched to your profile, check eligibility instantly, securely upload documents, apply with confidence, and track every status in real time.", 
        features: [ 
            "AI scholarship recommendations", 
            "Smart instant eligibility checker", 
            "Zero-knowledge encrypted document vault", 
            "Real-time application progress tracking", 
        ], 
        cta: "Continue as student", 
        footnote: "Verified student network active", 
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85", 
        imageLabel: "Academic profile", 
    }, 
    { 
        id: "provider", 
        badge: "Trusted organizations", 
        title: "Scholarship Provider", 
        tag: "Publish & manage", 
        description: 
            "Publish and administer grants, coordinate review teams, verify candidate documents, and measure community impact through intuitive analytics.", 
        features: [ 
            "Multichannel scholarship publishing", 
            "Automated document & grade verification", 
            "Collaborative committee review queues", 
            "Deep social impact analytics & reporting", 
        ], 
        cta: "Continue as provider", 
        footnote: "Institutional SLA 99.8% uptime", 
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85", 
        imageLabel: "Fund & sponsor", 
    }, 
    { 
        id: "admin", 
        badge: "Secure governance", 
        title: "Administrator", 
        tag: "Monitor & secure", 
        description: 
            "Manage authorised users and organizations, audit ecosystem activity, review anomaly alerts, and guarantee full compliance with privacy frameworks.", 
        features: [ 
            "Comprehensive global user management", 
            "Provider vetting & identity verification", 
            "Immutable audit logs & exportable reports", 
            "24/7 AI system anomaly monitoring", 
        ], 
        cta: "Continue as administrator", 
        footnote: "SOC 2 Type II certified & ISO 27001", 
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=85", 
        imageLabel: "Governance", 
    }, 
]; 
 
const STATS = [ 
    { value: "10,000+", label: "Scholarships listed" }, 
    { value: "50K+", label: "Active students" }, 
    { value: "250+", label: "Verified providers" }, 
    { value: "99.4%", label: "AI match accuracy" }, 
]; 
 
const TRUST = [ 
    { 
        icon: "shield", 
        title: "Verified organizations", 
        text: "Every provider passes identity and legitimacy checks before publishing.", 
    }, 
    { 
        icon: "lock", 
        title: "Encrypted documents", 
        text: "Transcripts and IDs are encrypted end to end in your private vault.", 
    }, 
    { 
        icon: "eye", 
        title: "Privacy protected", 
        text: "Your data is never sold or shared without your explicit consent.", 
    }, 
    { 
        icon: "spark", 
        title: "AI-powered matching", 
        text: "Recommendations improve as your academic profile grows.", 
    }, 
]; 
 
/* ------------------------------------------------------------------ */ 
/* Small inline icons (no icon library needed)                         */ 
/* ------------------------------------------------------------------ */ 
 
function Icon({ name }: { name: string }) { 
    const common = { 
        width: 16, 
        height: 16, 
        viewBox: "0 0 24 24", 
        fill: "none", 
        stroke: "currentColor", 
        strokeWidth: 2, 
        strokeLinecap: "round" as const, 
        strokeLinejoin: "round" as const, 
    }; 
 
    if (name === "check") 
        return ( 
            <svg {...common}> 
                <circle cx="12" cy="12" r="9" /> 
                <path d="M8.5 12.2l2.4 2.4 4.6-4.9" /> 
            </svg> 
        ); 
 
    if (name === "shield") 
        return ( 
            <svg {...common}> 
                <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" /> 
            </svg> 
        ); 
 
    if (name === "lock") 
        return ( 
            <svg {...common}> 
                <rect x="4" y="10" width="16" height="10" rx="2" /> 
                <path d="M8 10V7a4 4 0 018 0v3" /> 
            </svg> 
        ); 
 
    if (name === "eye") 
        return ( 
            <svg {...common}> 
                <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" /> 
                <circle cx="12" cy="12" r="2.6" /> 
            </svg> 
        ); 
 
    if (name === "spark") 
        return ( 
            <svg {...common}> 
                <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /> 
            </svg> 
        ); 
 
    if (name === "arrow") 
        return ( 
            <svg {...common}> 
                <path d="M5 12h13" /> 
                <path d="M13 6l6 6-6 6" /> 
            </svg> 
        ); 
 
    return null; 
} 
 
/* ------------------------------------------------------------------ */ 
/* Page                                                                */ 
/* ------------------------------------------------------------------ */ 
 
export default function ChooseRole({ onSelectRole }: ChooseRoleProps) { 
    function handleSelect(role: Role) { 
        if (onSelectRole) { 
            onSelectRole(role); 
        } else { 
            // Fallback so the page is usable before routing is wired up. 
            console.log("Selected role:", role); 
        } 
    } 
 
    return ( 
        <div className="cr-page"> 
            {/* ---------- Top navigation ---------- */} 
            <header className="cr-nav"> 
                <div className="cr-nav-inner"> 
                    <a className="cr-logo" href="#top"> 
                        <span className="cr-logo-mark">S</span> 
                        <span className="cr-logo-text"> 
                            ScholarBridge <span className="cr-logo-ai">AI</span> 
                        </span> 
                    </a> 
 
                    <nav className="cr-nav-links"> 
                        <a href="#top">Home</a> 
                        <a href="#roles">Features</a> 
                        <a href="#trust">How it works</a> 
                        <a href="#stats">Impact</a> 
                    </nav> 
 
                    <div className="cr-nav-actions"> 
                        <a className="cr-link-btn" href="#signin"> 
                            Sign in 
                        </a> 
                        <a className="cr-solid-btn cr-solid-btn--sm" href="#roles"> 
                            Get started 
                        </a> 
                    </div> 
                </div> 
            </header> 
 
            <main className="cr-main" id="top"> 
                {/* ---------- Heading ---------- */} 
                <section className="cr-intro"> 
                    <span className="cr-eyebrow">Welcome to ScholarBridge AI</span> 
                    <h1 className="cr-title"> 
                        Choose your <span className="cr-title-accent">role</span> 
                    </h1> 
                    <p className="cr-subtitle"> 
                        Choose how you'd like to continue and unlock a personalized 
                        scholarship experience tailored by institutional AI. 
                    </p> 
                    <p className="cr-note"> 
                        <Icon name="check" /> 
                        Every role comes with a dedicated AI-powered workspace and 
                        bank-grade privacy controls. 
                    </p> 
                </section> 
 
                {/* ---------- Hero banner ---------- */} 
                <section className="cr-hero" aria-label="Platform overview"> 
                    <div className="cr-hero-glow" /> 
                    <span className="cr-hero-tag">ScholarBridge neural bridge</span> 
                    <h2 className="cr-hero-title"> 
                        Connecting global ambition with verified institutional capital 
                    </h2> 
                    <div className="cr-hero-pills"> 
                        <span>98.4% match rate</span> 
                        <span>Zero friction</span> 
                        <span>Bank-grade 256-bit encryption</span> 
                    </div> 
                </section> 
 
                {/* ---------- Role cards ---------- */} 
                <section className="cr-cards" id="roles"> 
                    {ROLES.map((role) => ( 
                        <article className="cr-card" key={role.id}> 
                            <span className="cr-card-badge">{role.badge}</span> 
 
                            <div className="cr-card-media"> 
                                <img 
                                    src={role.image} 
                                    alt={role.imageLabel} 
                                    className="cr-card-image" 
                                /> 
                                <span className="cr-card-media-label">{role.imageLabel}</span> 
                            </div> 
 
                            <div className="cr-card-head"> 
                                <h3>{role.title}</h3> 
                                <span className="cr-card-tag">{role.tag}</span> 
                            </div> 
 
                            <p className="cr-card-text">{role.description}</p> 
 
                            <ul className="cr-card-list"> 
                                {role.features.map((feature) => ( 
                                    <li key={feature}> 
                                        <Icon name="check" /> 
                                        <span>{feature}</span> 
                                    </li> 
                                ))} 
                            </ul> 
 
                            <button 
                                type="button" 
                                className="cr-solid-btn cr-card-btn" 
                                onClick={() => handleSelect(role.id)} 
                            > 
                                {role.cta} 
                                <Icon name="arrow" /> 
                            </button> 
 
                            <p className="cr-card-foot"> 
                                <Icon name="shield" /> 
                                {role.footnote} 
                            </p> 
                        </article> 
                    ))} 
                </section> 
 
                {/* ---------- Helper row ---------- */} 
                <section className="cr-helper"> 
                    <a className="cr-helper-pill" href="#compare"> 
                        Need help choosing? Compare roles matrix 
                    </a> 
                    <p className="cr-helper-text"> 
                        Already have an account? <a href="#signin">Sign in</a> 
                    </p> 
                </section> 
 
                {/* ---------- Stats ---------- */} 
                <section className="cr-stats" id="stats"> 
                    {STATS.map((stat) => ( 
                        <div className="cr-stat" key={stat.label}> 
                            <p className="cr-stat-value">{stat.value}</p> 
                            <p className="cr-stat-label">{stat.label}</p> 
                        </div> 
                    ))} 
                </section> 
 
                {/* ---------- Trust section ---------- */} 
                <section className="cr-trust" id="trust"> 
                    <span className="cr-eyebrow">Security by default</span> 
                    <h2 className="cr-trust-title"> 
                        Built for a secure global scholarship ecosystem 
                    </h2> 
                    <p className="cr-trust-sub"> 
                        Every interaction across ScholarBridge AI is protected by 
                        international compliance standards and strict data autonomy rules. 
                    </p> 
 
                    <div className="cr-trust-grid"> 
                        {TRUST.map((item) => ( 
                            <div className="cr-trust-card" key={item.title}> 
                                <span className="cr-trust-icon"> 
                                    <Icon name={item.icon} /> 
                                </span> 
                                <h4>{item.title}</h4> 
                                <p>{item.text}</p> 
                            </div> 
                        ))} 
                    </div> 
                </section> 
            </main> 
 
            <footer className="cr-footer"> 
                <p>© {new Date().getFullYear()} ScholarBridge AI — College project build.</p> 
            </footer> 
        </div> 
    ); 
}