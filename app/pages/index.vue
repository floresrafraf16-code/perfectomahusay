<script setup>
definePageMeta({
  layout: false
})

const username = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

// Snackbar States
const snackbar = ref(false)
const snackText = ref('')
const snackColor = ref('')

const MY_USERNAME = 'enrollpro'   
const MY_PASSWORD = '1234' 

const handleLogin = () => {
  if (!username.value || !password.value) {
    // Palitan ang alert ng Snackbar
    snackText.value = 'Please fill in all fields.'
    snackColor.value = 'warning'
    snackbar.value = true
    return
  }

  loading.value = true

  // Fake delay para sa professional effect
  setTimeout(() => {
    if (username.value === MY_USERNAME && password.value === MY_PASSWORD) {
      router.push('/dashboard')
    } else {
      // Palitan ang alert ng Snackbar
      snackText.value = 'Invalid Username or Password! Check your credentials.'
      snackColor.value = 'error'
      snackbar.value = true
      
      loading.value = false
      password.value = '' 
    }
  }, 1500)
}
</script>

<template>
  <v-app>
    <v-main class="login-bg d-flex align-center justify-center">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="4">
            
            <v-card class="glass-card pa-10 text-center" elevation="0">
              
              <div class="mb-6">
                <v-img
                  src="/logo.png"
                  alt="Enroll Pro Logo"
                  height="120"
                  class="mb-4 mx-auto"
                  contain
                ></v-img>
                <h1 class="text-h4 font-weight-bold text-white mb-1">ENROLL PRO</h1>
                <p class="text-subtitle-2 text-grey-lighten-1">Simplified Student Enrollment</p>
              </div>

              <v-card-text class="pa-0">
                <v-text-field 
                  v-model="username" 
                  label="Username" 
                  prepend-inner-icon="mdi-account-circle-outline" 
                  variant="outlined" 
                  color="white"
                  base-color="white"
                  class="custom-input mb-4"
                  hide-details
                />
                <v-text-field 
                  v-model="password" 
                  label="Password" 
                  prepend-inner-icon="mdi-shield-lock-outline" 
                  type="password" 
                  variant="outlined" 
                  color="white"
                  base-color="white"
                  class="custom-input mb-6"
                  hide-details
                  @keyup.enter="handleLogin"
                />
              </v-card-text>

              <v-card-actions class="pa-0 flex-column">
                <v-btn 
                  block 
                  :loading="loading"
                  color="blue-darken-1" 
                  size="x-large" 
                  variant="flat" 
                  class="login-btn mb-6"
                  @click="handleLogin"
                >
                  Sign In
                </v-btn>
                
                <div class="text-caption text-grey-lighten-2">
                  System Version 1.0.4 | 
                  <span class="text-blue-lighten-3 font-weight-bold" style="cursor:pointer">
                    Forgot Password?
                  </span>
                </div>
              </v-card-actions>
            </v-card>

          </v-col>
        </v-row>
      </v-container>

      <v-snackbar
        v-model="snackbar"
        :color="snackColor"
        :timeout="3000"
        rounded="lg"
        elevation="24"
      >
        <div class="d-flex align-center">
          <v-icon class="me-3">{{ snackColor === 'error' ? 'mdi-alert-circle' : 'mdi-information' }}</v-icon>
          {{ snackText }}
        </div>
        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar = false">CLOSE</v-btn>
        </template>
      </v-snackbar>

    </v-main>
  </v-app>
</template>

<style scoped>
/* Keeping your beautiful CSS exactly as it is */
.login-bg {
  background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.85)), 
              url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000');
  background-size: cover;
  background-position: center;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(25px) saturate(160%);
  -webkit-backdrop-filter: blur(25px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 40px !important;
}

:deep(.custom-input .v-field) {
  border-radius: 16px !important;
  color: white !important;
  background: rgba(255, 255, 255, 0.03) !important;
}

:deep(.v-label.v-field-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.login-btn {
  border-radius: 16px !important;
  text-transform: none !important;
  font-weight: bold !important;
  letter-spacing: 0.8px !important;
  transition: transform 0.2s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
}
</style>