import React, { useEffect, useRef, useState } from "react";
import AcademicsSection from "./Academics.jsx";
import {
  contactLinks,
  resumeRequestUrl,
  safeSphere,
  skillGroups,
  strengths,
} from "./data/portfolio.js";

const navigation = [
  ["Home", "/#home"],
  ["Projects", "/projects"],
  ["Academics", "/academics"],
  ["Experience", "/#experience"],
  ["Skills", "/#skills"],
  ["About", "/#about"],
  ["Contact", "/#contact"],
];

const portfolioCommands = [
  ...navigation,
  ["Strengths", "/#strengths"],
  ["Resume on request", resumeRequestUrl],
];

function ArrowIcon({ diagonal = false }) {
  return (
    <svg
      aria-hidden="true"
      className="arrow-icon"
      viewBox="0 0 20 20"
      fill="none"
    >
      {diagonal ? (
        <path d="M5 15 15 5M6 5h9v9" />
      ) : (
        <path d="M3.5 10h12m-5-5 5 5-5 5" />
      )}
    </svg>
  );
}

function Brand({ footer = false }) {
  return (
    <a
      className={`brand${footer ? " brand-footer" : ""}`}
      href="/#home"
      aria-label="Vedant Chauhan, back to home"
    >
      <span className="brand-mark" aria-hidden="true">
        <img src="/brand-emblem.png" alt="" />
      </span>
      <span className="brand-name">VEDANT<span>.DEV</span></span>
    </a>
  );
}

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`section-heading${centered ? " centered" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function CommandPalette({ open, onClose, currentPage }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const resultRefs = useRef([]);
  const commands = portfolioCommands.filter(([label]) =>
    label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open && document.activeElement !== inputRef.current) {
      resultRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex, open]);

  if (!open) return null;

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      onClose();
    } else if (event.key === "ArrowDown" && commands.length) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % commands.length);
    } else if (event.key === "ArrowUp" && commands.length) {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + commands.length) % commands.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      resultRefs.current[activeIndex]?.click();
    } else if (event.key === "Tab") {
      const focusable = [
        ...event.currentTarget.querySelectorAll(
          'input:not([disabled]), button:not([disabled]), a[href][tabindex="0"]',
        ),
      ];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  return (
    <div
      className="command-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="command-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-title"
        onKeyDown={handleKeyDown}
      >
        <div className="command-search">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
            <circle cx="8.8" cy="8.8" r="5.6" />
            <path d="m13 13 4 4" />
          </svg>
          <input
            ref={inputRef}
            aria-label="Search pages and sections"
            placeholder="Where would you like to go?"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
          />
          <button className="command-close" type="button" onClick={onClose}>
            Esc
          </button>
        </div>
        <div
          className="command-results"
          role="listbox"
          aria-label="Pages and sections"
        >
          <h2 id="command-title">Navigate to</h2>
          {commands.length ? (
            commands.map(([label, href], index) => (
              <a
                aria-current={currentPage === label ? "page" : undefined}
                aria-selected={index === activeIndex}
                className={`command-result${index === activeIndex ? " is-active" : ""}`}
                href={href}
                key={href}
                onClick={onClose}
                onMouseEnter={() => setActiveIndex(index)}
                ref={(node) => {
                  resultRefs.current[index] = node;
                }}
                role="option"
                tabIndex={index === activeIndex ? 0 : -1}
              >
                <span className="command-result-icon" aria-hidden="true">
                  {label === "Academics" ? "∿" : "↗"}
                </span>
                <span>{label}</span>
                <ArrowIcon diagonal />
              </a>
            ))
          ) : (
            <p className="command-empty">No matching pages or sections.</p>
          )}
        </div>
        <div className="command-hint">
          <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
          <span><kbd>Enter</kbd> to open</span>
        </div>
      </section>
    </div>
  );
}

function Header({ page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(
    window.location.hash || "#home",
  );
  const commandTriggerRef = useRef(null);
  const currentPage =
    page === "home"
      ? navigation.find(([, href]) => href === `/${activeHash}`)?.[0] ?? "Home"
      : page === "academics"
        ? "Academics"
        : "Projects";

  useEffect(() => {
    function openPalette(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }

    const sections =
      page === "home"
        ? [...document.querySelectorAll("main section[id]")]
        : [];
    let frame = 0;
    function updateActiveSection() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const activeSection = sections.reduce(
          (active, section) =>
            section.getBoundingClientRect().top <= 140 ? section : active,
          sections[0],
        );
        if (activeSection) setActiveHash(`#${activeSection.id}`);
      });
    }

    window.addEventListener("keydown", openPalette);
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateActiveSection);
    updateActiveSection();
    return () => {
      window.removeEventListener("keydown", openPalette);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
      window.cancelAnimationFrame(frame);
    };
  }, [page]);

  function closePalette() {
    setPaletteOpen(false);
    commandTriggerRef.current?.focus();
  }

  function isCurrent(label, href) {
    return currentPage === label ||
      (currentPage === "Home" && href.startsWith("/#") && href.slice(1) === activeHash);
  }

  const resumeLink = (
    <a
      className="nav-cta"
      href={resumeRequestUrl}
      target="_blank"
      rel="noreferrer"
      onClick={() => setMenuOpen(false)}
      title="Request a resume by email"
    >
      Resume on request <ArrowIcon diagonal />
    </a>
  );

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav
          className="primary-nav"
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {navigation.map(([label, href]) => (
            <a
              aria-current={isCurrent(label, href) ? "page" : undefined}
              className={isCurrent(label, href) ? "is-current" : ""}
              href={href}
              key={label}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          {resumeLink}
        </nav>
        <button
          aria-expanded={paletteOpen}
          aria-haspopup="dialog"
          className="command-trigger"
          onClick={() => setPaletteOpen(true)}
          ref={commandTriggerRef}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
            <circle cx="8.8" cy="8.8" r="5.6" />
            <path d="m13 13 4 4" />
          </svg>
          <span>Quick search</span>
          <kbd>⌘ K</kbd>
        </button>
        <button
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
      <nav
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
      >
        {navigation.map(([label, href]) => (
          <a
            aria-current={isCurrent(label, href) ? "page" : undefined}
            className={isCurrent(label, href) ? "is-current" : ""}
            href={href}
            key={label}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
        {resumeLink}
      </nav>
      <CommandPalette
        currentPage={currentPage}
        onClose={closePalette}
        open={paletteOpen}
      />
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-shell" id="home" aria-labelledby="hero-title">
      <div className="hero-content">
        <div className="availability">
          <span className="availability-dot" />
          INFORMATION TECHNOLOGY STUDENT · OPEN TO OPPORTUNITIES
        </div>
        <h1 id="hero-title">
          <span>Building technology</span>
          <span>that solves</span>
          <span className="gradient-text">real problems.</span>
        </h1>
        <p className="hero-copy">
          I’m Vedant, an Information Technology engineering student interested
          in AI-powered applications, full-stack development, and immersive
          technologies.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="/projects">
            Explore my projects <ArrowIcon />
          </a>
          <a
            className="button button-secondary"
            href={resumeRequestUrl}
            target="_blank"
            rel="noreferrer"
          >
            Request resume
          </a>
        </div>
        <nav className="hero-socials" aria-label="Contact and social links">
          {contactLinks.map((link) => (
            <a
              href={link.href}
              key={link.label}
              aria-label={link.label === "Email" ? "Email Vedant through Gmail" : link.label}
            >
              {link.label}
              <ArrowIcon diagonal />
            </a>
          ))}
        </nav>
        <div className="hero-location">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
            <path d="M16 8.3c0 4.2-6 9-6 9s-6-4.8-6-9a6 6 0 1 1 12 0Z" />
            <circle cx="10" cy="8" r="2" />
          </svg>
          Durg, Chhattisgarh, India
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="hero-glow" />
        <div className="hero-monogram">
          <span className="code-mark">&lt;/&gt;</span>
          <span className="code-caption">ideas into interfaces</span>
        </div>
        <div className="orbit-label label-top">curiosity → creation</div>
        <div className="orbit-label label-bottom">
          <span className="availability-dot" /> Open to learning
        </div>
        <span className="spark spark-one" />
        <span className="spark spark-two" />
        <span className="spark spark-three" />
      </div>
      <a className="scroll-cue" href="#about" aria-label="Scroll to about">
        <span /> Scroll to explore
      </a>
    </section>
  );
}

function About() {
  return (
    <section className="section-shell section-block" id="about">
      <SectionHeading eyebrow="A little about me" title="Learning by making." />
      <div className="about-layout">
        <p className="about-lead">
          I’m an IT student who likes understanding how ideas become useful,
          thoughtful software.
        </p>
        <div className="about-copy">
          <p>
            Alongside my learning, I’m exploring web development, AI-assisted
            ways of building, augmented reality, and emerging technologies. I
            also enjoy playing basketball outside my studies.
          </p>
          <p>
            My approach is simple: stay curious, keep learning the fundamentals,
            and make things that help me put new ideas into practice. I’m
            working toward a career where I can contribute to meaningful
            software and keep growing alongside a team.
          </p>
          <a className="text-link" href="#contact">
            Get to know me <ArrowIcon />
          </a>
          <a className="text-link academics-link" href="/academics">
            View academics <ArrowIcon diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section-shell section-block" id="skills">
      <SectionHeading
        eyebrow="What I’m exploring"
        title="Growing one skill at a time."
        description="These are areas I’m developing familiarity with—not claims of expert proficiency."
      />
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <article className="skill-card" key={group.title}>
            <span className="skill-icon" aria-hidden="true">
              {group.icon}
            </span>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <div className="skill-tags">
              {group.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="projects-section section-block" id="projects">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Selected project"
          title="An idea worth exploring."
          description="A concept focused on making safety training more immersive."
        />
        <article className="project-card">
          <div className="project-visual" aria-label="SafeSphere AR project concept">
            <div className="project-grid" />
            <div className="project-ring ring-outer" />
            <div className="project-ring ring-inner" />
            <div className="project-center">
              <svg aria-hidden="true" viewBox="0 0 64 64" fill="none">
                <path d="M32 8 51 16v14c0 12-8 21-19 26C21 51 13 42 13 30V16l19-8Z" />
                <path d="m23 32 6 6 13-14" />
              </svg>
            </div>
            <span className="visual-caption">A safer way to learn</span>
            <span className="visual-index">PROJECT / 01</span>
            <span className="project-orb" />
          </div>
          <div className="project-details">
            <div className="project-topline">
              <span className="project-type">
                <span /> Concept project
              </span>
              <span className="project-number">01 — 01</span>
            </div>
            <h3>SafeSphere <span>AR</span></h3>
            <p className="project-summary">
              {safeSphere.description}
            </p>
            <p className="project-note">
              A concept showcase. Implemented features and technologies have
              not been verified, so none are presented as completed work.
            </p>
            <div className="project-tags" aria-label="Project categories">
              {safeSphere.categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
            <a className="text-link case-study-link" href="/projects/safesphere-ar">
              Explore the concept <ArrowIcon diagonal />
            </a>
            <a
              className="button button-primary project-link"
              href={safeSphere.url}
            >
              Visit SafeSphere AR <ArrowIcon diagonal />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className="section-shell section-block" id="strengths">
      <SectionHeading
        eyebrow="How I work"
        title="Good work starts with good habits."
        description="The qualities I try to bring to every challenge and collaboration."
      />
      <div className="strengths-grid">
        {strengths.map((strength) => (
          <article className="strength-card" key={strength.title}>
            <span className="strength-number">{strength.icon}</span>
            <div>
              <h3>{strength.title}</h3>
              <p>{strength.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section-shell section-block experience-section" id="experience">
      <SectionHeading
        eyebrow="Experience & involvement"
        title="A space for the next chapter."
        description="I’m building my experience through learning and project work."
      />
      <div className="experience-empty">
        <span className="experience-empty-mark" aria-hidden="true">+</span>
        <div>
          <h3>Early in my journey</h3>
          <p>
            No internships, certifications, hackathons, open-source
            contributions, or formal roles have been added yet. This section
            will grow as I gain and verify new experience.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProjectsPage() {
  return (
    <section className="section-shell section-block route-page" aria-labelledby="projects-page-title">
      <SectionHeading
        eyebrow="Selected work"
        title="Projects worth exploring."
        description="A project concept shaped by curiosity about immersive technology and practical learning."
      />
      <article className="route-project-card">
        <div className="route-project-symbol" aria-hidden="true">&lt;/&gt;</div>
        <span className="project-type"><span /> {safeSphere.type}</span>
        <h2 id="projects-page-title">{safeSphere.name}</h2>
        <p>{safeSphere.description}</p>
        <p className="project-note">
          Specific implemented features, technologies, and repository details
          have not been verified and are intentionally not claimed.
        </p>
        <div className="project-tags">
          {safeSphere.categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
        <div className="route-project-actions">
          <a className="button button-primary" href="/projects/safesphere-ar">
            View concept details <ArrowIcon diagonal />
          </a>
          <a
            className="button button-secondary"
            href={safeSphere.url}
          >
            Visit project website <ArrowIcon diagonal />
          </a>
        </div>
      </article>
    </section>
  );
}

function CaseStudySection({ title, children }) {
  return (
    <section className="case-study-section">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function SafeSphereCaseStudy() {
  return (
    <article className="section-shell section-block route-page case-study">
      <a className="text-link back-link" href="/projects">
        <ArrowIcon /> Back to projects
      </a>
      <span className="eyebrow">Concept project · Case study</span>
      <h1>{safeSphere.name}</h1>
      <p className="case-study-lead">{safeSphere.description}</p>
      <div className="case-study-status">
        This is a concept showcase. The implementation details below are
        intentionally limited to information that has been verified.
      </div>
      <CaseStudySection title="Problem space">
        <p>
          The concept explores how augmented reality could support vocational
          safety learning in mining and manufacturing environments. Specific
          user research or documented training gaps have not been provided.
        </p>
      </CaseStudySection>
      <CaseStudySection title="Proposed direction">
        <p>
          SafeSphere AR is framed as an immersive industrial safety training
          simulator concept. Its intended focus is vocational learning and
          safety awareness; a detailed product workflow has not been specified.
        </p>
      </CaseStudySection>
      <CaseStudySection title="Implemented features">
        <p>
          No individual product features have been verified as implemented.
          The project is presented as a concept rather than a completed feature
          set.
        </p>
      </CaseStudySection>
      <CaseStudySection title="Technologies and architecture">
        <p>
          No technology stack, system architecture, or workflow details have
          been confirmed, so none are listed as project facts.
        </p>
      </CaseStudySection>
      <CaseStudySection title="Challenges and next steps">
        <p>
          No project-specific challenges or solutions have been documented.
          Potential next steps include defining a training scenario, validating
          the learning goals, and specifying a prototype before implementation.
        </p>
      </CaseStudySection>
      <div className="route-project-actions">
        <a
          className="button button-primary"
          href={safeSphere.url}
        >
          Visit SafeSphere AR <ArrowIcon diagonal />
        </a>
        <a className="button button-secondary" href="/projects">
          All projects
        </a>
      </div>
    </article>
  );
}

function Contact() {
  return (
    <section className="contact-section section-block" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="section-shell contact-inner">
        <span className="eyebrow">Have a project or an idea?</span>
        <h2>
          Let’s make
          <br />
          <span className="gradient-text">something meaningful.</span>
        </h2>
        <p>
          I’m always glad to connect with people who are curious about
          technology, learning, and building.
        </p>
        <div className="contact-links">
          {contactLinks.map((link) => (
            <a
              href={link.href}
              key={link.label}
            >
              <span
                className={`contact-link-icon${link.label === "LinkedIn" ? " contact-link-in" : ""}`}
                aria-hidden="true"
              >
                {link.icon}
              </span>
              <span>
                <small>{link.label}</small>
                <strong>{link.display}</strong>
              </span>
              <ArrowIcon diagonal />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-inner">
        <Brand footer />
        <nav className="footer-nav" aria-label="Footer navigation">
          {[
            ...navigation,
            ["Strengths", "/#strengths"],
            ["Resume on request", resumeRequestUrl],
          ].map(([label, href]) => (
            <a
              href={href}
              key={href}
              target={label === "Resume on request" ? "_blank" : undefined}
              rel={label === "Resume on request" ? "noreferrer" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} Vedant Chauhan</p>
      </div>
    </footer>
  );
}

export default function App() {
  const route = window.location.pathname.replace(/\/+$/, "") || "/";
  const page =
    route === "/"
      ? "home"
      : route === "/academics"
        ? "academics"
        : route === "/projects"
          ? "projects"
          : route === "/projects/safesphere-ar"
            ? "case-study"
            : "not-found";

  useEffect(() => {
    const pageTitles = {
      home: "Vedant Chauhan | Information Technology Student",
      academics: "Academics | Vedant Chauhan",
      projects: "Projects | Vedant Chauhan",
      "case-study": "SafeSphere AR | Vedant Chauhan",
      "not-found": "Page not found | Vedant Chauhan",
    };
    document.title = pageTitles[page];
  }, [page]);

  useEffect(() => {
    if (page !== "home" || !window.location.hash) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [page]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header page={page === "case-study" ? "projects" : page} />
      <main id="main-content">
        {page === "home" ? (
          <>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Strengths />
            <Contact />
          </>
        ) : page === "academics" ? (
          <AcademicsSection />
        ) : page === "projects" ? (
          <ProjectsPage />
        ) : page === "case-study" ? (
          <SafeSphereCaseStudy />
        ) : (
          <section className="section-shell section-block route-page not-found">
            <span className="eyebrow">Page not found</span>
            <h1>That page isn’t here.</h1>
            <p>Try heading back to the portfolio.</p>
            <a className="button button-primary" href="/#home">
              Back to home <ArrowIcon />
            </a>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
