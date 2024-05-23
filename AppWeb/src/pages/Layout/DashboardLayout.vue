<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      
      <sidebar-link to="/lote">
        <md-icon>view_in_ar</md-icon>
        <p>Cadastrar</p>
      </sidebar-link>
      
       <sidebar-link to="/movimentarLote">
        <md-icon>emoji_transportation</md-icon>
        <p>Movimentar</p>
      </sidebar-link>

      <sidebar-link to="/venderItemLote">
        <md-icon>store</md-icon>
        <p>Vender</p>
      </sidebar-link>
      
      <sidebar-link to="/acompanharLote">
        <md-icon>manage_search</md-icon>
        <p>Acompanhar</p>
      </sidebar-link>

      <sidebar-link to="/bloquearLote">
        <md-icon>block</md-icon>
        <p>Bloquear</p>
      </sidebar-link>

      <sidebar-link to="/auditarLote">
        <md-icon>verified_user</md-icon>
        <p>Auditar</p>
      </sidebar-link>

    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <fixed-plugin
        :color.sync="sidebarBackground"
        :image.sync="sidebarBackgroundImage"
      >
      </fixed-plugin>

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";
import FixedPlugin from "./Extra/FixedPlugin.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu,
    FixedPlugin,
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg")
    };
  },
};
</script>
