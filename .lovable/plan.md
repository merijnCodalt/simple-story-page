
# Dynamic Lovable Project Web Component Loader

## Overview

This plan implements a system to dynamically import web components from whitelisted Lovable projects. The whitelist will be stored in Supabase, and components will be loaded via UMD script tags at runtime.

## Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Your Application                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌─────────────────┐    ┌────────────────┐  │
│  │   Supabase   │───>│  ComponentLoader │───>│  Dynamic Load  │  │
│  │  (Whitelist) │    │     Service      │    │   <script>     │  │
│  └──────────────┘    └─────────────────┘    └────────────────┘  │
│                                                                  │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │  Custom Element  │                          │
│                    │  <project-xyz>   │                          │
│                    └─────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Enable Lovable Cloud

Before implementing the database, we need to enable Lovable Cloud to get access to Supabase.

### Step 2: Create Database Schema

Create a `whitelisted_projects` table to store approved Lovable project configurations:

**Table: `whitelisted_projects`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| project_id | text | Lovable project ID (unique) |
| project_name | text | Display name |
| component_url | text | URL to UMD bundle |
| element_name | text | Custom element tag name |
| is_active | boolean | Enable/disable loading |
| created_at | timestamp | Creation timestamp |

### Step 3: Create Component Loader Service

Build a TypeScript service (`src/lib/component-loader.ts`) that:

1. Fetches the whitelist from Supabase
2. Validates URLs against the whitelist before loading
3. Dynamically injects `<script>` tags to load UMD bundles
4. Tracks loaded components to prevent duplicate loading
5. Returns a promise that resolves when the component is registered

```text
loadComponent(projectId)
       │
       ▼
┌──────────────────┐
│ Fetch whitelist  │
│ from Supabase    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     NO
│ Is project in    │─────────> Reject with error
│ whitelist?       │
└────────┬─────────┘
         │ YES
         ▼
┌──────────────────┐     YES
│ Already loaded?  │─────────> Return cached element name
└────────┬─────────┘
         │ NO
         ▼
┌──────────────────┐
│ Inject <script>  │
│ tag for UMD      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Wait for custom  │
│ element defined  │
└────────┬─────────┘
         │
         ▼
   Return element name
```

### Step 4: Create React Hook

Create a custom hook (`src/hooks/use-remote-component.ts`) for easy component loading:

- `useRemoteComponent(projectId)` - Returns loading state and element name
- Handles async loading with proper React lifecycle
- Provides error handling and retry capability

### Step 5: Create Dynamic Component Wrapper

Build a React component (`src/components/RemoteComponent.tsx`) that:

- Uses the hook to load the remote component
- Renders a loading skeleton while fetching
- Displays error states gracefully
- Renders the custom element once loaded
- Passes through attributes as props

### Step 6: Admin Management Page

Create an admin page (`src/pages/Admin.tsx`) to manage the whitelist:

- View all whitelisted projects
- Add new projects with validation
- Edit existing entries
- Toggle active/inactive status
- Delete entries

### Step 7: Demo/Usage Page

Update the Index page to demonstrate loading remote components:

- Show a list of available whitelisted components
- Allow users to load and preview components
- Display the loaded web components dynamically

## Security Considerations

1. **URL Validation**: Only load scripts from `*.lovable.app` domains
2. **Whitelist Enforcement**: Server-side validation via RLS policies
3. **CSP Headers**: Configure Content Security Policy to allow only trusted sources
4. **Active Flag**: Ability to quickly disable a component without deletion

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `supabase/migrations/*_create_whitelisted_projects.sql` | Create | Database schema |
| `src/lib/component-loader.ts` | Create | Core loading logic |
| `src/hooks/use-remote-component.ts` | Create | React hook for loading |
| `src/components/RemoteComponent.tsx` | Create | Wrapper component |
| `src/pages/Admin.tsx` | Create | Whitelist management UI |
| `src/pages/Index.tsx` | Modify | Demo usage |
| `src/App.tsx` | Modify | Add admin route |
| `src/integrations/supabase/types.ts` | Modify | Add TypeScript types |

## Usage Example

Once implemented, using a remote component will be as simple as:

```tsx
import RemoteComponent from '@/components/RemoteComponent';

function MyPage() {
  return (
    <div>
      <h1>My App</h1>
      
      {/* Load a whitelisted Lovable project component */}
      <RemoteComponent 
        projectId="abc123"
        title="Custom Title"
        description="Custom description"
      />
    </div>
  );
}
```

## Technical Details

### Component Loader Service API

```typescript
interface WhitelistedProject {
  id: string;
  project_id: string;
  project_name: string;
  component_url: string;
  element_name: string;
  is_active: boolean;
}

class ComponentLoader {
  // Load a component by project ID
  async load(projectId: string): Promise<string>;
  
  // Get all whitelisted projects
  async getWhitelist(): Promise<WhitelistedProject[]>;
  
  // Check if a component is already loaded
  isLoaded(projectId: string): boolean;
}
```

### Database RLS Policies

- **SELECT**: Allow authenticated users to read active projects
- **INSERT/UPDATE/DELETE**: Restrict to admin users only

This ensures regular users can load components but cannot modify the whitelist.
