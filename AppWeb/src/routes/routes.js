import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Lote from "@/pages/Lote.vue";
import MovimentarLote from "@/pages/MovimentarLote.vue";
import BloquearLote from "@/pages/BloquearLote.vue";
import VenderItemLote from "@/pages/VenderItemLote.vue";
import AuditarLote from "@/pages/AuditarLote.vue";
import AcompanharLote from "@/pages/AcompanharLote.vue";

//import Login from "@/pages/Login.vue";

import TableList from "@/pages/TableList.vue";
import Typography from "@/pages/Typography.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Notifications from "@/pages/Notifications.vue";
import UpgradeToPRO from "@/pages/UpgradeToPRO.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "lote",
        name: "Cadastrar",
        component: Lote
      },
      {
        path: "movimentarLote",
        name: "Movimentar Lote",
        component: MovimentarLote
      },
      {
        path: "acompanharLote",
        name: "Acompanhar Lote",
        component: AcompanharLote
      },
      {
        path: "venderItemLote",
        name: "Vender Item Lote",
        component: VenderItemLote
      },
      {
        path: "bloquearLote",
        name: "Bloquear Lote",
        component: BloquearLote
      },
      {
        path: "auditarLote",
        name: "Auditar Lote",
        component: AuditarLote
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile
      },
     
      {
        path: "table",
        name: "Table List",
        component: TableList
      },
      {
        path: "typography",
        name: "Typography",
        component: Typography
      },
      {
        path: "icons",
        name: "Icons",
        component: Icons
      },
      {
        path: "maps",
        name: "Maps",
        meta: {
          hideFooter: true
        },
        component: Maps
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications
      },
      {
        path: "upgrade",
        name: "Upgrade to PRO",
        component: UpgradeToPRO
      }
    ]
  }
];

export default routes;
