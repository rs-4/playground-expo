import { MenuItem } from "@/components/playground/HeaderMenu";
    


export const menuItems: MenuItem[] = [
  {
    icon: "settings-outline",
    label: "Settings",
    onPress: () => console.log("Settings pressed"),
  },
  {
    icon: "bookmark-outline",
    label: "My Projects",
    onPress: () => console.log("Projects pressed"),
  },
  {
    icon: "notifications-outline",
    label: "Notifications",
    onPress: () => console.log("Notifications pressed"),
  },
  {
    icon: "log-out-outline",
    label: "Logout",
    onPress: () => console.log("Logout pressed"),
    isLogout: true,
  },
];