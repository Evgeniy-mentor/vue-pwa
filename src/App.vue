<template>
  <v-app>

      <v-navigation-drawer

              app
              v-model="drawer"
              :clipped="$vuetify.breakpoint.lgAndUp"
      >
        <v-list
                dense
                nav
                class="py-0"
        >
          <v-list-item two-line  >
          <div class="d-flex">
            <v-list-item-avatar  v-if="mini">
            <v-img
                    alt="Vuetify Logo"
                    class="user-picture can-hide"

                    src="@/assets/logoSmall.png"

            />
            </v-list-item-avatar>
            <v-img  v-else
                    alt="Vuetify Logo"

                    contain
                    src="@/assets/logo.png"
                    style="align-content: center; margin: 10px"

            />
          </div>
          </v-list-item>
          <v-list-item two-line :class="mini && 'px-0'" >
            <v-list-item-avatar>
              <v-img
                      v-if="isUserLoggedIn && networkOnLine"
                      class="user-picture can-hide"
                      :src="user.photoURL"
                      alt="Avatar"
              />
            </v-list-item-avatar>

            <v-list-item-content  v-if="isUserLoggedIn && networkOnLine">
              <v-list-item-title> {{ user.displayName }}</v-list-item-title>
              <v-list-item-subtitle> {{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <div v-if="isUserLoggedIn && networkOnLine"   >
          <div            v-for="item in items"
                              :key="item.title">
          <v-list-item v-if="item.role === '*' || item.role === user.role"

                  link
                  :to="item.link"
          >
              <v-list-item-icon >
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
          </div>
          </div>
        </v-list>
      </v-navigation-drawer>


    <v-app-bar app color="primary" dark      :clipped-left="$vuetify.breakpoint.lgAndUp">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-spacer></v-spacer>
      <v-toolbar-title>{{ appTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon  v-if="!isUserLoggedIn && networkOnLine"  @click="login">
        <v-icon>mdi-account-key-outline</v-icon>
      </v-btn>

      <v-btn icon v-if="isUserLoggedIn && networkOnLine"  @click="logout">
        <v-icon>mdi-home-import-outline</v-icon>
      </v-btn>


    </v-app-bar>

    <v-content>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
      <new-content-available-toastr
              v-if="newContentAvailable"
              class="new-content-available-toastr"
              :refreshing-app="refreshingApp"
              @refresh="serviceWorkerSkipWaiting"
      ></new-content-available-toastr>
      <apple-add-to-home-screen-modal
              v-if="showAddToHomeScreenModalForApple"
              class="apple-add-to-home-screen-modal"
              @close="closeAddToHomeScreenModalForApple(false)"
      >
      </apple-add-to-home-screen-modal>
    </v-content>
    <notifications group="foo"  position="bottom center" />
  </v-app>
</template>

<script>
  import firebase from 'firebase/app'
  import { mapGetters, mapState, mapActions } from 'vuex'

  export default {
    data () {
      return {
        items: [
          { title: 'Timesheet', icon: 'mdi-calendar-multiple', link: '/timesheets', role:'*' },
          { title: 'Projects', icon: 'mdi-book' , link: '/projects', role:'admin'},
          { title: 'Clients', icon: 'mdi-account-multiple-outline' , link: '/clients', role:'admin'},
          { title: 'Reports', icon: 'mdi-chart-areaspline' , link: '/reports', role:'admin'},
          { title: 'Dashboard', icon: 'mdi-chart-bar' , link: '/dashboard', role:'admin'}
        ],
        drawer: true,
        mini: false,
      }
    },
    computed: {
      ...mapGetters('authentication', ['isUserLoggedIn']),
      ...mapState('authentication', ['user']),
      ...mapState('app', ['networkOnLine', 'appTitle', 'appShortTitle']),
      ...mapGetters('app', ['newContentAvailable']),
      ...mapState('app', ['showAddToHomeScreenModalForApple', 'refreshingApp'])
    },
    methods: {
      ...mapActions('app', [
              'closeAddToHomeScreenModalForApple',
                'serviceWorkerSkipWaiting'
      ]),
      async logout() {
        await firebase.auth().signOut()
      },
      async login() {
        this.$router.push('login');
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>

