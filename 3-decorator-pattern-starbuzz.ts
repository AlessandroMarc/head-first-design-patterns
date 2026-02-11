abstract class SuperBeverage {
  description: string;
  milk: boolean = false;
  soy: boolean = false;
  mocha: boolean = false;
  whip: boolean = false;

  constructor(description: string) {
    this.description = description;
  }

  getDescription(): string {
    return this.description;
  }

  abstract cost(): number;
}

class EspressoExtension extends SuperBeverage {
  constructor() {
    super("Espresso");
  }

  cost(): number {
    return 1.99;
  }
}

// Or we apply the decorator pattern!
enum Size {
  TALL,
  GRANDE,
  VENTI,
}

abstract class Beverage {
  description: string = "Unknown Beverage";
  size: Size = Size.TALL;

  getDescription(): string {
    return this.description;
  }

  abstract cost(): number;

  setSize(size: Size): void {
    this.size = size;
  }

  getSize(): Size {
    return this.size;
  }
}

abstract class CondimentDecorator extends Beverage {
  beverage: Beverage;
  abstract getDescription(): string;

  constructor(beverage: Beverage) {
    super();
    this.beverage = beverage;
  }
}

class HouseBlend extends Beverage {
  description: string = "House Blend Coffee";
  cost(): number {
    return 0.89;
  }
}

class DarkRoast extends Beverage {
  description: string = "Dark Roast Coffee";
  cost(): number {
    return 0.99;
  }
}

class Milk extends CondimentDecorator {
  constructor(beverage: Beverage) {
    super(beverage);
  }

  getDescription(): string {
    return this.beverage.getDescription() + ", Milk";
  }

  cost(): number {
    return this.beverage.cost() + 0.1;
  }
}

class Soy extends CondimentDecorator {
  constructor(beverage: Beverage) {
    super(beverage);
  }

  getDescription(): string {
    return this.beverage.getDescription() + ", Soy";
  }

  cost(): number {
    return this.beverage.cost() + 0.15;
  }
}

class Espresso extends Beverage {
  description: string = "Espresso";
  cost(): number {
    return 1.99;
  }
}

class Mocha extends CondimentDecorator {
  constructor(beverage: Beverage) {
    super(beverage);
  }

  getDescription(): string {
    return this.beverage.getDescription() + ", Mocha";
  }

  cost(): number {
    return this.beverage.cost() + 0.2;
  }
}

class Whip extends CondimentDecorator {
  constructor(beverage: Beverage) {
    super(beverage);
  }

  getDescription(): string {
    return this.beverage.getDescription() + ", Whip";
  }

  cost(): number {
    return this.beverage.cost() + 0.1;
  }
}

class StarbuzzCoffee {
  static main(): void {
    const beverage: Beverage = new Espresso();
    console.log(beverage.getDescription() + " $" + beverage.cost());

    let beverage2: Beverage = new DarkRoast();
    beverage2 = new Mocha(beverage2);
    beverage2 = new Mocha(beverage2);
    beverage2 = new Whip(beverage2);
    console.log(beverage2.getDescription() + " $" + beverage2.cost());
  }
}

StarbuzzCoffee.main();
