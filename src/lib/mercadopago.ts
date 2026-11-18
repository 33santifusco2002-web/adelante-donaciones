import "server-only";
import { MercadoPagoConfig, Payment, PreApproval, Preference } from "mercadopago";
import { serverEnv } from "./env";

let config: MercadoPagoConfig | null = null;

function getConfig() {
  if (!config) {
    config = new MercadoPagoConfig({ accessToken: serverEnv.mpAccessToken, options: { timeout: 10000 } });
  }
  return config;
}

export const mp = {
  preference: () => new Preference(getConfig()),
  preapproval: () => new PreApproval(getConfig()),
  payment: () => new Payment(getConfig()),
};
