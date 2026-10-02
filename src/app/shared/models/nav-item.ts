export interface NavItem {
  icon: string;
  label: string;
  route: string;
  children?: NavItem[];
  roles?: string[];
}
