# Data Privacy & Security Governance

## 1. PII Inventory & Data Handling
- **Student Data**: Student names, department identifiers, and graduation batch year (e.g. `CSE '25`) are displayed publicly within the campus innovation registry.
- **Email Contact**: Project leads share institutional email addresses for collaboration outreach. No private phone numbers or personal addresses are requested or stored.

## 2. Client Storage Policy
- **LocalStorage Usage**:
  - `idea_vault_upvotes`: Array of idea IDs voted on by the current browser session.
  - `idea_vault_interests`: Array of idea IDs for which collaboration interest was expressed.
  - `idea_vault_custom_ideas`: Array of locally submitted ideas in mock mode.
- **No Credentials in Storage**: No passwords, tokens, or private secrets are written to `localStorage`.

## 3. Data Sanitization
- User inputs in project title, description, and tags are HTML-escaped before insertion into the DOM to prevent Cross-Site Scripting (XSS).
