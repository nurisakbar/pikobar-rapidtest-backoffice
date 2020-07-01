<template>
  <div>
    <h1>Sign In</h1>
    <v-btn @click="login">
      Login SSO
    </v-btn>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  middleware: 'guest',

  methods: {
    login() {
      this.$keycloak.login({ redirectUri: process.env.keycloakRedirectUri })
    }
  }
}
</script>
