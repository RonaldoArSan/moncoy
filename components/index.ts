// Barrel export for main components
export * from './header'
export * from './auth-provider'
export * from './app-layout'
export * from './theme-provider'
export * from './theme-toggle'
export * from './profile'
export * from './profile-debug'
export * from './financial-summary'
export * from './plan-upgrade-card'
export * from './privacy-settings'
export * from './notifications-dropdown'
export * from './search-dropdown'
export * from './cookie-banner'
export * from './test-login'

// Auth guards - explicit exports to avoid conflicts
export { AuthGuard } from './auth-guard'
export { AuthGuard as AuthGuardAdvanced, AdminGuard, UserGuard, PublicGuard } from './auth-guards'

// Sidebar - explicit export to avoid UI conflict  
export { Sidebar } from './sidebar'

// AI components
export * from './ai-filters'
export * from './ai-stats'
export * from './ai-status-card'
export * from './ai-summary'

// Modal components - direct exports
export * from './modals/add-bank-account-modal'
export * from './modals/edit-transaction-modal'
export * from './modals/export-data-modal'
export * from './modals/export-modal'
export * from './modals/manage-categories-modal'
export * from './modals/new-goal-modal'
export * from './modals/new-investment-modal'
export * from './modals/new-transaction-modal'
export * from './modals/setup-2fa-modal'

// UI components (re-export without conflicting sidebar)
export * from './ui/button'
export * from './ui/card'
export * from './ui/input'
export * from './ui/label'
export * from './ui/badge'
export * from './ui/alert'
export * from './ui/dialog'
export * from './ui/select'
export * from './ui/textarea'
export * from './ui/separator'
export * from './ui/checkbox'
export * from './ui/avatar'
export * from './ui/progress'
export * from './ui/popover'
export * from './ui/toast'
export * from './ui/use-toast'
export { Toaster } from './ui/toaster'
export { Toaster as SonnerToaster } from './ui/sonner'