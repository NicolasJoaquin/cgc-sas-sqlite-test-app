export interface IExternalUser {
  id: number;
  name: string;
  last_name: string;
  email: string;
  permissions: string;
  org_chart_position: string;
  changed: boolean;
}