<script setup>
const route = useRoute()
const router = useRouter()
const { resetDemoData, logoutAdmin } = usePmccStore()

const drawer = ref(true)
const rail = ref(false)
const resetDialog = ref(false)

const navItems = [
  {
    title: 'Dashboard',
    subtitle: 'Overview & Balances',
    icon: 'mdi-view-dashboard-outline',
    to: '/dashboard',
  },
  {
    title: 'Students & Scholars',
    subtitle: 'Profiles & Discounts',
    icon: 'mdi-account-group-outline',
    to: '/students',
  },
  {
    title: 'Subjects & Rates',
    subtitle: 'Units & Lab Fees',
    icon: 'mdi-book-open-page-variant-outline',
    to: '/courses',
  },
  {
    title: 'Enrollment & SOA',
    subtitle: 'Assessment & Permits',
    icon: 'mdi-file-document-edit-outline',
    to: '/enrollments',
  },
  {
    title: 'Cashier & Ledger',
    subtitle: 'Payments & Journals',
    icon: 'mdi-swap-horizontal',
    to: '/accounting',
  },
]

const handleReset = () => {
  resetDemoData()
  resetDialog.value = false
}

const handleLogout = () => {
  logoutAdmin()
  router.push('/')
}
</script>

<template>
  <v-app class="glass-app-shell">
    <!-- Ambient Glass Orbs -->
    <div class="glass-orb-top" aria-hidden="true"></div>
    <div class="glass-orb-right" aria-hidden="true"></div>

    <!-- Top Frosted Bar -->
    <v-app-bar flat class="glass-topbar px-2" border="b">
      <v-btn
        icon
        variant="text"
        color="grey-darken-4"
        class="mr-1"
        @click="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <div class="d-flex align-center ga-3">
        <div class="glass-brand-badge">
          <v-icon size="20" color="white">mdi-school-outline</v-icon>
        </div>
        <div>
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-4 leading-none">
            PMCC Glass
          </div>
          <div class="text-caption text-grey-darken-2 d-none d-sm-block" style="font-size: 10px !important;">
            Perfecto Mahusay Community College
          </div>
        </div>
      </div>

      <v-spacer />

      <div class="glass-status-pill d-none d-md-flex align-center ga-2 mr-3">
        <span class="glass-dot"></span>
        <span>Frosted Glass • Local Ledger</span>
      </div>

      <v-btn
        size="small"
        variant="outlined"
        color="grey-darken-3"
        class="text-none mr-2 rounded-pill font-weight-semibold glass-btn-outline"
        prepend-icon="mdi-refresh"
        @click="resetDialog = true"
      >
        Reset Demo
      </v-btn>

      <v-btn
        size="small"
        variant="flat"
        color="#141c18"
        class="text-none rounded-pill text-white font-weight-semibold"
        prepend-icon="mdi-logout"
        @click="handleLogout"
      >
        Exit
      </v-btn>
    </v-app-bar>

    <!-- Frosted Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      class="glass-sidebar"
      width="258"
    >
      <div class="pa-3 d-flex justify-end d-none d-lg-flex">
        <v-btn
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          size="x-small"
          variant="text"
          color="grey-darken-3"
          @click="rail = !rail"
        />
      </div>

      <v-list nav density="comfortable" class="px-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :active="route.path === item.to"
          rounded="xl"
          class="mb-2 glass-nav-item"
          active-class="glass-nav-active"
        >
          <template #prepend>
            <v-icon :icon="item.icon" size="21" />
          </template>
          <v-list-item-title class="text-body-2 font-weight-bold">
            {{ item.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption" style="font-size: 11px !important;">
            {{ item.subtitle }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <template #append>
        <div v-if="!rail" class="pa-4">
          <div class="glass-dark-badge pa-3 rounded-xl">
            <div class="text-caption font-weight-bold text-light-green-lighten-3 mb-1">
              Exam Permit Guard
            </div>
            <div class="text-caption text-grey-lighten-2" style="font-size: 11px !important; line-height: 1.4;">
              Automatic HOLD when balance > ₱0.00; CLEARED at ₱0.00.
            </div>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Workspace -->
    <v-main class="glass-main">
      <v-container fluid class="pa-4 pa-md-7" style="max-width: 1380px;">
        <slot />
      </v-container>
    </v-main>

    <!-- Reset Dialog -->
    <v-dialog v-model="resetDialog" max-width="400">
      <v-card class="glass-modal pa-6">
        <div class="text-h6 font-weight-bold text-grey-darken-4 mb-2">Reset Demo Data?</div>
        <p class="text-body-2 text-grey-darken-2 mb-5">
          Ibabalik nito sa default ang PMCC students, subjects, enrollment, payments, at journal entries.
        </p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" color="grey-darken-3" class="text-none rounded-pill" @click="resetDialog = false">
            Cancel
          </v-btn>
          <v-btn color="#141c18" variant="flat" class="text-none rounded-pill text-white px-5" @click="handleReset">
            Reset Data
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.glass-app-shell {
  background: linear-gradient(160deg, #dcead9 0%, #eef4ed 45%, #e5efe8 100%) !important;
  color: #111827 !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  position: relative;
}

.glass-orb-top {
  position: fixed;
  top: -120px;
  left: 20%;
  width: 680px;
  height: 360px;
  background: radial-gradient(circle, rgba(74, 158, 92, 0.28) 0%, transparent 72%);
  filter: blur(24px);
  pointer-events: none;
  z-index: 0;
}

.glass-orb-right {
  position: fixed;
  bottom: -120px;
  right: 8%;
  width: 560px;
  height: 340px;
  background: radial-gradient(circle, rgba(45, 122, 110, 0.2) 0%, transparent 72%);
  filter: blur(28px);
  pointer-events: none;
  z-index: 0;
}

.glass-topbar {
  background: rgba(255, 255, 255, 0.62) !important;
  backdrop-filter: blur(22px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(22px) saturate(160%) !important;
  border-color: rgba(255, 255, 255, 0.75) !important;
}

.glass-sidebar {
  background: rgba(255, 255, 255, 0.66) !important;
  backdrop-filter: blur(22px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(22px) saturate(160%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.72) !important;
}

.glass-main {
  position: relative;
  z-index: 1;
}

.glass-brand-badge {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(20, 28, 24, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-status-pill {
  font-size: 11px;
  font-weight: 600;
  color: #163320;
  background: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.85);
  padding: 5px 12px;
  border-radius: 999px;
}

.glass-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2e8b46;
  box-shadow: 0 0 8px rgba(46, 139, 70, 0.65);
}

.glass-btn-outline {
  background: rgba(255, 255, 255, 0.55) !important;
  backdrop-filter: blur(10px);
}

.glass-nav-item {
  color: #1f2937 !important;
  transition: all 0.2s ease;
}

.glass-nav-item:hover {
  background: rgba(255, 255, 255, 0.65) !important;
}

.glass-nav-active {
  background: rgba(20, 28, 24, 0.92) !important;
  color: #ffffff !important;
  box-shadow: 0 10px 24px rgba(20, 28, 24, 0.16);
}

.glass-nav-active .v-list-item-subtitle {
  color: #bbf7d0 !important;
}

.glass-dark-badge {
  background: rgba(20, 28, 24, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

/* Frosted Glass Cards & Modals */
.glass-panel {
  background: rgba(255, 255, 255, 0.66) !important;
  backdrop-filter: blur(22px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(22px) saturate(160%) !important;
  border: 1px solid rgba(255, 255, 255, 0.82) !important;
  border-radius: 24px !important;
  box-shadow: 0 12px 32px rgba(20, 40, 28, 0.06) !important;
  color: #111827 !important;
}

.glass-hero-dark {
  background: linear-gradient(135deg, rgba(18, 27, 22, 0.88), rgba(29, 49, 39, 0.84)) !important;
  backdrop-filter: blur(24px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
  border: 1px solid rgba(255, 255, 255, 0.24) !important;
  border-radius: 26px !important;
  color: #ffffff !important;
  box-shadow: 0 16px 36px rgba(17, 24, 39, 0.14) !important;
}

.glass-modal {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(26px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(26px) saturate(160%) !important;
  border: 1px solid rgba(255, 255, 255, 0.9) !important;
  border-radius: 26px !important;
  color: #111827 !important;
}

.glass-serif {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-weight: 400;
}

/* Crisp Readable Inputs & Selects inside Glass UI */
.v-field {
  background: rgba(255, 255, 255, 0.82) !important;
  border-radius: 14px !important;
  color: #111827 !important;
}

.v-field input,
.v-field textarea,
.v-select__selection-text,
.v-autocomplete__selection-text {
  color: #111827 !important;
  -webkit-text-fill-color: #111827 !important;
  opacity: 1 !important;
}

.v-field-label,
.v-label {
  color: #374151 !important;
  opacity: 1 !important;
}

@media print {
  .glass-topbar,
  .glass-sidebar,
  .glass-orb-top,
  .glass-orb-right,
  .no-print {
    display: none !important;
  }
  .glass-app-shell,
  .glass-main {
    background: #ffffff !important;
    color: #000000 !important;
    padding: 0 !important;
  }
}
</style>