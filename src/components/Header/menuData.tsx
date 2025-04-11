import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  
  {
    id: 2,
    title: "About",
    path: "/about",
    newTab: false,
  },
  {
    id: 3,
    title: "Pricing",
    path: "/pricing",
    newTab: false,
  },
  {
    id: 5,
    title: "Contact",
    path: "/contact",
    newTab: false,
  },
  {
    id: 7,
    title: "Family",
    path: "/family",
    newTab: false,
    requiresSignIn: true
  },
  {
    id: 8,
    title: "Admin",
    path: "/admin",
    newTab: false,
    requiresAdmin: true
  }

];
export default menuData;
