import React from "react";
import { academics } from "./data/portfolio.js";

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

export default function AcademicsPage() {
  return (
    <section
      className="academics-page section-block"
      id="academics"
      aria-labelledby="academics-title"
    >
      <div className="academics-ambient" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="academics-shell">
        <div className="academics-intro">
          <span className="eyebrow">The learning journey</span>
          <h2 id="academics-title">
            A foundation for
            <br />
            <span className="academics-gradient">what comes next.</span>
          </h2>
          <p>
            Each step has shaped how I approach learning, problem-solving, and
            the possibilities ahead.
          </p>
          <div className="academics-summary" aria-label="Academic overview">
            <span><i /> 3 milestones</span>
            <span><i /> Currently studying</span>
            <span><i /> Information Technology</span>
          </div>
        </div>

        <div
          className="academic-timeline"
          role="list"
          aria-label="Academic timeline"
        >
          {academics.map((record, index) => (
            <article
              className={`academic-entry${record.current ? " is-current" : ""}`}
              key={record.title}
              role="listitem"
            >
              <div className="timeline-rail" aria-hidden="true">
                <span className="timeline-marker">
                  {record.current ? (
                    <span className="timeline-marker-core" />
                  ) : (
                    <span className="timeline-marker-index">
                      0{academics.length - index}
                    </span>
                  )}
                </span>
              </div>
              <div className="academic-card">
                <div className="academic-card-top">
                  <span className="academic-level">{record.level}</span>
                  {record.current && (
                    <span className="academic-current-label">
                      <i aria-hidden="true" />
                      Current
                    </span>
                  )}
                </div>
                <div className="academic-card-content">
                  <div>
                    <h3>{record.title}</h3>
                    <p className="academic-institution">{record.institution}</p>
                    <p className="academic-location">
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                        <path d="M16 8.3c0 4.2-6 9-6 9s-6-4.8-6-9a6 6 0 1 1 12 0Z" />
                        <circle cx="10" cy="8" r="2" />
                      </svg>
                      {record.location}
                    </p>
                  </div>
                </div>
                <details className="academic-disclosure">
                  <summary>
                    <span className="disclosure-label">
                      <span className="disclosure-open-label">View academic details</span>
                      <span className="disclosure-close-label">Hide academic details</span>
                    </span>
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                      <path d="m5 7.5 5 5 5-5" />
                    </svg>
                  </summary>
                  <div className="academic-details">
                    <div className="academic-detail-item">
                      <span>{record.resultLabel}</span>
                      <strong>{record.result}</strong>
                    </div>
                    <div className="academic-detail-item">
                      <span>{record.tenureLabel}</span>
                      <strong>{record.tenure}</strong>
                    </div>
                    {record.current && (
                      <div className="academic-detail-item">
                        <span>{record.detailLabel}</span>
                        <strong>{record.detail}</strong>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </article>
          ))}
        </div>

        <div className="academic-extras">
          <div className="academic-extras-heading">
            <h2>More of the academic picture</h2>
            <p>Additional details can be added as they are confirmed.</p>
          </div>
          <div className="academic-extras-grid">
            <article>
              <span>Coursework</span>
              <p>No course list has been shared yet.</p>
            </article>
            <article>
              <span>Achievements</span>
              <p>No additional academic achievements have been provided.</p>
            </article>
            <article>
              <span>Certifications</span>
              <p>No verified certifications have been added yet.</p>
            </article>
            <article>
              <span>Internships</span>
              <p>No internship details have been shared yet.</p>
            </article>
            <article>
              <span>Learning milestone</span>
              <p>No additional learning milestones have been shared yet.</p>
            </article>
          </div>
        </div>

        <div className="academics-actions">
          <a className="button button-primary" href="/#home">
            Back to portfolio <ArrowIcon />
          </a>
          <a className="button button-secondary" href="/projects">
            Explore projects <ArrowIcon diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}
