export default ({ app, store, redirect }) => {
  if (app.$keycloak.authenticated) {
    return true
  }

  return new Promise((resolve, reject) => {
    app.$keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: true
      })
      .then(async (auth) => {
        if (!auth) {
          store.dispatch('auth/clearToken')

          return redirect('/login')
        }

        setInterval(() => {
          app.$keycloak
            .updateToken(5)
            .then((refreshed) => {
              if (refreshed) {
                // console.log('Token refreshed ' + refreshed)

                store.dispatch('auth/saveToken', {
                  token: app.$keycloak.token
                })

                app.$axios.setToken(app.$keycloak.token, 'Bearer')
              } else {
                // console.log('Token not refreshed, valid for ' + Math.round(app.$keycloak.tokenParsed.exp + app.$keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds')
              }
            })
            .catch(() => {
              // console.log('Failed to refresh token')
            })
        }, 60000)

        const userRealmAccess = app.$keycloak.realmAccess
        const userResourceAccess = app.$keycloak.resourceAccess

        if (
          typeof userResourceAccess === 'undefined' ||
          typeof userResourceAccess[process.env.keycloakClientId] ===
            'undefined'
        ) {
          alert('Anda tidak mempunyai akses ke aplikasi ini.')
          return app.$keycloak.logout()
        }

        const userProfile = await app.$keycloak.loadUserProfile()

        let userRole = null

        if (userRealmAccess) {
          userRole = userRealmAccess.roles[0]
        }

        const userPermissions =
          userResourceAccess[process.env.keycloakClientId].roles

        store.dispatch('auth/updateUserSSO', {
          profile: userProfile,
          role: userRole,
          permissions: userPermissions
        })

        store.dispatch('auth/saveToken', {
          token: app.$keycloak.token
        })

        app.$axios.setToken(app.$keycloak.token, 'Bearer')

        return resolve()
      })
      .catch(reject)
  })
}
