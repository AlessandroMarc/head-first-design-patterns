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

class Menu extends MenuComponent {
    menuComponents: MenuComponent[] = [];
    name: string;
    description: string;

    constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    }

    add(menuComponent: MenuComponent): void {
        this.menuComponents.push(menuComponent);
    }

    remove(menuComponent: MenuComponent): void {
        const index = this.menuComponents.indexOf(menuComponent);
        if (index !== -1) {
            this.menuComponents.splice(index, 1);
        }
    }

    getChild(i: number): MenuComponent {
        return this.menuComponents[i];
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    print(): void {
        console.log(`\n${this.getName()}, ${this.getDescription()}`);
        console.log("---------------------");

        for (const menuComponent of this.menuComponents) {
            menuComponent.print();
        }
    }
}

class Waitress {
    allMenus: MenuComponent;

    constructor(allMenus: MenuComponent) {
        this.allMenus = allMenus;
    }

    printMenu(): void {
        this.allMenus.print();
    }
}

// Usage
const pancakeHouseMenu = new Menu("PANCAKE HOUSE MENU", "Breakfast");
const dinerMenu = new Menu("DINER MENU", "Lunch");
const cafeMenu = new Menu("CAFE MENU", "Dinner");
const dessertMenu = new Menu("DESSERT MENU", "Dessert of course!");

const allMenus = new Menu("ALL MENUS", "All menus combined");
allMenus.add(pancakeHouseMenu);
allMenus.add(dinerMenu);
allMenus.add(cafeMenu);
allMenus.add(dessertMenu);

dinerMenu.add(new MenuItem("Pasta", "Spaghetti with marinara sauce", true, 8.99));
dinerMenu.add(new MenuItem("Burger", "Beef burger with fries", false, 10.99));

const waitress = new Waitress(allMenus);
waitress.printMenu();