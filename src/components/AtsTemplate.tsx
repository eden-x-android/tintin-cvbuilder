import type { CSSProperties } from 'react';
import type { CvView } from '../utils/buildCvView';
import type { TemplatePreset } from '../templates/presets';
import { renderRichText } from '../utils/richText';
import './AtsTemplate.css';

// Layout "Clean (ATS)" + footer "Phương án 1 · Bảng thống nhất" của bản export (asset/CV P1*.html).
// Markup giữ 1:1 với thiết kế — xem .agents/rules/cv-templates.md trước khi sửa.
// `data-break` đánh dấu chỗ ngắt trang chủ động; `cv-keep` (khối không được cắt ngang trang) và `cv-keep-next`
// (tiêu đề dính với dòng sau) vừa là luật in vừa là dữ liệu để utils/paginate.ts tính đúng chỗ ngắt trang.

type AtsTemplateProps = {
    view: CvView;
    preset: TemplatePreset;
};

const rich = (text: string) => renderRichText(text, 'cv-link');

const breakBefore = (isOn: boolean) => (isOn ? { className: 'cv-break-before', 'data-break': 'before' } : {});
const breakAfter = (isOn: boolean) => (isOn ? { 'data-break': 'after' } : {});

const AtsTemplate = ({ view, preset }: AtsTemplateProps) => {
    const { theme, font } = preset;
    const themeVars = {
        '--cv-accent': theme.accent,
        '--cv-soft': theme.soft,
        '--cv-line': theme.line,
        '--cv-tint': theme.tint,
        '--cv-ink': theme.ink,
        '--cv-font-head': font.head,
        '--cv-font-body': font.body,
    } as CSSProperties;

    const hasFooter = view.education.length > 0 || view.certifications.length > 0 || view.references.length > 0;
    const section = (gapClass: string, isBreak: boolean) => {
        const extra = breakBefore(isBreak);
        return { ...extra, className: ['cv-section', gapClass, extra.className].filter(Boolean).join(' ') };
    };

    return (
        <article className="cv-page" style={themeVars}>
            <header className="cv-header cv-keep">
                <div className="cv-identity">
                    <h1 className="cv-name">{view.fullName}</h1>
                    <span className="cv-title">{view.title}</span>
                    <span className="cv-location">{view.location}</span>
                </div>
                {view.photo && <img className="cv-photo" src={view.photo} alt="" />}
            </header>

            {view.contacts.length > 0 && (
                <div className="cv-contacts cv-keep">
                    {view.contacts.map(c => (
                        <div key={c.label} className="cv-contact">
                            <span className="cv-contact-label">{c.label}</span>
                            {c.href ? (
                                <a className="cv-link cv-contact-link" href={c.href}>{c.value}</a>
                            ) : (
                                <span className="cv-contact-value">{c.value}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {view.summary.length > 0 && (
                <section {...section('cv-gap-8', view.breaks.summary)}>
                    <span className="cv-section-title cv-keep-next">SUMMARY</span>
                    {view.summary.map((item, i) => (
                        <span key={i} className="cv-summary-item cv-keep">• {rich(item)}</span>
                    ))}
                </section>
            )}

            {view.objectives.length > 0 && (
                <section {...section('cv-gap-10', view.breaks.objective)}>
                    <span className="cv-section-title cv-keep-next">OBJECTIVE</span>
                    <div className="cv-objectives cv-keep">
                        {view.objectives.map((o, i) => (
                            <div key={i} className="cv-objective">
                                <span className="cv-objective-label">{o.label}</span>
                                {o.text && <span className="cv-objective-text">{rich(o.text)}</span>}
                                {o.items.map((item, j) => (
                                    <span key={j} className="cv-objective-item">• {rich(item)}</span>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {view.skills.length > 0 && (
                <section {...section('cv-gap-10', view.breaks.skills)}>
                    <span className="cv-section-title cv-keep-next">SKILLS</span>
                    {view.skills.map(s => (
                        <div key={s.id} className="cv-skill-row cv-keep">
                            <span className="cv-skill-category">{s.category}</span>
                            <div className="cv-skill-chips">
                                {s.items.map((item, i) => (
                                    <span key={i} className="cv-skill-chip">{item}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {view.experience.length > 0 && (
                <section {...section('cv-gap-16', view.breaks.experience)}>
                    <span className="cv-section-title cv-keep-next">RELEVANT EXPERIENCE</span>
                    {view.experience.map(job => (
                        <div
                            key={job.id}
                            className={`cv-job ${job.pageBreakAfter ? 'cv-break-after' : ''}`}
                            {...breakAfter(job.pageBreakAfter)}
                        >
                            <span className="cv-job-heading cv-keep-next">
                                {job.role} <span className="cv-job-at">at</span> {job.company}
                            </span>
                            {job.period && <span className="cv-job-period cv-keep-next">{job.period}</span>}
                            {job.responsibilities.map((item, i) => (
                                <span key={i} className="cv-job-item cv-keep">• {rich(item)}</span>
                            ))}
                        </div>
                    ))}
                </section>
            )}

            {view.projects.length > 0 && (
                <section {...section('cv-gap-14', view.breaks.projects)}>
                    <span className="cv-section-title cv-keep-next">PROJECTS</span>
                    {view.projects.map(pj => (
                        <div
                            key={pj.id}
                            className={`cv-project ${pj.pageBreakAfter ? 'cv-break-after' : ''}`}
                            {...breakAfter(pj.pageBreakAfter)}
                        >
                            <span className="cv-project-name cv-keep-next">{pj.name}</span>
                            {pj.metaLine && <span className="cv-project-meta cv-keep-next">{pj.metaLine}</span>}
                            {pj.overview && <span className="cv-project-overview cv-keep">{rich(pj.overview)}</span>}
                            {pj.responsibilities.length > 0 && (
                                <span className="cv-project-label cv-keep-next">Responsibilities:</span>
                            )}
                            {pj.responsibilities.map((item, i) => (
                                <span key={i} className="cv-project-item cv-keep">• {rich(item)}</span>
                            ))}
                            {pj.achievement && (
                                <span className="cv-project-result cv-keep">
                                    <b className="cv-accent-text">Result:</b> {rich(pj.achievement)}
                                </span>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {hasFooter && (
                <section
                    {...breakBefore(view.breaks.footer)}
                    className={`cv-footer ${view.breaks.footer ? 'cv-break-before' : ''}`}
                >
                    {view.education.length > 0 && (
                        <div className="cv-footer-row cv-keep">
                            <span className="cv-section-title">EDUCATION</span>
                            <div className="cv-footer-list cv-gap-6">
                                {view.education.map(e => (
                                    <div key={e.id} className="cv-education">
                                        <span className="cv-footer-line">
                                            <b className="cv-strong">{e.school}</b>
                                            {e.major && <span className="cv-muted"> · {e.major}</span>}
                                        </span>
                                        <span className="cv-education-period">
                                            {e.period}
                                            {e.gpa && (
                                                <span className="cv-nowrap">
                                                    {' '}· GPA <b className="cv-strong cv-accent-text">{e.gpa}</b>
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view.certifications.length > 0 && (
                        <div className="cv-footer-row cv-keep">
                            <span className="cv-section-title">CERTIFICATIONS</span>
                            <div className="cv-footer-list cv-gap-4">
                                {view.certifications.map(c => (
                                    <span key={c.id} className="cv-footer-line">
                                        <b className="cv-strong">{c.name}</b>
                                        {c.year && <span className="cv-muted"> · {c.year}</span>}
                                        {c.issuer && <span className="cv-muted"> · {c.issuer}</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {view.references.length > 0 && (
                        <div className="cv-footer-row cv-keep">
                            <span className="cv-section-title">REFERENCES</span>
                            <div className="cv-footer-list cv-gap-4">
                                {view.references.map(ref => (
                                    <span key={ref.id} className="cv-footer-line">
                                        <b className="cv-strong">{ref.name}</b>
                                        <span className="cv-muted">
                                            {ref.position && ` · ${ref.position}`}
                                            {ref.email && ' · '}
                                        </span>
                                        {ref.email && (
                                            <a className="cv-link cv-nowrap" href={`mailto:${ref.email}`}>
                                                {ref.email}
                                            </a>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}
        </article>
    );
};

export default AtsTemplate;
