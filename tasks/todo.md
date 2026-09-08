# Task: Business Directory Implementation & Multi-Agent Quality Review

## 1. Specification & Planning
- [x] Save product spec to `docs/business-directory-spec.md` <!-- id: 0 -->
- [x] Create detailed implementation plan in `implementation_plan.md` with agent roles <!-- id: 1 -->
- [x] Obtain user approval on the implementation plan <!-- id: 2 -->

## 2. Agent Role Definitions
- [x] Define subagent roles:
  - `qa_tester`
  - `user_tester`
  - `ux_reviewer`
  - `security_reviewer`
  - `a11y_reviewer` <!-- id: 3 -->

## 3. Data Architecture & Backend (Firestore)
- [x] Add `Business`, `BusinessCategory`, and `BusinessStatus` types to `src/types.ts` <!-- id: 4 -->
- [x] Create comprehensive mock businesses with realistic Ghanaian member businesses across categories in `src/data/mockData.ts` <!-- id: 5 -->
- [x] Update `firestore.rules` for the `businesses` collection (public read published, public submit pending, admin full control) <!-- id: 6 -->

## 4. Frontend Implementation
- [x] Update `src/components/Navbar.tsx` and `src/components/Footer.tsx` with Directory navigation links <!-- id: 7 -->
- [x] Create Directory Listing page: `src/app/directory/page.tsx` & `src/views/Directory.tsx` <!-- id: 8 -->
  - Debounced search (300ms) across name, description, tags
  - Category filter rail (desktop) & bottom sheet drawer (mobile)
  - 1:1 business cards with fallback letter monogram
  - Quick action buttons: WhatsApp (`wa.me` prefill), Call (`tel:`), Website
  - Featured weekly badge
  - Load More pagination (12 cards/page) & dynamic count
  - Friendly empty states
- [x] Create Individual Listing page: `src/app/directory/[slug]/page.tsx` & `src/views/BusinessDetail.tsx` <!-- id: 9 -->
  - Hero header with logo/photo, name, category, "Run by [Owner]"
  - Full description & services bullet pills
  - Contact section (WhatsApp, Call, Email, Website, Area location)
  - Share section (WhatsApp share API, Copy link with visual feedback)
  - Photo gallery row with modal preview
  - "You might also like" (3 related businesses)
- [x] Create Registration Form page: `src/app/directory/register/page.tsx` & `src/views/BusinessRegister.tsx` <!-- id: 10 -->
  - Required fields (name, phone, business name, category, short description with 300 char counter, WhatsApp with "Same as phone" toggle)
  - Collapsible optional section ("Add more details")
  - Logo/photo file upload to Firebase Storage
  - Submits to Firestore with `status: "pending"`
  - Success message & inline field validation

## 5. Admin CMS Integration
- [x] Create `src/components/admin/BusinessForm.tsx` modal for creating/editing businesses <!-- id: 11 -->
- [x] Update `src/app/admin/page.tsx` with "Business Directory" tab <!-- id: 12 -->
  - Tab views / filters: All, Pending Reviews, Published, Drafts
  - Quick actions: "Approve & Publish", "Move to Draft", "Feature This Week"
  - Edit and Delete functionality
  - Update Database Seeder to seed sample business directory records

## 6. QA & Multi-Role Platform Review
- [x] Run QA testing: TypeScript check (`tsc --noEmit` passed), Next.js compilation, and functional assertions <!-- id: 13 -->
- [x] User Persona Testing:
  - Church Member browsing & filtering on mobile and desktop
  - Business Owner submitting registration
  - Communications Coordinator reviewing and approving in CMS <!-- id: 14 -->
- [x] UX Review: visual hierarchy, spacing, mobile touch targets, microcopy <!-- id: 15 -->
- [x] Security Review: Firestore rules audit, XSS/sanitization check <!-- id: 16 -->
- [x] Accessibility (a11y) Review: semantic tags, keyboard navigation, color contrast, `<fieldset>`/`<legend>` <!-- id: 17 -->
- [x] Final Walkthrough & report in `walkthrough.md` <!-- id: 18 -->

## 7. Navbar Redesign (Thematic Pillars Architecture)
- [x] Re-architect `src/components/Navbar.tsx` into Curated Thematic Pillars: <!-- id: 19 -->
  - "Church Life" mega-panel (Ministries/Auxiliaries, Member Business Directory, Photo Gallery)
  - "Word & Media" mega-panel (Sermons & Messages, Devotionals & Announcements)
  - Standalone "About" and "Contact"
  - CTA button "Watch Latest"
  - Escape key handling, keyboard accessibility, smooth animations
  - Mobile accordion structure with matching categorization
- [x] Run `npx tsc --noEmit` and verify zero errors <!-- id: 20 -->
- [x] Document changes in `walkthrough.md` <!-- id: 21 -->
