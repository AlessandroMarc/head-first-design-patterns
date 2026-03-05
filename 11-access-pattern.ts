import { GumballMachine } from "./10-state-pattern.js"

// ============================================================
// PROXY PATTERN
// Provides a surrogate or placeholder for another object
// to control access to it.
//
// The book uses Java RMI for the Remote Proxy example.
// Java RMI has no direct TS equivalent, but the PATTERN still
// applies — we just use HTTP/REST instead of RMI stubs.
// ============================================================


// --- Shared interface (like the Java Remote interface) ---

interface GumballMachineRemote {
    getCount(): Promise<number>
    getLocation(): Promise<string>
    getStateName(): Promise<string>
}


// ============================================================
// 1. REMOTE PROXY — HTTP instead of Java RMI
//
// In Java:  RMI stub <---RMI---> RMI skeleton
// In TS:    Proxy     <--HTTP--> REST server
//
// The client talks to the proxy as if it were the real object.
// The proxy translates method calls into network requests.
// ============================================================

// -- The "Real Subject" living on a server --

class GumballMachineServer implements GumballMachineRemote {
    private machine: GumballMachine

    constructor(machine: GumballMachine) {
        this.machine = machine
    }

    // In a real app, these would be Express/Fastify route handlers
    // serving JSON over HTTP. Shown as async to match the remote interface.
    async getCount(): Promise<number> {
        return this.machine.count
    }

    async getLocation(): Promise<string> {
        return this.machine.location
    }

    async getStateName(): Promise<string> {
        return this.machine.state.constructor.name
    }
}

// -- The Remote Proxy (client-side stand-in) --
// In Java RMI this would be the auto-generated stub.
// In TS we write it ourselves (or use a library like tRPC, gRPC, etc.)

class GumballMachineProxy implements GumballMachineRemote {
    private serverUrl: string

    constructor(serverUrl: string) {
        this.serverUrl = serverUrl
    }

    async getCount(): Promise<number> {
        // In production: const res = await fetch(`${this.serverUrl}/count`)
        // return res.json()
        console.log(`  [proxy] GET ${this.serverUrl}/count`)
        return 5 // simulated response
    }

    async getLocation(): Promise<string> {
        console.log(`  [proxy] GET ${this.serverUrl}/location`)
        return "Seattle" // simulated response
    }

    async getStateName(): Promise<string> {
        console.log(`  [proxy] GET ${this.serverUrl}/state`)
        return "NoQuarterState" // simulated response
    }
}

// -- The Monitor uses the proxy without knowing it's remote --

class GumballMonitor {
    private machine: GumballMachineRemote

    constructor(machine: GumballMachineRemote) {
        this.machine = machine
    }

    async report(): Promise<void> {
        console.log("Gumball Machine: " + await this.machine.getLocation())
        console.log("Current inventory: " + await this.machine.getCount() + " gumballs")
        console.log("Current state: " + await this.machine.getStateName())
    }
}


// ============================================================
// 2. VIRTUAL PROXY — Lazy initialization
//
// Defers creation of an expensive object until it's needed.
// Common in TS/JS: lazy-loaded images, deferred DB connections, etc.
// ============================================================

class ExpensiveData {
    data: string[]

    constructor() {
        console.log("  [ExpensiveData] Loading huge dataset... (slow!)")
        this.data = Array.from({ length: 1000 }, (_, i) => `record-${i}`)
    }

    getSize(): number {
        return this.data.length
    }

    getRecord(index: number): string {
        return this.data[index]
    }
}

class VirtualProxyExpensiveData {
    private realData: ExpensiveData | null = null

    private getRealData(): ExpensiveData {
        if (this.realData === null) {
            console.log("  [VirtualProxy] First access — creating real object now")
            this.realData = new ExpensiveData()
        }
        return this.realData
    }

    getSize(): number {
        return this.getRealData().getSize()
    }

    getRecord(index: number): string {
        return this.getRealData().getRecord(index)
    }
}


// ============================================================
// 3. PROTECTION PROXY — JavaScript's built-in Proxy
//
// The book uses java.lang.reflect.Proxy to create a dynamic
// protection proxy. JS/TS has a NATIVE Proxy object that does
// exactly this — and it's even more powerful!
//
// Example: a Person object where:
//   - You CAN set your own name, but NOT your own rating
//   - Others CAN set your rating, but NOT your name
// ============================================================

interface Person {
    name: string
    gender: string
    interests: string
    rating: number
    setName(name: string): void
    setInterests(interests: string): void
    setRating(rating: number): void
}

class PersonImpl implements Person {
    name: string = ""
    gender: string = ""
    interests: string = ""
    rating: number = 0

    setName(name: string): void { this.name = name }
    setInterests(interests: string): void { this.interests = interests }
    setRating(rating: number): void { this.rating = rating }
}

// Owner Proxy: you can edit your own info, but NOT your own rating
function createOwnerProxy(person: Person): Person {
    return new Proxy(person, {
        set(target, prop, value) {
            if (prop === "rating") {
                console.log("  [OwnerProxy] You can't set your own rating!")
                return true
            }
            (target as any)[prop] = value
            return true
        },
        get(target, prop) {
            const value = (target as any)[prop]
            if (typeof value === "function") {
                return (...args: any[]) => {
                    if (prop === "setRating") {
                        console.log("  [OwnerProxy] You can't set your own rating!")
                        return
                    }
                    return value.apply(target, args)
                }
            }
            return value
        }
    })
}

// Non-Owner Proxy: others can rate you, but NOT change your personal info
function createNonOwnerProxy(person: Person): Person {
    return new Proxy(person, {
        set(target, prop, value) {
            if (prop === "name" || prop === "gender" || prop === "interests") {
                console.log(`  [NonOwnerProxy] You can't change someone else's ${String(prop)}!`)
                return true
            }
            (target as any)[prop] = value
            return true
        },
        get(target, prop) {
            const value = (target as any)[prop]
            if (typeof value === "function") {
                return (...args: any[]) => {
                    if (prop === "setName" || prop === "setInterests") {
                        console.log(`  [NonOwnerProxy] You can't change someone else's info!`)
                        return
                    }
                    return value.apply(target, args)
                }
            }
            return value
        }
    })
}


// ============================================================
// TEST DRIVE
// ============================================================

async function main() {

    // --- 1. Remote Proxy ---
    console.log("=== REMOTE PROXY (HTTP instead of Java RMI) ===\n")

    const proxy = new GumballMachineProxy("http://gumball-server:8080")
    const monitor = new GumballMonitor(proxy)
    await monitor.report()

    // For comparison, the "real" server side:
    console.log("\n--- Server-side (real object) ---")
    const realMachine = new GumballMachine(5, "Seattle")
    const server = new GumballMachineServer(realMachine)
    const localMonitor = new GumballMonitor(server)
    await localMonitor.report()


    // --- 2. Virtual Proxy ---
    console.log("\n\n=== VIRTUAL PROXY (Lazy Initialization) ===\n")

    const lazyData = new VirtualProxyExpensiveData()
    console.log("Proxy created — real object NOT yet loaded")
    console.log("Accessing data for the first time...")
    console.log(`Size: ${lazyData.getSize()}`)
    console.log("Accessing again (already loaded, no delay)...")
    console.log(`Record 42: ${lazyData.getRecord(42)}`)


    // --- 3. Protection Proxy ---
    console.log("\n\n=== PROTECTION PROXY (JS Proxy object) ===\n")

    const joe = new PersonImpl()
    joe.name = "Joe"
    joe.interests = "Bowling, Go"
    joe.rating = 7

    // Joe accesses his own profile (owner proxy)
    console.log("--- Joe edits his OWN profile ---")
    const ownerProxy = createOwnerProxy(joe)
    ownerProxy.setName("Joseph")                // allowed
    console.log(`Name changed to: ${ownerProxy.name}`)
    ownerProxy.setRating(10)                    // blocked!
    console.log(`Rating unchanged: ${ownerProxy.rating}`)

    console.log("\n--- Someone else views Joe's profile ---")
    const nonOwnerProxy = createNonOwnerProxy(joe)
    nonOwnerProxy.setRating(9)                  // allowed
    console.log(`Rating set to: ${nonOwnerProxy.rating}`)
    nonOwnerProxy.setName("Hacked!")            // blocked!
    console.log(`Name unchanged: ${nonOwnerProxy.name}`)
}

main()

// ============================================================
// IN THE REAL WORLD (TypeScript/Node.js)
//
// Remote Proxy equivalents:
//   - tRPC: end-to-end typesafe APIs (most TS-idiomatic!)
//   - gRPC: protocol buffers + generated client stubs
//   - GraphQL: typed queries with codegen
//   - Plain REST with OpenAPI + generated clients
//
// Virtual Proxy:
//   - React.lazy() for component lazy loading
//   - Dynamic import() for code splitting
//   - ORMs with lazy-loaded relations (TypeORM, Prisma)
//
// Protection Proxy:
//   - JavaScript's built-in Proxy object (ES2015+)
//   - Middleware in Express/Fastify for access control
//   - TypeScript's readonly/private modifiers (compile-time only)
// ============================================================