export type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  requiresAdmin?: boolean;
  submenu?: Menu[];
  requiresSignIn?: boolean;
};
