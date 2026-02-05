# PRD-004: Analytics & Tracking Integration

## Overview
As a marketing-focused website builder, users must be able to track the performance of their generated sites. This PRD outlines the integration of common tracking pixels and conversion events.

## User Stories
- As a marketer, I want to add my Facebook Pixel so I can track conversions.
- As a business owner, I want Google Analytics 4 integration to see my traffic sources.
- As a user, I want my primary CTA button clicks to be automatically tracked as "Lead" events.

## Proposed Changes
### Tracking Code Configuration
- Add a new "Settings" tab in the Builder sidebar.
- Input fields for:
  - Google Analytics Measurement ID (G-XXXXXXX)
  - Facebook Pixel ID
  - Custom `<head>` scripts (for GTM, etc.)

### Automatic Event Tracking
- Update the page generation prompt to include `data-track-click="primary-cta"` attributes on primary buttons.
- Global script that listens for these attributes and pushes events to GA4/FB.

## Success Criteria
- Tracking codes correctly injected into the `<head>` of deployed sites.
- Primary CTA clicks triggering `conversion` events in the console (for verification).
- Settings persistent across page edits.

## Out of Scope
- Server-side tracking (API-based).
- Detailed analytics dashboard inside the builder (will use external tools for now).
