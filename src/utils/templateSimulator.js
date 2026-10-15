/**
 * Prodesk IT - Sprint 4: The AI Cover Letter Generator
 * Phase 1 (P0) Simulation Controller
 *
 * Generates structured, high-conversion cover letters by interpolating
 * candidate credentials, target role, target company, and selected tone.
 */

export function generateSimulatedLetter(payload) {
  const {
    name = 'Candidate',
    role = 'Software Engineer',
    company = 'Target Company',
    skills = [],
    jobDescription = '',
    tone = 'Professional',
    resumeContext = '',
  } = payload;

  const dateString = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Normalize skills list
  const skillsArray = Array.isArray(skills)
    ? skills
    : typeof skills === 'string'
    ? skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const skillsListText = skillsArray.length > 0
    ? skillsArray.join(', ')
    : 'modern software engineering principles, full-stack architecture, and cross-functional leadership';

  const topSkills = skillsArray.slice(0, 3);
  const primarySkill = topSkills[0] || 'Modern Engineering';
  const secondarySkill = topSkills[1] || 'Scalable Architecture';
  const tertiarySkill = topSkills[2] || 'Team Collaboration';

  // Extract a brief highlight from resume text if available
  let resumeInsight = '';
  if (resumeContext && resumeContext.length > 50) {
    // Look for metrics or achievements in resumeContext
    const hasMetrics = /\d+[\%\+]?|\$[\d,]+/.test(resumeContext);
    if (hasMetrics) {
      resumeInsight = `Throughout my track record as detailed in my attached background, I have consistently driven quantifiable outcomes—delivering high-impact systems, optimizing latency, and shipping features that scaled effectively across thousands of active users.`;
    } else {
      resumeInsight = `My hands-on background and end-to-end delivery experience have equipped me to hit the ground running and translate complex product requirements into resilient software solutions.`;
    }
  }

  // Generate Tone-Specific Tone Content
  switch (tone) {
    case 'Confident':
      return `# ${name}
**Candidate for ${role}**  
Email: [Contact via LinkedIn / Portal] | Date: ${dateString}

---

**Hiring Team & Leadership**  
**${company}**  
Re: Application for **${role}**

Dear ${company} Hiring Team,

I am writing to express my enthusiastic interest in the **${role}** position at **${company}**. With a proven record of driving architectural excellence and high-velocity engineering, I have spent my career transforming complex technical challenges into scalable, high-leverage products. Knowing ${company}'s standard for innovation, I am confident that my background in **${skillsListText}** positions me to deliver immediate value to your engineering organization.

What excites me most about ${company} is your commitment to engineering excellence. Over the past several years, I have honed an ability to deliver robust solutions from inception to production deployment. I do not simply write code; I design systems that anticipate growth, enhance developer experience, and directly move core business metrics.

Key competencies I bring to the ${role} position include:
- **Core Technical Mastery:** Deep proficiency in **${primarySkill}** and **${secondarySkill}**, architecting modular and maintainable codebases that scale smoothly.
- **Cross-Disciplinary Execution:** Track record of driving alignment across product managers, designers, and engineering stakeholders to accelerate release cadence.
- **Continuous Performance Optimization:** Passion for benchmarking, automated testing, and CI/CD resilience, ensuring zero-regression releases and sub-second response times.

${resumeInsight ? `${resumeInsight}\n\n` : ''}I am eager to bring this same relentless focus and high-impact mindset to **${company}**. I welcome the opportunity to discuss how my expertise in **${skillsListText}** aligns with your strategic product goals for the upcoming quarter.

Thank you for your time and consideration.

Warm regards,

**${name}**  
${role} Candidate  
Portfolio & Contact: Available Upon Request
`;

    case 'Technical':
      return `# ${name}
**Technical Application for ${role}**  
Date: ${dateString} | Location: Remote / Onsite

---

**Technical Hiring Manager & Engineering Leadership**  
**${company}**  
Subject: **${role}** Opening | Candidate Credentials

Dear Engineering Leadership at ${company},

I am submitting my candidacy for the **${role}** role at **${company}**. My engineering background is centered on building resilient, fault-tolerant software systems and leveraging modern technologies including **${skillsListText}**. I have closely followed ${company}'s technical trajectory and would welcome the opportunity to contribute to your engineering infrastructure and product capabilities.

In my recent projects, I have focused heavily on clean architecture, API contracts, deterministic state management, and high-performance computing patterns. My engineering philosophy emphasizes modularity, strict typing, automated observability, and developer ergonomics.

Notable highlights directly applicable to ${company}'s ${role} position:
- **System Architecture & Stack:** Production implementation experience utilizing **${primarySkill}**, **${secondarySkill}**, and **${tertiarySkill}** to construct robust microservices and responsive web applications.
- **Code Quality & Reliability:** Enforcing unit, integration, and contract tests, achieving high test coverage and eliminating bottlenecks in continuous integration pipelines.
- **Engineering Rigor:** Conducting structured code reviews, standardizing design patterns, and mentoring teammates to uphold high bar production code.

${resumeInsight ? `${resumeInsight}\n\n` : ''}I am keen to dive into the technical challenges facing ${company}'s engineering teams and apply my background in **${skillsListText}** to your architecture. I look forward to exploring technical specifications, system design considerations, and roadmap priorities during an interview.

Sincerely,

**${name}**  
Software Engineer / ${role}  
`;

    case 'Executive':
      return `# ${name}
**Executive Summary & Cover Letter**  
Target Role: **${role}** | Organization: **${company}**  
Date: ${dateString}

---

**Executive Search Committee & Leadership Team**  
**${company}**  

Dear Members of the Selection Committee,

It is with great pleasure that I present my candidacy for the **${role}** role at **${company}**. As an engineering leader dedicated to strategic execution, technology innovation, and team empowerment, I specialize in steering high-stakes initiatives that bridge corporate vision with flawless technical execution. Given ${company}'s distinguished market reputation and growth trajectory, I am energized by the opportunity to steer your engineering capabilities to their next phase of expansion.

Throughout my tenure across software organizations, my focus has remained constant: building high-performing, autonomous engineering cultures that consistently deliver scalable business outcomes. My domain mastery across **${skillsListText}** allows me to converse fluently with engineers at the implementation level while maintaining alignment with Board-level and executive objectives.

Strategic pillars of my leadership approach:
- **Vision & Roadmap Execution:** Translating ambiguous market requirements into prioritized, high-leverage roadmaps that consistently achieve key milestone deliverables.
- **Architectural Governance:** Upholding rigorous standards in **${primarySkill}** and **${secondarySkill}** while mitigating tech debt and maximizing operational uptime.
- **People & Organizational Culture:** Cultivating psychological safety, continuous learning, and transparent metrics-driven feedback loops to attract and retain top-tier talent.

${resumeInsight ? `${resumeInsight}\n\n` : ''}I welcome a confidential discussion with the leadership team at **${company}** to review how my strategic vision and operational capabilities will drive measurable organizational success in the ${role} capacity.

Respectfully submitted,

**${name}**  
${role} | Technology Leader
`;

    case 'Professional':
    default:
      return `# ${name}
**Application for ${role}**  
Date: ${dateString}

---

**Hiring Team**  
**${company}**  
Subject: Application for the **${role}** Position

Dear Hiring Team at ${company},

I am writing to express my strong enthusiasm for the **${role}** opportunity at **${company}**. With a well-rounded foundation in software engineering and hands-on experience in **${skillsListText}**, I am eager to apply my technical and collaborative capabilities to help ${company} achieve its product development and business objectives.

Throughout my career, I have prided myself on writing clean, maintainable code and working closely with cross-functional teams to deliver reliable digital experiences. I am drawn to ${company} because of your strong engineering culture, commitment to user satisfaction, and reputation for solving impactful problems.

Here is how my qualifications align with the needs of the ${role} position:
- **Technical Capabilities:** Substantial hands-on experience utilizing **${primarySkill}**, **${secondarySkill}**, and related modern toolchains to engineer dependable web systems.
- **Collaborative Problem Solving:** Strong communication skills and a team-first mindset that ensures smooth cross-functional coordination between engineering, design, and product managers.
- **Ownership & Quality:** Dedicated approach to writing comprehensive test suites, optimizing response times, and ensuring that software is both performant and accessible.

${resumeInsight ? `${resumeInsight}\n\n` : ''}${jobDescription ? `Having reviewed the job specifications, I am particularly energized by your focus on scalable delivery and look forward to contributing immediately to these initiatives.\n\n` : ''}Thank you for your consideration of my application. I would welcome the opportunity to discuss my qualifications further in an interview.

Sincerely,

**${name}**  
${role} Candidate
`;
  }
}
