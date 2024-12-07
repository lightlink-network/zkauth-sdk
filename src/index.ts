import { ZKAuth } from "./zkauth";

export default ZKAuth;

if (typeof window !== "undefined") {
  (window as any).ZKAuth = ZKAuth;
}
