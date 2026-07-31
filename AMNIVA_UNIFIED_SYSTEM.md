# Amniva Unified Module System

## Overview
The Amniva platform is now powered by a unified architecture that dynamically connects the Admin Dashboard, User Dashboard, and Frontend using Appwrite as the backend. This system enables seamless management and execution of AI engines (Dipa, Prediction, Verify, Report, Trending) with real-time synchronization, health monitoring, and extensibility.

## Architecture

### Core Components

#### 1. **Component Registry** (`component_registry` table)
Central database storing all engine configurations:
- `name`: Unique module identifier (e.g., `prediction`, `verify`)
- `display_name`: Human-readable name
- `description`: Module description
- `endpoint`: Appwrite Function ID or external URL
- `api_type`: `internal` (Appwrite) or `external` (third-party API)
- `enabled`: Toggle for active/inactive state
- `permissions`: Array of roles allowed to access

#### 2. **Central Middleware** (`executeModule` function)
- **Path**: `functions/executeModule/index.ts`
- **Purpose**: Universal router for all module requests
- **Flow**:
  1. Validates user session
  2. Fetches module config from `component_registry`
  3. Checks user permissions
  4. Routes to internal function or external API
  5. Logs interaction to `interaction_logs`
  6. Returns standardized response

#### 3. **Module Discovery** (`fetchUserComponents` function)
- **Path**: `functions/fetchUserComponents/index.ts`
- **Purpose**: Returns list of modules user has access to
- **Features**:
  - Filters by user role/permissions
  - Returns only enabled modules
  - Sorts by display order

#### 4. **Health Monitoring** (`systemMonitor` function)
- **Path**: `functions/systemMonitor/index.ts`
- **Purpose**: Background health checks for all engines
- **Features**:
  - Pings each module endpoint
  - Measures response times
  - Updates `api_health` table
  - Stores system-wide metrics in `system_health`
  - Auto-alerts on critical failures (>50% offline)

### Database Schema

#### Tables Created
```sql
component_registry    -- Module configurations
api_health           -- Real-time module health status
system_health        -- Historical health metrics
interaction_logs     -- User interaction audit trail
```

#### Row Level Security (RLS)
- ✅ **component_registry**: Public read for enabled modules, admin-only write
- ✅ **api_health**: Admin-only read, system write
- ✅ **system_health**: Admin-only read, system write
- ✅ **interaction_logs**: Users see own logs, admins see all

### Frontend Components

#### 1. **ModuleLoader** (`src/components/ModuleLoader.tsx`)
Dynamic module renderer that:
- Fetches user's available modules via `fetchUserComponents`
- Displays as responsive cards
- Shows category, status, API type
- Triggers module-specific interface on click

#### 2. **UniversalModuleInterface** (`src/components/UniversalModuleInterface.tsx`)
Generic submission handler that:
- Renders dynamic input fields based on module's `input_format`
- Submits via `executeModule` function
- Displays standardized results
- Shows processing time and status

#### 3. **SystemHealthPanel** (`src/components/admin/SystemHealthPanel.tsx`)
Admin dashboard showing:
- Health score percentage
- Active/offline module counts
- Average response times
- Per-module status (active/delayed/offline)
- Auto-refresh every 2 minutes

### Client SDK

#### Module Registry (`src/lib/moduleRegistry.ts`)
Convenient methods for frontend:
```typescript
// Fetch user's modules
fetchUserModules(): Promise<ModuleInfo[]>

// Execute any module
executeModule(moduleName, input): Promise<ModuleResponse>

// Convenience wrappers
executeDipa(message)
executePrediction(data)
executeVerify(content)
executeReport(data)
executeTrending(filters)
```

#### Custom Hook (`src/hooks/useModuleExecution.ts`)
React hook for module execution:
```typescript
const { execute, loading, result, error } = useModuleExecution({
  onSuccess: (result) => { /* ... */ },
  onError: (error) => { /* ... */ }
});

await execute('prediction', { context: '...' });
```

## User Flow Examples

### Example 1: User Chats with Dipa
```typescript
// Frontend
import { executeDipa } from '@/lib/moduleRegistry';

const response = await executeDipa("What is Amniva Verify?");
// Backend routes to amniva-verify function
// Returns: { success: true, data: { responseText: "..." }, processing_time_ms: 234 }
```

### Example 2: Admin Monitors Health
1. Admin opens System Settings → System Health tab
2. `SystemHealthPanel` calls `systemMonitor` function
3. Function checks all modules in `component_registry`
4. Updates `api_health` with current status
5. Panel displays real-time health metrics
6. Auto-refreshes every 2 minutes

### Example 3: Dynamic Module Execution
```typescript
// User clicks "Prediction Engine" card
// ModuleLoader passes module config to UniversalModuleInterface
// Interface renders fields: { context, timeframe, category }
// User submits
// Calls executeModule('prediction', input)
// Middleware validates, routes to amniva-prediction-engine
// Returns prediction results to UI
```

## Security & Access Control

### Authentication
- All functions validate Appwrite session
- Uses JWT from `Authorization` header
- Returns 401 if unauthenticated

### Authorization
- Module-level permissions via `permissions` field
- Checks user role against required permissions
- Returns 403 if insufficient access

### Audit Logging
Every module execution logs:
- User ID
- Module name
- Success/failure
- Error messages
- Processing time
- Timestamp

## Configuration Management

### Admin Dashboard Integration
1. **System Settings → Engines**: Configure external API URLs/keys
2. **System Settings → System Health**: Monitor all modules
3. Changes auto-save to Appwrite `component_registry`
4. Real-time sync across all sessions

### External API Configuration
For each engine:
- **Mode**: Internal / External / Merge
- **External API URL**: Third-party endpoint
- **External API Key**: Encrypted credential
- **Confidence Threshold**: Quality filter
- **Enabled**: Active toggle

## Adding New Modules

### Step 1: Create Function
```typescript
// functions/myNewEngine/index.ts
serve(async (req) => {
  // Your logic here
  return Response.json({ data: result });
});
```

### Step 2: Register in Database
```sql
INSERT INTO component_registry (name, display_name, description, category, icon, endpoint, api_type)
VALUES ('my_new_engine', 'My Engine', 'Does amazing things', 'AI', 'zap', 'myNewEngine', 'internal');
```

### Step 3: It's Live!
- Automatically appears in `ModuleLoader`
- Users can execute via `executeModule('my_new_engine', input)`
- Health monitoring starts automatically
- No frontend code changes needed

## Monitoring & Maintenance

### Health Check Schedule
- Auto-runs every 2 minutes (configurable)
- Checks all enabled modules
- Stores historical data in `system_health`
- Alerts if >50% modules offline

### API Health Status
- **Active**: Response time < 2s, HTTP 200
- **Delayed**: Response time > 2s, HTTP 200
- **Offline**: Timeout or HTTP error

### Maintenance Tasks
1. Review `system_health` weekly for trends
2. Investigate modules frequently in "delayed" state
3. Archive old `interaction_logs` monthly
4. Monitor `api_health` for external API issues

## Files Changed/Created

### Backend Functions
- ✅ `functions/executeModule/index.ts` - Central middleware
- ✅ `functions/fetchUserComponents/index.ts` - Module discovery
- ✅ `functions/systemMonitor/index.ts` - Health monitoring

### Frontend Components
- ✅ `src/components/ModuleLoader.tsx` - Dynamic module cards
- ✅ `src/components/UniversalModuleInterface.tsx` - Generic submission
- ✅ `src/components/admin/SystemHealthPanel.tsx` - Health dashboard

### Libraries & Hooks
- ✅ `src/lib/moduleRegistry.ts` - Client SDK
- ✅ `src/lib/healthMonitor.ts` - Health utilities
- ✅ `src/hooks/useModuleExecution.ts` - React hook

### Database
- ✅ `sql/01_create_module_system_tables.sql` - Schema + RLS

### Integration Points
- ✅ `src/pages/UserDashboard.tsx` - Added dynamic module loader
- ✅ `src/components/admin/SystemSettings.tsx` - Added health panel tab

## Testing Checklist

### Module Execution
- [ ] Non-admin user can see only permitted modules
- [ ] Admin user sees all modules
- [ ] Module execution returns data correctly
- [ ] Errors are logged to `interaction_logs`
- [ ] Processing time is measured

### Health Monitoring
- [ ] `systemMonitor` runs successfully
- [ ] All modules show correct status
- [ ] Response times are accurate
- [ ] Offline modules are detected
- [ ] Admin panel displays health data

### Security
- [ ] Unauthenticated requests return 401
- [ ] Unauthorized module access returns 403
- [ ] External API keys are not exposed
- [ ] RLS policies prevent unauthorized access

### Configuration
- [ ] Engine settings save to Appwrite
- [ ] Settings persist across sessions
- [ ] External API credentials work
- [ ] Mode switches (internal/external) work

## Next Steps

1. **Deploy**: Run initial health check after deployment
2. **Configure**: Set external API URLs/keys in Admin → System Settings → Engines
3. **Monitor**: Check System Health panel daily for first week
4. **Optimize**: Review `interaction_logs` to identify slow modules
5. **Expand**: Add new engines as needed (fully extensible)

## Support

For issues or questions:
- Check `interaction_logs` for error details
- Review `api_health` for module-specific problems
- Contact system administrator for access issues
- Consult Appwrite logs for function errors

---

**System Status**: ✅ Active and operational
**Last Updated**: 2025-11-06
**Version**: 1.0.0
