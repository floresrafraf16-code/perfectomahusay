<script setup>
definePageMeta({
  layout: false
})

const router = useRouter()
const { loginAdmin } = usePmccStore()

const loginDialog = ref(false)
const email = ref('admin@pmcc.edu.ph')
const password = ref('admin2026')
const showPassword = ref(false)
const errorMsg = ref('')

const handleAdminLogin = () => {
  const res = loginAdmin(email.value, password.value)
  if (!res.ok) {
    errorMsg.value = res.message
    return
  }
  errorMsg.value = ''
  loginDialog.value = false
  router.push('/dashboard')
}
</script>

<template>
  <v-app class="pmcc-web-glass">
    <!-- Rich Ambient Frosted Sage, Mint & Emerald Orbs -->
    <div class="web-orb-top" aria-hidden="true"></div>
    <div class="web-orb-left" aria-hidden="true"></div>
    <div class="web-orb-right" aria-hidden="true"></div>
    <div class="web-orb-bottom" aria-hidden="true"></div>

    <div class="web-viewport d-flex flex-column justify-space-between">
      <!-- Compact Frosted Top Header -->
      <header class="web-header px-4 px-md-8 pt-3 pb-1">
        <div class="web-container d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3">
            <div class="web-logo-box">
              <v-icon size="19" color="white">mdi-shield-account-outline</v-icon>
            </div>
            <div>
              <div class="text-subtitle-2 font-weight-extrabold text-grey-darken-4 leading-none">
                PMCC Admin
              </div>
              <div class="text-caption text-grey-darken-2 d-none d-sm-block" style="font-size: 11px !important;">
                Perfecto Mahusay Community College
              </div>
            </div>
          </div>

          <div class="web-term-pill d-flex align-center ga-2 px-3 py-1 rounded-pill">
            <span class="web-live-dot"></span>
            <span>AY 2026–2027</span>
          </div>
        </div>
      </header>

      <!-- Centered Stage: Hero Card + Nearby Soft-Rounded Feature Cards -->
      <main class="web-main d-flex align-center px-4 px-md-8 py-2">
        <div class="web-container d-flex flex-column ga-5">
          <div class="web-hero-glass pa-6 pa-sm-8 pa-md-9 text-center mx-auto" style="max-width: 800px; width: 100%;">
            <div class="web-badge-pill d-inline-flex align-center ga-2 px-4 py-1 rounded-pill mb-4">
              <v-icon size="14" color="#1a6e37">mdi-lock-outline</v-icon>
              <span>Protected Admin Enrollment & Accounting Portal</span>
            </div>

            <h1
              class="text-h4 sm:text-h3 text-md-h2 font-weight-extrabold text-grey-darken-4 mb-3"
              style="line-height: 1.04; letter-spacing: -0.025em;"
            >
              Enroll Smarter.<br />
              Assess Faster.<br />
              <span class="web-serif">Account Better.</span>
            </h1>

            <p
              class="text-body-2 text-sm-body-1 text-grey-darken-2 mx-auto mb-6"
              style="max-width: 560px; line-height: 1.58;"
            >
              Automated tuition & scholarship assessment, real-time Accounts Receivable subsidiary ledgers,
              exam permit clearance, and printable statements for Perfecto Mahusay Community College.
            </p>

            <div class="d-flex flex-column align-center ga-2">
              <v-btn
                size="large"
                color="#141c18"
                variant="flat"
                class="text-none rounded-pill text-white font-weight-bold px-8 web-cta-btn"
                prepend-icon="mdi-login"
                @click="loginDialog = true"
              >
                Sign In to Admin Portal
              </v-btn>
              <span class="text-caption text-grey-darken-2 font-weight-semibold" style="font-size: 11px !important;">
                Single Admin Access • Route Middleware Protected
              </span>
            </div>
          </div>

          <!-- Raised & Soft-Rounded 4-Card Frosted Strip -->
          <div class="mx-auto" style="max-width: 980px; width: 100%;">
            <v-row dense>
              <v-col cols="12" sm="6" md="3">
                <div class="web-feature-glass py-2 px-3 d-flex align-center ga-2">
                  <div class="web-feat-icon">
                    <v-icon size="16" color="#141c18">mdi-calculator-variant-outline</v-icon>
                  </div>
                  <div>
                    <div class="text-caption font-weight-extrabold text-grey-darken-4 leading-tight">Auto Fee Assessment</div>
                    <div class="text-caption text-grey-darken-2" style="font-size: 10px !important; line-height: 1.2;">
                      Tuition, lab, misc & discounts
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <div class="web-feature-glass py-2 px-3 d-flex align-center ga-2">
                  <div class="web-feat-icon">
                    <v-icon size="16" color="#141c18">mdi-shield-check-outline</v-icon>
                  </div>
                  <div>
                    <div class="text-caption font-weight-extrabold text-grey-darken-4 leading-tight">Permit Hold Control</div>
                    <div class="text-caption text-grey-darken-2" style="font-size: 10px !important; line-height: 1.2;">
                      Automatic balance clearance
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <div class="web-feature-glass py-2 px-3 d-flex align-center ga-2">
                  <div class="web-feat-icon">
                    <v-icon size="16" color="#141c18">mdi-scale-balance</v-icon>
                  </div>
                  <div>
                    <div class="text-caption font-weight-extrabold text-grey-darken-4 leading-tight">Subsidiary Ledger</div>
                    <div class="text-caption text-grey-darken-2" style="font-size: 10px !important; line-height: 1.2;">
                      Matched to AR control total
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <div class="web-feature-glass py-2 px-3 d-flex align-center ga-2">
                  <div class="web-feat-icon">
                    <v-icon size="16" color="#141c18">mdi-printer-outline</v-icon>
                  </div>
                  <div>
                    <div class="text-caption font-weight-extrabold text-grey-darken-4 leading-tight">SOA & Daily Reports</div>
                    <div class="text-caption text-grey-darken-2" style="font-size: 10px !important; line-height: 1.2;">
                      Print-ready receipts & logs
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </main>

      <!-- Subtle Bottom Breathing Spacer -->
      <div class="pb-3" aria-hidden="true"></div>
    </div>

    <!-- Single-Admin Frosted Glass Login Modal -->
    <v-dialog v-model="loginDialog" max-width="420">
      <v-card class="web-login-modal pa-6 pa-sm-7">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center ga-3">
            <div class="web-logo-box">
              <v-icon size="20" color="white">mdi-shield-account-outline</v-icon>
            </div>
            <div>
              <div class="text-caption font-weight-bold text-green-darken-3" style="letter-spacing: 0.6px;">
                ADMIN ACCESS
              </div>
              <h3 class="text-h6 font-weight-extrabold text-grey-darken-4 leading-tight">
                Sign In
              </h3>
            </div>
          </div>
          <v-btn icon="mdi-close" size="small" variant="text" color="grey-darken-3" @click="loginDialog = false" />
        </div>

        <p class="text-body-2 text-grey-darken-2 mb-4">
          Enter your PMCC Administrator credentials to unlock the workspace.
        </p>

        <v-text-field
          v-model="email"
          label="Admin Email"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-email-outline"
          class="mb-3"
          @keyup.enter="handleAdminLogin"
        />

        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          class="mb-3"
          @click:append-inner="showPassword = !showPassword"
          @keyup.enter="handleAdminLogin"
        />

        <v-alert
          v-if="errorMsg"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          {{ errorMsg }}
        </v-alert>

        <v-btn
          block
          size="large"
          color="#141c18"
          variant="flat"
          class="text-none rounded-pill text-white font-weight-bold"
          prepend-icon="mdi-login"
          @click="handleAdminLogin"
        >
          Sign In as Admin
        </v-btn>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pmcc-web-glass {
  background:
    radial-gradient(circle at 18% 15%, rgba(116, 194, 132, 0.36) 0%, transparent 45%),
    radial-gradient(circle at 86% 24%, rgba(78, 166, 138, 0.28) 0%, transparent 48%),
    radial-gradient(circle at 52% 92%, rgba(132, 202, 144, 0.32) 0%, transparent 52%),
    linear-gradient(155deg, #c7e2c4 0%, #e7f3e6 50%, #d5e9dc 100%) !important;
  color: #111827 !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  min-height: 100dvh;
  position: relative;
}

.web-viewport {
  min-height: 100dvh;
  position: relative;
  z-index: 1;
}

@media (min-width: 960px) {
  .pmcc-web-glass,
  .web-viewport {
    height: 100dvh;
    overflow: hidden;
  }
}

.web-orb-top {
  position: fixed;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 780px;
  height: 360px;
  background: radial-gradient(circle, rgba(64, 162, 86, 0.34) 0%, transparent 72%);
  filter: blur(28px);
  pointer-events: none;
  z-index: 0;
}

.web-orb-left {
  position: fixed;
  top: 22%;
  left: -110px;
  width: 480px;
  height: 400px;
  background: radial-gradient(circle, rgba(54, 152, 78, 0.28) 0%, transparent 72%);
  filter: blur(26px);
  pointer-events: none;
  z-index: 0;
}

.web-orb-right {
  position: fixed;
  top: 18%;
  right: -110px;
  width: 460px;
  height: 380px;
  background: radial-gradient(circle, rgba(38, 136, 114, 0.25) 0%, transparent 72%);
  filter: blur(28px);
  pointer-events: none;
  z-index: 0;
}

.web-orb-bottom {
  position: fixed;
  bottom: -140px;
  left: 25%;
  width: 600px;
  height: 380px;
  background: radial-gradient(circle, rgba(84, 174, 102, 0.28) 0%, transparent 72%);
  filter: blur(30px);
  pointer-events: none;
  z-index: 0;
}

.web-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.web-logo-box {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(145deg, #1b2821, #0f1612);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 10px 22px rgba(20, 28, 24, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.web-term-pill {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.72), rgba(235, 248, 236, 0.46));
  backdrop-filter: blur(20px) saturate(165%);
  -webkit-backdrop-filter: blur(20px) saturate(165%);
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow:
    0 6px 18px rgba(20, 42, 28, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.98);
  font-size: 12px;
  font-weight: 700;
  color: #163320;
}

.web-hero-glass {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.62) 0%,
    rgba(246, 252, 247, 0.44) 55%,
    rgba(232, 246, 236, 0.56) 100%
  ) !important;
  backdrop-filter: blur(30px) saturate(175%) !important;
  -webkit-backdrop-filter: blur(30px) saturate(175%) !important;
  border: 1px solid rgba(255, 255, 255, 0.92) !important;
  box-shadow:
    0 26px 64px rgba(18, 44, 28, 0.12),
    0 4px 16px rgba(18, 44, 28, 0.05),
    inset 0 1.5px 0 rgba(255, 255, 255, 0.98),
    inset 0 -1px 0 rgba(255, 255, 255, 0.55) !important;
  border-radius: 34px !important;
}

.web-badge-pill {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.86), rgba(226, 245, 231, 0.62));
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow:
    0 6px 16px rgba(20, 42, 28, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.98);
  font-size: 12px;
  font-weight: 700;
  color: #163320;
}

.web-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22a04b;
  box-shadow: 0 0 8px rgba(34, 160, 75, 0.65);
}

.web-serif {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-weight: 400;
}

.web-cta-btn {
  background: linear-gradient(145deg, #1b2821, #101713) !important;
  box-shadow: 0 14px 30px rgba(20, 28, 24, 0.24) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.web-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(20, 28, 24, 0.3) !important;
}

.web-feature-glass {
  border-radius: 22px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.62), rgba(240, 250, 242, 0.44));
  backdrop-filter: blur(20px) saturate(165%);
  -webkit-backdrop-filter: blur(20px) saturate(165%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 10px 24px rgba(18, 44, 28, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.98);
  transition: transform 0.2s ease, background 0.2s ease;
}

.web-feature-glass:hover {
  transform: translateY(-2px);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.76), rgba(244, 252, 246, 0.58));
}

.web-feat-icon {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.96);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.web-login-modal {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(26px) saturate(170%);
  -webkit-backdrop-filter: blur(26px) saturate(170%);
  border: 1px solid rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 24px 60px rgba(18, 44, 28, 0.18) !important;
  border-radius: 28px !important;
  color: #111827 !important;
}

:deep(.v-field) {
  background: rgba(248, 251, 248, 0.92) !important;
  border-radius: 14px !important;
}

:deep(.v-field input),
:deep(.v-field-label),
:deep(.v-label) {
  color: #111827 !important;
  -webkit-text-fill-color: #111827 !important;
  opacity: 1 !important;
}
</style>