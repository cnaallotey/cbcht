# Business Directory — Product Spec

**Project:** Calvary Baptist Church — Member Business Directory  
**Status:** Draft v1.0  
**Audience:** Developer, designer, pastoral review  
**Last Updated:** September 2026

---

## Overview

A public-facing directory on the CBC website listing businesses owned and operated by church members. The directory is the anchor for the full digital promotion initiative — social media spotlights and newsletter features link back to individual listings here.

The directory has two surfaces:

- **Directory listing page** — browse and filter all registered businesses
- **Individual business listing page** — full profile for a single business

There is also an internal-facing surface:

- **Business registration form** — how members submit their business for inclusion

---

## Goals

- Give every member business a permanent, findable home on the church website
- Make it easy for members to discover and contact one another's businesses
- Serve as the canonical destination for all spotlight links (social, email, WhatsApp)
- Require minimal ongoing maintenance from the church team

### Non-goals

- E-commerce or in-app purchasing
- Member login or authentication (Phase 1)
- Member reviews or ratings (Phase 1 — consider for Phase 2)
- Business owner self-service editing (Phase 1 — consider for Phase 2)

---

## Users

| User | Description | Primary Job |
|---|---|---|
| Member (visitor) | Church member browsing for a fellow member's business | Find a business by category or name and contact them |
| Non-member (visitor) | Community member who has heard about the directory | Discover CBC-connected businesses |
| Communications Coordinator | Church staff/volunteer who manages listings | Add, edit, and feature listings without touching code |
| Business Owner (member) | Submits and occasionally updates their own listing | Get listed and stay visible |

---

## Pages & Routes

| Route | Page | Notes |
|---|---|---|
| `/directory` | Directory listing page | Public |
| `/directory/[slug]` | Individual business listing | Public |
| `/directory/register` | Business registration form | Public (submissions go to admin review) |

---

## Page 1: Directory Listing (`/directory`)

### Purpose

Browse and filter all approved member businesses.

### Layout — Desktop

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (church nav)                                    │
├─────────────────────────────────────────────────────────┤
│  Page title + one-line description                      │
│  "Register your business" CTA (secondary, top right)   │
├──────────────┬──────────────────────────────────────────┤
│  FILTER RAIL │  BUSINESS GRID (3 columns)              │
│  ----------  │                                          │
│  Search      │  [Card] [Card] [Card]                   │
│              │  [Card] [Card] [Card]                   │
│  Category    │  ...                                     │
│  (checkbox   │                                          │
│   list)      │                                          │
│              │                                          │
│  Clear all   │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### Layout — Mobile

Filter rail collapses into a sticky top filter bar with a "Filter" button that opens a bottom sheet. Grid becomes a single column.

```
┌─────────────────────────────────┐
│  Page title                     │
│  [Search bar]  [Filter ▾]       │
├─────────────────────────────────┤
│  [Card]                         │
│  [Card]                         │
│  [Card]                         │
└─────────────────────────────────┘
```

### Components

#### Search Bar

- Full-text search across business name, description, and tags
- Searches as user types (debounced, 300ms)
- Clears with an `×` button
- Placeholder: "Search businesses..."
- No results state: "No businesses match '[query]'. Try a different word or browse by category."

#### Category Filter

Categories (checkboxes, multi-select):

- Food & Catering
- Technology & Digital Services
- Health, Beauty & Wellness
- Education & Tutoring
- Construction & Real Estate
- Retail & Fashion
- Financial Services
- Transportation & Logistics
- Creative Arts & Media
- Agriculture & Produce
- Other

Selecting one or more categories filters the grid in real time. A "Clear filters" link appears when any filter is active.

#### Featured Badge

The current week's spotlight business gets a `Featured this week` badge on its card. Only one business carries this badge at a time. The Communications Coordinator sets this in the CMS.

#### Business Card (grid item)

```
┌──────────────────────────────────┐
│  [Logo / photo — 1:1 aspect]     │
│  ── ── ── ── ── ── ── ── ── ──  │
│  Category tag                    │
│  Business name (heading)         │
│  Short description (2 lines max) │
│  ── ── ── ── ── ── ── ── ── ──  │
│  [WhatsApp]  [Call]  [Website →] │
└──────────────────────────────────┘
```

- Clicking anywhere on the card (except contact buttons) goes to the individual listing page
- Contact buttons open WhatsApp, dial the phone, or open the external website — they do not navigate away within the site
- If no logo is uploaded, show a placeholder with the first letter of the business name on a coloured background (colour derived from the business name string)

#### Empty State

If no businesses are listed yet (or all filtered out):

> **No businesses here yet.**  
> Be the first — [register your business](#) and get found by fellow members.

#### Pagination / Load More

- Default: show 12 cards per page
- "Load more" button at the bottom (preferred over pagination for mobile browsing)
- Show total count: "Showing 12 of 34 businesses"

---

## Page 2: Individual Business Listing (`/directory/[slug]`)

### Purpose

Full profile for a single business. This is the page that social media and newsletter spotlights link to.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to directory                                    │
├─────────────────┬───────────────────────────────────────┤
│  Business logo  │  Business name (large heading)        │
│  or photo       │  Category tag                         │
│  (square)       │  Member name: "Run by [Name]"         │
│                 │  [Featured badge — if applicable]     │
├─────────────────┴───────────────────────────────────────┤
│  Description (full, no line limit)                      │
├─────────────────────────────────────────────────────────┤
│  Services / Products offered (bullet list or tags)      │
├──────────────────────────┬──────────────────────────────┤
│  CONTACT                 │  SHARE                       │
│  WhatsApp (button)       │  Share on WhatsApp           │
│  Call (button)           │  Copy link                   │
│  Email (button)          │                              │
│  Website (link)          │                              │
│  Location (if listed)    │                              │
├──────────────────────────┴──────────────────────────────┘
│  Gallery (if photos uploaded — horizontal scroll row)   │
├─────────────────────────────────────────────────────────┤
│  Other businesses you might like (3 cards, same cat.)   │
└─────────────────────────────────────────────────────────┘
```

### Field Definitions

| Field | Required | Notes |
|---|---|---|
| Business name | Yes | Displayed as the page `<h1>` |
| Slug | Yes | Auto-generated from business name; editable in CMS |
| Owner name | Yes | "Run by [Name]" — first name only is fine |
| Category | Yes | Single select from the category list |
| Short description | Yes | 2–3 sentences. Used on the card in the directory listing |
| Full description | No | Longer profile copy. Shown only on the individual listing page |
| Services / products | No | Up to 8 items as a comma-separated list or bullet points |
| Logo / primary photo | No | Recommended. Displayed 1:1 square. Max 2MB, PNG or JPG |
| Gallery photos | No | Up to 5 additional photos |
| WhatsApp number | Yes (or phone) | Must be a valid Ghanaian number. Generates a `wa.me` link |
| Phone number | Yes (or WhatsApp) | |
| Email | No | |
| Website URL | No | |
| Location / area | No | General area only (e.g., "Tema, Accra") — no full street address required |
| Social handles | No | Instagram, Facebook, TikTok |
| Tags | No | Free-form keywords for search (internal, not displayed) |
| Featured | No | Boolean — set by Communications Coordinator only |
| Date listed | Auto | Set on creation |

### Contact Buttons

| Button | Action |
|---|---|
| WhatsApp | Opens `https://wa.me/233XXXXXXXXX?text=Hi%2C+I+found+you+on+the+CBC+directory` |
| Call | Opens `tel:+233XXXXXXXXX` |
| Email | Opens `mailto:` |
| Website | Opens external URL in a new tab |

The WhatsApp pre-fill message lets the business owner know the inquiry came from the directory — useful for tracking.

### Share

- **Share on WhatsApp** — uses the WhatsApp share API with the business name and page URL
- **Copy link** — copies the listing URL to clipboard, shows a "Copied!" confirmation

### "You might also like" Section

Shows 3 other business cards from the same category, excluding the current listing. If fewer than 3 exist in the same category, fill with recently added businesses from other categories.

---

## Page 3: Registration Form (`/directory/register`)

### Purpose

Members submit their business details for review and listing.

### Design Notes

- Keep it short — members are filling this in on mobile
- Required fields only on the first pass; optional fields shown in a collapsible "Add more details" section
- No login required — submission is open to any member

### Form Fields

**Required**

- Your name (text)
- Your phone number (tel input)
- Business name (text)
- Business category (select)
- Short description (textarea, max 300 characters, live character count)
- WhatsApp number for the business (tel input; checkbox: "Same as my phone number above")

**Optional (collapsible section — "Add more details")**

- Full description (textarea)
- Services or products offered (textarea — "List up to 8, one per line")
- Business email (email input)
- Business website (url input)
- Location / area (text — "e.g. Tema, Accra")
- Instagram handle (text)
- Facebook page link (url)
- Logo or photo upload (file input — PNG/JPG, max 2MB)

**Submission**

- Submit button: "Submit for review"
- On success: confirmation message — "Thanks, [Name]! Your submission has been received. The CBC Communications Team will review it and get your business listed within 5 business days. We'll WhatsApp you when it's live."
- On error: inline field-level error messages

### After Submission

Submissions are not automatically published. The Communications Coordinator reviews each submission in the CMS and clicks "Approve & Publish" or "Request more info."

---

## CMS Requirements

The directory should be driven by a CMS so the Communications Coordinator can manage listings without touching code.

### CMS Content Model: `Business`

```
Business {
  id: uuid
  name: string (required)
  slug: string (required, unique, auto-generated)
  ownerName: string (required)
  category: enum (required)
  shortDescription: string (required, max 300 chars)
  fullDescription: richText (optional)
  services: array<string> (optional, max 8)
  logo: image (optional)
  gallery: array<image> (optional, max 5)
  whatsapp: string (required or phone)
  phone: string (required or whatsapp)
  email: email (optional)
  website: url (optional)
  location: string (optional)
  instagram: string (optional)
  facebook: url (optional)
  tags: array<string> (optional)
  featured: boolean (default: false)
  status: enum [draft, pending, published] (default: pending)
  createdAt: datetime (auto)
  publishedAt: datetime (auto on publish)
}
```

---

## Appendix: Category List (Full)

1. Food & Catering
2. Technology & Digital Services
3. Health, Beauty & Wellness
4. Education & Tutoring
5. Construction & Real Estate
6. Retail & Fashion
7. Financial Services
8. Transportation & Logistics
9. Creative Arts & Media
10. Agriculture & Produce
11. Other
