abstract class Pizza {
  abstract prepare(): void;
  abstract cut(): void;
  abstract box(): void;
}

class CheesePizza implements Pizza {
  prepare(): void {
    console.log("Preparing cheese pizza");
    console.log("  - Tossing dough");
    console.log("  - Adding mozzarella cheese");
    console.log("  - Baking in oven");
  }

  cut(): void {
    console.log("Cutting cheese pizza into diagonal slices");
  }

  box(): void {
    console.log("Placing cheese pizza in official PizzaStore box");
  }
}

class MargheritaPizza implements Pizza {
  prepare(): void {
    console.log("Preparing margherita pizza");
    console.log("  - Tossing dough");
    console.log("  - Adding tomato sauce");
    console.log("  - Adding mozzarella and basil");
    console.log("  - Baking in oven");
  }

  cut(): void {
    console.log("Cutting margherita pizza into square slices");
  }

  box(): void {
    console.log("Placing margherita pizza in official PizzaStore box");
  }
}

abstract class PizzaFactory {
  abstract createPizza(type: string): Pizza;
}

class SimplePizzaFactory extends PizzaFactory {
  createPizza(type: string): Pizza {
    if (type === "cheese") {
      return new CheesePizza();
    }
    return new MargheritaPizza();
  }
}

abstract class PizzaStore {
  orderPizza(type: string): Pizza {
    let pizza: Pizza = this.createPizza(type);

    pizza.prepare();
    pizza.cut();
    pizza.box();

    return pizza;
  }

  abstract createPizza(type: string): Pizza;
}

class NYPizzaFactory extends PizzaFactory {
  createPizza(type: string): Pizza {
    if (type === "cheese") {
      return new CheesePizza();
    }
    return new MargheritaPizza();
  }
}

class ChicagoPizzaFactory extends PizzaFactory {
  createPizza(type: string): Pizza {
    if (type === "cheese") {
      return new CheesePizza();
    }
    return new MargheritaPizza();
  }
}