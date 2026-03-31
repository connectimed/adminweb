# Entrepreneurs Panel — Design Spec

**Date:** 2026-03-31  
**Project:** IMEDConnect Admin Web  
**Status:** Approved

---

## Overview

Add a dedicated `EntrepreneursPanel` component to the admin dashboard that lets admins filter and export Entrepreneur user data to Excel. Entrepreneurs are a new user type added to the main IMEDConnect platform (stored as `user_type: "Entrepreneur"` in the shared `Users` Firestore collection).

---

## Architecture

### New file
`components/EntrepreneursPanel.jsx`

Follows the same card pattern as `UsersPanel`, `ApplicationsPanel`, `ModulesPanel`, and `ExaminationsPanel`. Self-contained: owns its own Firestore query, filter state, and export logic.

### Dashboard placement
`app/(root)/page.jsx` — add a new third row (full-width, single column) below the existing two rows.

---

## Firestore Query

Collection: `Users`

```
where("user_type", "==", "Entrepreneur")
where("user_profile_setup_step", "in", statusArray)
```

`statusArray` values by filter selection:
- All → `["6", "10"]`
- Approved → `["10"]`
- Pending → `["6"]`

Sector filter is applied **client-side** on the fetched results to avoid requiring a composite Firestore index.

---

## Filters

**Status** (controls Firestore query):
- All (default)
- Approved (`user_profile_setup_step === "10"`)
- Pending (`user_profile_setup_step === "6"`)

**Sector** (client-side filter on `user_preferred_sector_to_specialize`):
- All (default)
- Agriculture
- Livestock
- Fishing
- Processing
- Services
- Trade
- Other

---

## Excel Export

Filename: `entrepreneurs_export.xlsx`  
Sheet name: `Entrepreneurs`

| Column | Firestore field | Notes |
|--------|----------------|-------|
| Name | `user_full_name` | |
| Phone | `user_phone` | |
| Email | `user_email` | |
| Sex | `user_sex` | |
| Date of Birth | `user_birth_date` | Formatted `dd MMM yyyy` via `toLocaleDateString` |
| Region | `user_region` | |
| District | `user_district` | |
| Business Name | `user_highest_institution_name` | |
| Sector | `user_preferred_sector_to_specialize` | |
| Main Activity | `user_business_ownership_details` | |
| Formalization Status | `user_business_is_formalized` | |
| Years in Operation | `user_business_started` | |
| Number of Employees | `user_business_plan` | |
| Monthly Revenue | `user_monthly_income` | |
| Business Challenges | `user_areas_of_interest` | Array → comma-joined string |
| Received Support Before | `user_has_received_support` | |
| Support Needed | `user_available_times` | Array → comma-joined string |
| TIN / Reg No. | `user_current_mo` | |
| Has Disability | `user_has_disability` | |
| Application Status | derived | `"Approved"` if `user_profile_setup_step === "10"`, else `"Pending"` |
| Registration Date | `user_creation_date` | Formatted `dd MMM yyyy` via `toLocaleDateString` |

Missing/empty values fall back to `""`.

---

## UI Structure

Matches the card pattern of existing panels:

```
┌─────────────────────────────────────────────────────┐
│ Entrepreneurs panel          [↓ download button]    │
│ Define entrepreneur data you want to export         │
├─────────────────────────────────────────────────────┤
│ Select status                                       │
│ [All] [Approved] [Pending]                          │
│                                                     │
│ Select sector                                       │
│ [All] [Agriculture] [Livestock] [Fishing]           │
│ [Processing] [Services] [Trade] [Other]             │
│                                                     │
│ ℹ You are about to export N entrepreneurs.          │
└─────────────────────────────────────────────────────┘
```

- Active filter chip: `bg-deep-dark text-white`
- Inactive chip: `bg-white text-gray-700 border-gray-300`
- Card background: `bg-gray-300 rounded-2xl`
- Download icon: `ArrowDownTrayIcon` from `@heroicons/react/24/solid`
- Count info box: `InformationCircleIcon` from `@heroicons/react/24/outline`

---

## State

| State var | Type | Purpose |
|-----------|------|---------|
| `loading` | boolean | Disable interaction during fetch/export |
| `selectedStatus` | string | `"All"` \| `"Approved"` \| `"Pending"` |
| `selectedSector` | string | `"All"` \| sector name |
| `users` | array | Raw Firestore results |
| `filteredUsers` | derived | `users` filtered by `selectedSector` |

`filteredUsers` is derived via `useMemo` from `users` + `selectedSector`. The download button operates on `filteredUsers`.

---

## Files Changed

| File | Change |
|------|--------|
| `components/EntrepreneursPanel.jsx` | **New** — full panel component |
| `app/(root)/page.jsx` | Import and render `EntrepreneursPanel` in a new third row |
