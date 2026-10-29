// Copy sources:
//  - Master development prompt (headlines, CTAs, hero copy)
//  - Dyafa Development marketing reference folder (approved descriptions, message house)
//  - 2026 brand identity PDF
// Anything not yet approved is marked as pending / placeholder in the UI itself.

export const en = {
  meta: {
    title: "Dyafa Real Estate Development & Investment",
    description:
      "Creating exceptional real-estate developments and investment opportunities through architectural excellence, strategic vision, and sustainable value.",
    ogAlt: "Dyafa Real Estate Development & Investment — Building Real Value.",
  },
  brand: {
    name: "Dyafa",
    full: "Dyafa Real Estate Development & Investment",
    legal: "Dyafa Real Estate Development & Investment",
  },
  a11y: {
    skip: "Skip to content",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    switchLanguage: "Switch to Arabic",
    home: "Dyafa — home",
    prev: "Previous",
    next: "Next",
  },
  nav: {
    home: "Home",
    about: "About",
    expertise: "Expertise",
    developments: "Developments",
    investment: "Investment",
    approach: "Our Approach",
    contact: "Contact",
    language: "العربية",
    cta: "Start a Conversation",
  },
  hero: {
    wordmark: "DYAFA",
    eyebrow: "Real Estate Development & Investment",
    title: "Building Real Value.",
    body: "Creating exceptional real-estate developments and investment opportunities through architectural excellence, strategic vision, and sustainable value.",
    primary: "Explore Our Developments",
    secondary: "Discover Our Vision",
    scroll: "Scroll",
    statements: ["Architecture.", "Investment.", "Lasting Value."],
    geometry:
      "One geometric unit, drawn from the letter ض, repeated into a single integrated whole.",
    revealLabel: "Brand concept visual",
    revealTitle: "From opportunity to operating asset.",
  },
  film: {
    title: "The First Material.",
    label: "The First Material — Dyafa brand film. Sand lifts off a dune and becomes a stone wall; a court mirrored in water leads to a timber door that opens onto a welcome of coffee, and the camera pulls back to reveal the finished house at dusk. On-screen words: hospitality was the first material; everything after that was architecture.",
  },
  about: {
    eyebrow: "About Dyafa",
    title: "Developing Spaces. Creating Lasting Value.",
    titleAlt: "نطوّر المساحات، ونصنع قيمة مستدامة.",
    lede: "Dyafa Real Estate Development & Investment is the development and investment arm of the Dyafa ecosystem.",
    body: [
      "The company creates hospitality and hospitality-linked real estate assets that are commercially relevant, operationally viable, and scalable.",
      "Its work connects feasibility, site analysis, modular development, investment structuring, development management, and operating readiness into one aligned path — from opportunity to operating asset.",
    ],
    imageAlt: "Sculptural architectural planes in soft daylight",
  },
  expertise: {
    eyebrow: "Our Expertise",
    title: "Our Expertise",
    note: "Capability areas — subject to confirmation",
    items: [
      {
        id: "development",
        title: "Real Estate Development",
        summary:
          "Turning sites into developments that are commercially relevant and ready to operate — from concept logic and design direction to disciplined delivery.",
        points: ["Site analysis & concept logic", "Design direction shaped by operation", "Development management"],
        image: "/images/monolith-ring.jpg",
        imageAlt: "Monumental stone walls framing the Dyafa symbol over desert hills",
      },
      {
        id: "investment",
        title: "Real Estate Investment",
        summary:
          "Structuring opportunities with discipline — balancing development cost, market need, operating viability and long-term value.",
        points: ["Investment structuring", "Opportunity evaluation", "Landowner & investor alignment"],
        image: "/images/glass-symbol.jpg",
        imageAlt: "The Dyafa symbol etched into a glass monolith",
      },
      {
        id: "strategy",
        title: "Development Strategy & Planning",
        summary:
          "Connecting feasibility, design, investment, delivery and operation into one development path.",
        points: ["Feasibility studies", "Product definition", "Phasing & decision gates"],
        image: "/images/angled-planes.jpg",
        imageAlt: "Angled architectural planes against a pale sky",
      },
      {
        id: "value",
        title: "Asset Value Creation",
        summary:
          "Developing assets with the operator's reality in mind from day one, so that value is built to last beyond completion.",
        points: ["Operating readiness", "Repositioning potential", "Ecosystem continuity"],
        image: "/images/facade-fins.jpg",
        imageAlt: "Sculpted facade fins in monochrome light",
      },
    ],
  },
  developments: {
    eyebrow: "Selected Developments",
    title: "Developments That Define Value.",
    intro:
      "An editorial portfolio of Dyafa developments. Projects appear here only once their names, imagery and details are approved for publication.",
    pending: "Awaiting approved content",
    conceptLabel: "Brand concept visual — not a project image",
    fields: { location: "Location", category: "Category", role: "Dyafa's role", status: "Status" },
    slots: [
      { image: "/images/monolith-ring.jpg" },
      { image: "/images/facade-fins.jpg" },
      { image: "/images/street-poster.jpg" },
    ],
    placeholder: {
      name: "[Approved project name]",
      location: "[Verified location]",
      category: "[Development category]",
      role: "[Dyafa's role]",
      status: "[Verified status]",
      overview: "[Approved project overview and development vision]",
    },
  },
  approach: {
    eyebrow: "Our Approach",
    title: "From vision to lasting value.",
    note: "Proposed brand narrative — pending approval",
    stages: [
      { title: "Envision", body: "Identify potential and define the development vision." },
      { title: "Design", body: "Translate opportunities into thoughtful architectural solutions." },
      { title: "Develop", body: "Bring the vision to life through disciplined development execution." },
      { title: "Create Value", body: "Deliver enduring real-estate and investment value." },
    ],
  },
  investment: {
    eyebrow: "Investment Perspective",
    title: "Beyond Buildings. Toward Long-Term Value.",
    lede: "A strong asset balances development cost, market need, operating viability, and long-term value.",
    themes: [
      {
        title: "Strategic investment thinking",
        body: "Every opportunity is read through market need, development cost and operating viability before it becomes a project.",
      },
      {
        title: "Real-estate opportunity evaluation",
        body: "Disciplined site and feasibility review that gives landowners and investors a clearer view of what a site can become.",
      },
      {
        title: "Sustainable development",
        body: "Assets conceived to remain relevant, efficient and operable over the long term.",
      },
      {
        title: "Asset enhancement",
        body: "Repositioning thinking for existing assets whose value can be strengthened.",
      },
      {
        title: "Long-term value creation",
        body: "Development measured by how an asset performs after completion — not by completion alone.",
      },
    ],
    disclaimer:
      "This website presents no financial figures, return projections or investment guarantees. Opportunities are discussed individually.",
  },
  why: {
    eyebrow: "Why Dyafa",
    title: "Why Dyafa",
    items: [
      { title: "Saudi market understanding", body: "Development thinking shaped by local context, culture and demand." },
      { title: "Architectural vision", body: "Design treated as a source of long-term value, not decoration." },
      { title: "Development expertise", body: "Feasibility, design, delivery and operation handled as one path." },
      { title: "Investment discipline", body: "Measured, transparent thinking — never speculative promises." },
      { title: "Integrated thinking", body: "Backed by an ecosystem spanning operation, services and property management." },
      { title: "Long-term value creation", body: "Assets developed to perform well beyond handover." },
    ],
  },
  ecosystem: {
    eyebrow: "The Dyafa Ecosystem",
    title: "One system. Every stage of the asset.",
    note: "Group structure — subject to confirmation",
    pillars: ["Real Estate Development", "Investment", "Hospitality", "Operational Excellence"],
    companies: [
      { name: "Dyafa Holding", role: "Governance and strategic direction" },
      { name: "Dyafa Hotel Operations", role: "Operating insight and operator alignment" },
      { name: "Dyafa Services", role: "Pre-opening support and technical readiness" },
      { name: "Aqar Dyafa", role: "Property and community management" },
      { name: "Dyafa One", role: "Guest, resident and CRM data layer" },
    ],
    self: "Development & Investment",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's Build Lasting Value.",
    titleAlt: "معاً، نصنع قيمة تدوم.",
    cta: "Start a Conversation",
    lede: "Tell us about your site, your investment interest or your partnership idea. Our team will respond personally.",
    detailsPending: "[Approved contact details pending]",
    form: {
      name: "Full name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      inquiry: "Inquiry type",
      inquiryPlaceholder: "Select an inquiry type",
      message: "Message",
      submit: "Send enquiry",
      sending: "Sending…",
      optional: "Optional",
      consent: "By submitting, you agree that Dyafa may contact you regarding this enquiry.",
      success: "Thank you. Your enquiry has been received and our team will be in touch.",
      error: "Your enquiry could not be sent. Please review the form and try again.",
      rateLimited: "Too many attempts. Please wait a few minutes and try again.",
      inquiries: {
        development: "Development partnership",
        investment: "Investment opportunity",
        land: "Land or site review",
        media: "Media",
        careers: "Careers",
        other: "Other",
      },
      errors: {
        name: "Please enter your full name.",
        email: "Please enter a valid email address.",
        phone: "Please enter a valid phone number.",
        inquiry: "Please choose an inquiry type.",
        message: "Please write a message of at least 10 characters.",
      },
    },
    imageAlt: "Stone walls framing the Dyafa symbol at golden hour",
  },
  footer: {
    rights: "All rights reserved.",
    part: "Part of the Dyafa ecosystem.",
    top: "Back to top",
  },
  notFound: {
    title: "This page does not exist.",
    back: "Return home",
  },
  webgl: {
    fallback: "Interactive architecture is unavailable on this device.",
  },
};

export type Dictionary = typeof en;
