abstract class Pizza {
  name: string = "";
  dough: string = "";
  sauce: string = "";
  toppings: string[] = [];

  constructor(name?: string, dough?: string, sauce?: string, toppings?: string[]) {
    this.name = name || "";
    this.dough = dough || "";
    this.sauce = sauce || "";
    this.toppings = toppings || [];
  }

  prepare(): void {
    console.log(`Preparing ${this.name}`);
    console.log(`  - Tossing ${this.dough} dough`);
    console.log(`  - Adding ${this.sauce} sauce`);
    console.log(`  - Adding toppings: ${this.toppings.join(", ")}`);
    console.log("  - Baking in oven");
  }

  cut(): void {
    console.log(`Cutting ${this.name} into diagonal slices`);
  }

  box(): void {
    console.log(`Placing ${this.name} in official PizzaStore box`);
  }

  bake(): void {
    console.log(`Baking ${this.name} at 350 degrees for 25 minutes`);
  }
}
class NYStyleCheesePizza extends Pizza {
  constructor() {
    super("NY Style Sauce and Cheese Pizza", "thin crust", "marinara", ["Grated Reggiano cheese"]);
  }

  prepare(): void {
    console.log(`Preparing ${this.name}`);
    console.log("Tossing dough...");
    console.log("Adding sauce...");
    console.log("Adding toppings:");
    this.toppings.forEach(topping => console.log(topping));
    console.log("Bake for 25 minutes at 350");
  }

  cut(): void {
    console.log("Cutting the pizza into diagonal slices");
  }

  box(): void {
    console.log("Place pizza in official PizzaStore box");
  }
}

// Chicago Style Pizzas
class ChicagoStyleCheesePizza extends Pizza {
  constructor() {
    super("Chicago Style Deep Dish Cheese Pizza", "deep dish crust", "marinara", ["Shredded Mozzarella Cheese"]);
  }

  prepare(): void {
    console.log(`Preparing ${this.name}`);
    console.log("Tossing dough...");
    console.log("Adding sauce...");
    console.log("Adding toppings:");
    this.toppings.forEach(topping => console.log(topping));
    console.log("Bake for 25 minutes at 350");
  }

  cut(): void {
    console.log("Cutting the pizza into square slices");
  }

  box(): void {
    console.log("Place pizza in official PizzaStore box");
  }
}


abstract class PizzaStore {
  orderPizza(type: string): Pizza {
    let pizza: Pizza = this.createPizza(type);

    pizza.prepare();
    pizza.cut();
    pizza.bake();
    pizza.box();

    return pizza;
  }

  abstract createPizza(type: string): Pizza;
}

class NYPizzaStore extends PizzaStore {
  createPizza(type: string): Pizza {
    if (type === "cheese") {
      return new NYStyleCheesePizza();
    }
    return new NYStyleCheesePizza();
  }
}

class ChicagoPizzaStore extends PizzaStore {
  createPizza(type: string): Pizza {
    if (type === "cheese") {
      return new ChicagoStyleCheesePizza();
    }
    return new ChicagoStyleCheesePizza();
  }
}



class PizzaTestDrive {
  public static main(): void {
    const nyStore: NYPizzaStore = new NYPizzaStore();
    const chicagoStore: ChicagoPizzaStore = new ChicagoPizzaStore();

    const pizza1: Pizza = nyStore.orderPizza("cheese");
    console.log(`Ethan ordered a ${pizza1.name}\n`);

    const pizza2: Pizza = chicagoStore.orderPizza("cheese");
    console.log(`Joel ordered a ${pizza2.name}\n`);
  }
}

PizzaTestDrive.main();

interface PizzaIngredientsFactory {
  createDough(): Dough;
  createSauce(): Sauce;
  createToppings(): Topping[];
  createVegetables(): Vegetable[];
  createCheese(): Cheese;
  createPepperoni(): Pepperoni;
  createClams(): Clams;
}

class NYPizzaIngredientsFactory implements PizzaIngredientsFactory {
  createDough(): Dough {
    return new ThinCrustDough();
  }

  createSauce(): Sauce {
    return new MarinaraSauce();
  }

  createToppings(): Topping[] {
    return [new GratedReggianoCheese()];
  }

  createVegetables(): Vegetable[] {
    return [new Garlic(), new Onion(), new Mushroom(), new RedPepper()];
  }

  createCheese(): Cheese {
    return new ReggianoCheese();
  }

  createPepperoni(): Pepperoni {
    return new SlicedPepperoni();
  }

  createClams(): Clams {
    return new FreshClams();
  }
}

class ChicagoPizzaIngredientsFactory implements PizzaIngredientsFactory {
  createDough(): Dough {
    return new ThickCrustDough();
  }

  createSauce(): Sauce {
    return new PlumTomatoSauce();
  }

  createToppings(): Topping[] {
    return [new ShreddedMozzarellaCheese()];
  }

  createVegetables(): Vegetable[] {
    return [new BlackOlives(), new Spinach(), new Eggplant()];
  }

  createCheese(): Cheese {
    return new MozzarellaCheese();
  }

  createPepperoni(): Pepperoni {
    return new SlicedPepperoni();
  }

  createClams(): Clams {
    return new FrozenClams();
  }
}

// Ingredient Interfaces and Classes
interface Dough { }
class ThinCrustDough implements Dough { }
class ThickCrustDough implements Dough { }

interface Sauce { }
class MarinaraSauce implements Sauce { }
class PlumTomatoSauce implements Sauce { }

interface Topping { }
class GratedReggianoCheese implements Topping { }
class ShreddedMozzarellaCheese implements Topping { }

interface Vegetable { }
class Garlic implements Vegetable { }
class Onion implements Vegetable { }
class Mushroom implements Vegetable { }
class RedPepper implements Vegetable { }
class BlackOlives implements Vegetable { }
class Spinach implements Vegetable { }
class Eggplant implements Vegetable { }

interface Cheese { }
class ReggianoCheese implements Cheese { }
class MozzarellaCheese implements Cheese { }

interface Pepperoni { }
class SlicedPepperoni implements Pepperoni { }

interface Clams { }
class FreshClams implements Clams { }
class FrozenClams implements Clams { }

abstract class Pizza2 {
  name: string = "";
  dough!: Dough;
  sauce!: Sauce;
  toppings: Topping[] = [];
  vegetables: Vegetable[] = [];
  cheese!: Cheese;
  pepperoni!: Pepperoni;
  clams!: Clams;

  constructor(name?: string) {
    this.name = name || "";
  }

  abstract prepare(): void;

  cut(): void {
    console.log(`Cutting ${this.name} into diagonal slices`);
  }

  box(): void {
    console.log(`Placing ${this.name} in official PizzaStore box`);
  }

  bake(): void {
    console.log(`Baking ${this.name} at 350 degrees for 25 minutes`);
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  toString(): string {
    return `---- ${this.name} ----\n` +
      `Dough: ${this.dough.constructor.name}\n` +
      `Sauce: ${this.sauce.constructor.name}\n` +
      `Toppings: ${this.toppings.map(t => t.constructor.name).join(", ")}\n` +
      `Vegetables: ${this.vegetables.map(v => v.constructor.name).join(", ")}\n` +
      `Cheese: ${this.cheese.constructor.name}\n` +
      `Pepperoni: ${this.pepperoni.constructor.name}\n` +
      `Clams: ${this.clams.constructor.name}\n`;
  }
}

class CheesePizza extends Pizza2 {
  ingredientFactory: PizzaIngredientsFactory;

  constructor(ingredientFactory: PizzaIngredientsFactory) {
    super();
    this.ingredientFactory = ingredientFactory;
  }

  prepare(): void {
    console.log(`Preparing ${this.name}`);
    this.dough = this.ingredientFactory.createDough();
    this.sauce = this.ingredientFactory.createSauce();
    this.toppings = this.ingredientFactory.createToppings();
    this.cheese = this.ingredientFactory.createCheese();
  }
}

class ClaimsPizza extends Pizza2 {
  ingredientFactory: PizzaIngredientsFactory;

  constructor(ingredientFactory: PizzaIngredientsFactory) {
    super();
    this.ingredientFactory = ingredientFactory;
  }

  prepare(): void {
    console.log(`Preparing ${this.name}`);
    this.dough = this.ingredientFactory.createDough();
    this.sauce = this.ingredientFactory.createSauce();
    this.toppings = this.ingredientFactory.createToppings();
    this.clams = this.ingredientFactory.createClams();
  }
}

abstract class PizzaStore2 {
  orderPizza(type: string): Pizza2 {
    let pizza: Pizza2 = this.createPizza(type);

    pizza.prepare();
    pizza.cut();
    pizza.bake();
    pizza.box();

    return pizza;
  }

  abstract createPizza(type: string): Pizza2;
}

class NYPizzaStore2 extends PizzaStore2 {

  createPizza(type: string): Pizza2 {

    const ingredientFactory: NYPizzaIngredientsFactory = new NYPizzaIngredientsFactory();
    let pizza: Pizza2;

    if (type === "cheese") {
      pizza = new CheesePizza(ingredientFactory);
      pizza.setName("NY Style Cheese Pizza");
    } else if (type === "clam") {
      pizza = new ClaimsPizza(ingredientFactory);
      pizza.setName("NY Style Clam Pizza");
    } else {
      throw new Error(`Unknown pizza type: ${type}`);
    }

    return pizza;
  }
}