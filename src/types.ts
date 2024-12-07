export interface SiteData {
  url: string;
  title: string;
  description?: string;
  iconUrl?: string;
}

export interface SendTxParams {
  to: string;
  amount: string | null;
  data: string | null;
  network: string | null;
}
