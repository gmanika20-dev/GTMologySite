---
title: "From Raw Campaign Data to Weekly Decisions: A Marketing Performance Dashboard and Budget Guardrails"
slug: case-study-marketing-performance-dashboard
type: Case Study
topic: Marketing Analytics
primary_keyword: marketing performance dashboard case study
seo_title: "Case Study: Marketing Performance Dashboard & Budget Guardrails | Dominize"
meta_description: "How a global B2B SaaS marketing team turned scattered campaign and web data into one performance dashboard, with budget guardrails that guided weekly spend decisions."
author: Manika Gupta
published: 2026-10-14
last_updated: 2026-10-20
schema: [Article, BreadcrumbList, Person(author)]
read_time: 5 min
related_services: []
---

# From Raw Campaign Data to Weekly Decisions: A Marketing Performance Dashboard and Budget Guardrails

**In short:** A global banking-technology SaaS marketing team had campaign, web and CRM data spread across several tools, and no single view of what was working. A purpose-built dashboard brought it together with week-over-week, month-over-month and quarter-over-quarter views, delivered in a fraction of the time originally planned. A simple set of budget guardrails then turned those insights into consistent spend decisions.

> This case study describes work Manika Gupta led in-house in a previous role. The company is not named.

## At a glance

| | |
|---|---|
| **Company** | A global banking-technology provider selling software to financial institutions |
| **Team** | Marketing working with stakeholders in the US, UK and other regions |
| **Challenge** | Data in separate tools, slow reporting and spend decisions made case by case |
| **Approach** | One dashboard across web, campaign and CRM data, plus budget guardrails |
| **Result** | Faster, data-backed recommendations and consistent campaign spend decisions |

## The challenge

Marketing performance lived in different places: website analytics, the CRM, ad platforms and spreadsheets. Answering a simple question such as *"Which campaigns are bringing engaged visitors who go on to fill in a form?"* meant pulling exports from several tools and stitching them together by hand.

A formal dashboard was planned through a central reporting team, but the expected timeline was several weeks. In the meantime, leadership needed answers, and campaign budgets were adjusted case by case without shared rules.

## The approach

### 1. Agree the questions first
Before building anything, the team agreed which decisions the dashboard needed to support: where to shift budget, which content to promote, and which campaigns to pause.

### 2. Bring the data together
Web analytics, CRM reporting and campaign data were combined in Excel and Power BI, using basic SQL and Salesforce reports where needed.

<figure class="viz">
<svg viewBox="0 0 720 260" role="img" aria-label="Data flow from source tools to dashboard to decisions">
<rect x="0" y="20" width="150" height="44" rx="10" class="box"/><text x="75" y="47" class="t-cs" text-anchor="middle">Web analytics</text>
<rect x="0" y="76" width="150" height="44" rx="10" class="box"/><text x="75" y="103" class="t-cs" text-anchor="middle">CRM reports</text>
<rect x="0" y="132" width="150" height="44" rx="10" class="box"/><text x="75" y="159" class="t-cs" text-anchor="middle">Ad platforms</text>
<rect x="0" y="188" width="150" height="44" rx="10" class="box"/><text x="75" y="215" class="t-cs" text-anchor="middle">Spreadsheets</text>
<path d="M152 42 C 200 42, 200 126, 236 126M152 98 C 200 98, 200 126, 236 126M152 154 C 200 154, 200 126, 236 126M152 210 C 200 210, 200 126, 236 126" class="link"/>
<rect x="240" y="86" width="170" height="80" rx="12" class="box navy"/><text x="325" y="120" class="t-c w">One data model</text><text x="325" y="140" class="t-cs w" text-anchor="middle">Excel and Power BI</text>
<path d="M412 126h26" class="arr"/>
<rect x="444" y="86" width="130" height="80" rx="12" class="box maroon"/><text x="509" y="120" class="t-c w">Dashboard</text><text x="509" y="140" class="t-cs w" text-anchor="middle">weekly views</text>
<path d="M576 126h26" class="arr"/>
<rect x="608" y="86" width="112" height="80" rx="12" class="box"/><text x="664" y="120" class="t-c">Decisions</text><text x="664" y="140" class="t-cs" text-anchor="middle">budget, content</text>
</svg>
<figcaption>Separate data sources combined into one model, one dashboard and a regular decision cycle.</figcaption>
</figure>

### 3. Design for trends, not snapshots
The dashboard tracked users, bounce rate, engaged visits and form submissions over time, with week-over-week, month-over-month and quarter-over-quarter comparisons, so the team could spot what was improving and what was slipping.

<figure class="viz">
<svg viewBox="0 0 720 300" role="img" aria-label="Illustrative mock-up of the marketing performance dashboard">
<rect x="0" y="0" width="720" height="300" rx="14" class="page"/>
<rect x="20" y="20" width="160" height="62" rx="8" class="blk"/><text x="34" y="44" class="t-tiny">USERS</text><rect x="34" y="56" width="90" height="10" rx="5" class="seg s2"/>
<rect x="196" y="20" width="160" height="62" rx="8" class="blk"/><text x="210" y="44" class="t-tiny">ENGAGED VISITS</text><rect x="210" y="56" width="110" height="10" rx="5" class="seg s1"/>
<rect x="372" y="20" width="160" height="62" rx="8" class="blk"/><text x="386" y="44" class="t-tiny">BOUNCE RATE</text><rect x="386" y="56" width="60" height="10" rx="5" class="seg s4"/>
<rect x="548" y="20" width="152" height="62" rx="8" class="blk"/><text x="562" y="44" class="t-tiny">FORM SUBMISSIONS</text><rect x="562" y="56" width="100" height="10" rx="5" class="seg s3"/>
<text x="20" y="116" class="t-tiny">WEEK OVER WEEK</text>
<path d="M20 270h420" class="axis"/>
<rect x="36" y="200" width="26" height="70" rx="4" class="seg s4"/><rect x="88" y="186" width="26" height="84" rx="4" class="seg s4"/><rect x="140" y="192" width="26" height="78" rx="4" class="seg s4"/><rect x="192" y="170" width="26" height="100" rx="4" class="seg s1"/><rect x="244" y="160" width="26" height="110" rx="4" class="seg s1"/><rect x="296" y="146" width="26" height="124" rx="4" class="seg s1"/><rect x="348" y="134" width="26" height="136" rx="4" class="seg s2"/><rect x="400" y="140" width="26" height="130" rx="4" class="seg s2"/>
<text x="470" y="116" class="t-tiny">TOP CAMPAIGNS AND CONTENT</text>
<rect x="470" y="130" width="230" height="22" rx="5" class="blk"/><rect x="470" y="130" width="190" height="22" rx="5" class="seg s3"/>
<rect x="470" y="164" width="230" height="22" rx="5" class="blk"/><rect x="470" y="164" width="150" height="22" rx="5" class="seg s1"/>
<rect x="470" y="198" width="230" height="22" rx="5" class="blk"/><rect x="470" y="198" width="120" height="22" rx="5" class="seg s1"/>
<rect x="470" y="232" width="230" height="22" rx="5" class="blk"/><rect x="470" y="232" width="80" height="22" rx="5" class="seg s4"/>
<text x="700" y="292" class="t-tiny" text-anchor="end">Illustrative layout, not real data</text>
</svg>
<figcaption>The dashboard layout: headline measures at the top, trends over time, and the campaigns and content driving results.</figcaption>
</figure>

### 4. Add budget guardrails
A modular budget management system set spending limits for each ad set and performance benchmarks for each campaign. When a campaign moved above or below its benchmark, the guardrails made the next step clear.

<figure class="viz">
<svg viewBox="0 0 720 200" role="img" aria-label="Budget guardrail decision rules">
<rect x="0" y="60" width="170" height="80" rx="12" class="box navy"/><text x="85" y="96" class="t-c w">Weekly review</text><text x="85" y="116" class="t-cs w" text-anchor="middle">against benchmarks</text>
<path d="M172 100 C 220 100, 220 30, 262 30M172 100H262M172 100 C 220 100, 220 170, 262 170" class="link"/>
<rect x="266" y="8" width="454" height="44" rx="10" class="box"/><text x="286" y="35" class="t-cs"><tspan font-weight="700" fill="#1f3f74">Above benchmark</tspan>  →  increase spend within the ad-set limit</text>
<rect x="266" y="78" width="454" height="44" rx="10" class="box"/><text x="286" y="105" class="t-cs"><tspan font-weight="700" fill="#0f1e3d">On benchmark</tspan>  →  keep running and keep testing creative</text>
<rect x="266" y="148" width="454" height="44" rx="10" class="box"/><text x="286" y="175" class="t-cs"><tspan font-weight="700" fill="#7a1f2b">Below benchmark</tspan>  →  reduce, rework the message or pause</text>
</svg>
<figcaption>Simple, agreed rules turned dashboard insight into consistent spend decisions.</figcaption>
</figure>

## The result

- **One view of performance** across web, campaign and CRM data
- **Delivered in a fraction of the planned time**, so leadership had answers sooner
- **Data-backed recommendations** for leadership and execution teams every week
- **Consistent spend decisions**, guided by shared limits and benchmarks rather than case-by-case debate

## Key takeaways
- Start a dashboard from the decisions it must support, not from the data available.
- Show trends over time, so teams act on direction rather than a single snapshot.
- Pair reporting with budget guardrails, so insight becomes action.
- A focused, practical dashboard delivered quickly is worth more than a perfect one delivered late.
