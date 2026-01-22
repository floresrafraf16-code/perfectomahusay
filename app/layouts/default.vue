<template>
  <v-app class="glass-layout">
    <v-app-bar flat class="glass-header" border="b">
      <v-app-bar-title class="text-white font-weight-bold">
        <v-avatar size="32" class="mr-2">
          <v-img src="/logo.png"></v-img>
        </v-avatar>
        ENROLL PRO
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <span class="text-white text-caption mr-4">Admin Session Active</span>
    </v-app-bar>

    <v-navigation-drawer 
      v-model:rail="isRail"
      expand-on-hover 
      permanent 
      class="glass-sidebar"
    >
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/dashboard" />
        <v-list-item prepend-icon="mdi-school" title="Students" to="/students" />
        <v-list-item prepend-icon="mdi-book-open-variant" title="Courses" to="/courses" />
        <v-list-item prepend-icon="mdi-account-tie" title="Instructors" to="/instructors" />
        <v-list-item prepend-icon="mdi-clipboard-text-outline" title="Enrollments" to="/enrollments" />
      </v-list>
      
      <template v-slot:append>
        <div class="pa-2 mb-2 d-flex justify-center">
          <v-btn 
            block 
            class="logout-btn-glass" 
            @click="logoutDialog = true"
          >
            <v-icon size="24">mdi-logout</v-icon>
            <span v-if="!isRail" class="logout-text ml-2">Logout</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="main-bg">
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <v-dialog v-model="logoutDialog" max-width="400">
      <v-card class="glass-modal-modern pa-6 text-center">
        <v-avatar color="blue-darken-4" size="70" class="mb-4 shadow-glow">
          <v-icon size="40" color="blue-lighten-2">mdi-power</v-icon>
        </v-avatar>
        
        <h2 class="text-h5 text-white font-weight-bold mb-2">Logout Session</h2>
        <p class="text-body-1 text-grey-lighten-1 mb-6">
          Are you sure you want to exit <br> 
          <strong class="text-blue-lighten-3">Enroll Pro</strong>?
        </p>

        <div class="d-flex justify-center gap-4">
          <v-btn 
            variant="text" 
            color="white" 
            class="px-6"
            @click="logoutDialog = false"
          >
            CANCEL
          </v-btn>
          <v-btn 
            color="blue-darken-1" 
            variant="elevated" 
            rounded="lg" 
            class="px-8 font-weight-bold"
            @click="confirmLogout"
          >
            YES, LOGOUT
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
const router = useRouter()
const isRail = ref(true)
const logoutDialog = ref(false) // State para sa modern dialog

const confirmLogout = () => {
  logoutDialog.value = false
  // Professional delay bago lumabas
  setTimeout(() => {
    router.push('/')
  }, 300)
}
</script>

<style scoped>
/* Idagdag itong extra styles para sa Dialog consistency */
.glass-modal-modern {
  background: rgba(18, 18, 18, 0.95) !important;
  backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px !important;
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
}

.gap-4 {
  gap: 16px;
}

/* EXISTING STYLES MO - WALANG PAGBABAGO */
.main-bg {
  background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.9)), 
              url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
}

.glass-header {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.glass-sidebar {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(15px);
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

.logout-btn-glass {
  background: linear-gradient(45deg, rgba(33, 150, 243, 0.2), rgba(21, 101, 192, 0.4)) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(144, 202, 249, 0.3) !important;
  color: white !important;
  text-transform: none;
  font-weight: 600;
  transition: all 0.3s ease-in-out;
  min-width: 0 !important;
  height: 44px !important;
  border-radius: 8px !important;
}

.logout-btn-glass:hover {
  background: linear-gradient(45deg, rgba(33, 150, 243, 0.5), rgba(21, 101, 192, 0.7)) !important;
  box-shadow: 0 0 15px rgba(33, 150, 243, 0.4);
}

.logout-text {
  white-space: nowrap;
  font-size: 0.9rem;
}

:deep(.v-list-item) { color: white !important; }
:deep(.v-list-item--active) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #42A5F5 !important;
}
</style>