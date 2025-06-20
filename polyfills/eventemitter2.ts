// Minimal shim so `import { EventEmitter2 } from "eventemitter2"` works
// while still allowing `import EE2 from "eventemitter2"`.

import EE2Default from "eventemitter2"

export const EventEmitter2 = EE2Default as any
export default EE2Default
