abstract class MenuComponent {
    add(menuComponent: MenuComponent): void {
        throw new Error("Unsupported operation");
    }
    remove(menuComponent: MenuComponent): void {
        throw new Error("Unsupported operation");
    }
    getChild(i: number): MenuComponent {
        throw new Error("Unsupported operation");
    }
    getName(): string {
        throw new Error("Unsupported operation");
    }
    getDescription(): string {
        throw new Error("Unsupported operation");
    }
    getPrice(): number {
        throw new Error("Unsupported operation");
    }
    isVegetarian(): boolean {
        throw new Error("Unsupported operation");
    }
    print(): void {
        throw new Error("Unsupported operation");
    }
}

class MenuItem extends MenuComponent {
    name: string
    description: string
    vegetarian: boolean
    price: number

    constructor(name: string, description: string, vegetarian: boolean, price: number) {
        super();
        this.name = name;
        this.description = description;
        this.vegetarian = vegetarian;
        this.price = price;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getPrice(): number {
        return this.price;
    }

    isVegetarian(): boolean {
        return this.vegetarian;
    }

    print(): void {
        console.log(`  ${this.getName()}`);
        if (this.isVegetarian()) {
            console.log("(v)");
        }
        console.log(`, ${this.getPrice()}`);
        console.log(`     -- ${this.getDescription()}`);
    }
}