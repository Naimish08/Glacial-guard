# Role-Based Authentication System

## How It Works

The Glacial Guard application uses a role-based authentication system with two user types:

### 1. **Admin Users**
- **Access**: Full administrative dashboard with advanced features
- **Features**: 
  - Model Input Form for on-demand risk predictions
  - Advanced alert management
  - Full system controls
- **Identification**: Email contains "admin" (for testing) or has admin role in metadata

### 2. **Citizen Users**
- **Access**: Citizen dashboard with public information
- **Features**:
  - View alerts and reports
  - Community section
  - Basic map and alert information
- **Identification**: All other users default to citizen role

## Testing the System

### To Test as Admin:
1. Create an account with email containing "admin" (e.g., `admin@test.com`)
2. Login with that account
3. You should be redirected to `/admin` dashboard
4. The AlertsSection will show the ModelInputForm in the "IoT Sensors" tab

### To Test as Citizen:
1. Create an account with any other email (e.g., `user@test.com`)
2. Login with that account
3. You should be redirected to `/citizen` dashboard
4. The AlertsSection will NOT show the ModelInputForm

## Role Detection Logic

The system checks for roles in this order:
1. `user.app_metadata.role`
2. `user.user_metadata.role`
3. `user.user_metadata.user_role`
4. `user.role`
5. Email contains "admin" (testing fallback)

## Debugging

Check the browser console for role assignment logs:
- 🔑 Admin role assigned
- 👤 Citizen role assigned
- 🚀 Routing information

## Production Setup

For production, remove the email-based admin detection and use proper role management through:
- Supabase RLS (Row Level Security)
- Database role tables
- Proper user metadata management
