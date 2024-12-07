# ZKAuth SDK

ZKAuth is a zero-knowledge proof-based crypto wallet, controlled by your google, apple, twitter or facebook account, using ZK-Snarks to verify your identity without revealing any personal information on-chain.

## Usage

```bash
npm install zkauth-sdk
```

```typescript
import { ZKAuth } from "zkauth-sdk";

const zkauth = new ZKAuth({
  name: "My Awesome App",
  url: "https://example.com",
  icon: "https://example.com/icon.png",
});
```

### Connection

`zkauth.connect()` will open a popup displaying login options. Upon successful login, it will return the wallet address.

```typescript
const walletAddress = await zkauth.connect();
```

`zkauth.reconnect()` will attempt to use the same wallet as the last connection. If the user is not connected, it will prompt the user to connect.

Alternatively, you can connect directly with a given provider:

```typescript
const walletAddress = await zkauth.reconnect("google");
```

### Disconnect

```typescript
zkauth.disconnect();
```

Will disconnect the currently connected user.

### Send a transaction

```typescript
const txHash = await zkauth.sendTransaction({
  to: "0x123...",
  value: 1000000000000000000, // value in wei
});
```

### State

`zkauth.connected()` will return true if the user is connected, false otherwise.

```typescript
const isConnected = zkauth.connected();
```

`zkauth.currentUser()` will return the currently connected user, or null if the user is not connected.

```typescript
const walletAddress = zkauth.currentUser();
```
