<template>
  <v-app id="pikobar-admin">
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" fixed app>
      <v-list nav>
        <v-list-item id="main-logo" :class="miniVariant && 'logo__small'">
          <v-img src="/pikobar-logo.png" />
        </v-list-item>
        <v-list-item two-line :class="miniVariant && 'px-0'">
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ user.firstName }} {{ user.lastName }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ roleLabel }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense :class="!miniVariant && 'px-0'" class="pikobar-nav">
        <v-list-item-group v-model="activeItem" color="primary">
          <nuxt-link v-for="(item, i) in items" :key="i" :to="item.to">
            <v-list-item
              v-if="permissions.includes(item.permission)"
              :value="item.to"
              dense
              nuxt
              active-class="nav__active"
              :disabled="activeItem === item.to"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </nuxt-link>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-list-item dense :class="!miniVariant && 'pl-2'" @click="logout">
          <v-list-item-action>
            <v-icon class="mdi-rotate-180">mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Logout
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      activeItem: null,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
          permission: 'access-backoffice'
        },
        {
          icon: 'mdi-account-group',
          title: 'Calon Peserta',
          to: '/applicants',
          permission: 'list-applicants'
        },
        {
          icon: 'mdi-card-account-details-star',
          title: 'Daftar Peserta',
          to: '/applicants/approved',
          permission: 'list-applicants'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Pendaftaran Tes Masif'
    }
  },

  computed: {
    ...mapGetters('auth', ['user', 'roleLabel', 'permissions'])
  },

  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>
