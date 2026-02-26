class MenuItem {
    name: string;
    description: string
    vegetarian: boolean;
    price: number;

    constructor(name: string, description: string, vegetarian: boolean, price: number) {
        this.name = name;
        this.description = description;
        this.vegetarian = vegetarian;
        this.price = price;
    }
}

export class DinnerMenu {
    private menuItems: Map<string, MenuItem> = new Map();

    constructor() {
        this.addItem(
            "Vegetarian BLT",
            "Fakin' Bacon with lettuce & tomato on whole wheat",
            true,
            2.99
        );
        this.addItem(
            "BLT",
            "Bacon with lettuce & tomato on whole wheat",
            false,
            2.99
        );
    }

    addItem(name: string, description: string, vegetarian: boolean, price: number) {
        this.menuItems.set(name, new MenuItem(name, description, vegetarian, price));
    }

    // Initial stage: expose the internal collection
    getMenuItems(): MenuItem[] {
        return [...this.menuItems.values()];
    }
}

export class PancakeHouseMenu {
    private menuItems: MenuItem[] = [];

    constructor() {
        this.addItem(
            "K&B's Pancake Breakfast",
            "Pancakes with scrambled eggs and toast",
            true,
            2.99
        );
        this.addItem(
            "Regular Pancake Breakfast",
            "Pancakes with fried eggs and sausage",
            false,
            2.99
        );
    }

    addItem(name: string, description: string, vegetarian: boolean, price: number) {
        this.menuItems.push(new MenuItem(name, description, vegetarian, price));
    }

    // Initial stage: expose the internal collection
    getMenuItems(): MenuItem[] {
        return this.menuItems;
    }
}

// She needs to know the internal structure of both menus to print them, which is not ideal.
export class Waitress {
    constructor(
        private pancakeHouseMenu: PancakeHouseMenu,
        private dinnerMenu: DinnerMenu
    ) { }

    printMenu(): void {
        console.log("MENU\n----\nBREAKFAST");
        this.printItems(this.pancakeHouseMenu.getMenuItems());

        console.log("\nLUNCH");
        this.printItems(this.dinnerMenu.getMenuItems());
    }

    private printItems(items: MenuItem[]): void {
        for (const item of items) {
            console.log(`${item.name}, ${item.price} -- ${item.description}`);
        }
    }
}

interface Iterator<T> {
    hasNext(): boolean;
    next(): T;
    remove(): void;
}

class DinnerMenuIterator implements Iterator<MenuItem> {
    private position: number = 0;
    menuItems: MenuItem[];

    constructor(items: MenuItem[]) {
        this.menuItems = items;
    }

    next(): MenuItem {
        const menuItem = this.menuItems[this.position];
        this.position += 1;
        return menuItem;
    }

    hasNext(): boolean {
        return this.position < this.menuItems.length;
    }

    remove(): void {
        if (this.position <= 0) {
            throw new Error("You can't remove an item until you've done at least one next()");
        }
        this.menuItems.splice(this.position - 1, 1);
        this.position -= 1;
    }
}

class DinnerMenuWithIterator extends DinnerMenu {
    createIterator(): Iterator<MenuItem> {
        return new DinnerMenuIterator(this.getMenuItems());
    }

    override getMenuItems(): MenuItem[] {
        return super.getMenuItems();
    }
}

class PancakeHouseMenuIterator implements Iterator<MenuItem> {
    private position: number = 0
    menuItems: MenuItem[];

    constructor(items: MenuItem[]) {
        this.menuItems = items;
    }

    next(): MenuItem {
        const menuItem = this.menuItems[this.position];
        this.position += 1;
        return menuItem;
    }

    hasNext(): boolean {
        return this.position < this.menuItems.length;
    }

    remove(): void {
        if (this.position <= 0) {
            throw new Error("You can't remove an item until you've done at least one next()");
        }
        this.menuItems.splice(this.position - 1, 1);
        this.position -= 1;
    }
}

class PancakeHouseMenuWithIterator extends PancakeHouseMenu {
    createIterator(): Iterator<MenuItem> {
        return new PancakeHouseMenuIterator(this.getMenuItems());
    }

    override getMenuItems(): MenuItem[] {
        return super.getMenuItems();
    }
}

class WaitressWithIterators {
    pancakeHouseMenu: PancakeHouseMenuWithIterator;
    dinnerMenu: DinnerMenuWithIterator;

    constructor(pancakeHouseMenu: PancakeHouseMenuWithIterator, dinnerMenu: DinnerMenuWithIterator) {
        this.pancakeHouseMenu = pancakeHouseMenu;
        this.dinnerMenu = dinnerMenu;
    }

    printMenu(): void {
        console.log("MENU\n----\nBREAKFAST");
        this.printItems(this.pancakeHouseMenu.createIterator());

        console.log("\nLUNCH");
        this.printItems(this.dinnerMenu.createIterator());
    }

    private printItems(iterator: Iterator<MenuItem>): void {
        while (iterator.hasNext()) {
            const item = iterator.next();
            console.log(`${item.name}, ${item.price} -- ${item.description}`);
        }
    }
}

const waitress = new WaitressWithIterators(new PancakeHouseMenuWithIterator(), new DinnerMenuWithIterator());

waitress.printMenu();