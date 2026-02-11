
interface QuackBehaviour {
    quack(): void;
}

interface FlyBehaviour {
    fly(): void;
}

abstract class Duck {
    protected flyBehaviour: FlyBehaviour;
    protected quackBehaviour: QuackBehaviour;

    constructor(flyBehaviour: FlyBehaviour, quackBehaviour: QuackBehaviour) {
        this.flyBehaviour = flyBehaviour;
        this.quackBehaviour = quackBehaviour;
    }

    public setFlyBehaviour(fb: FlyBehaviour): void {
        this.flyBehaviour = fb;
    }

    public setQuackBehaviour(qb: QuackBehaviour): void {
        this.quackBehaviour = qb;
    }

    public display(): void { }

    public performFly(): void {
        this.flyBehaviour.fly();
    }

    public performQuack(): void {
        this.quackBehaviour.quack();
    }

    public swim(): void {
        console.log("All ducks float, even decoys!");
    }
}

class FlyWithWings implements FlyBehaviour {
    fly(): void {
        console.log("Flying with wings!");
    }
}

class FlyNoWay implements FlyBehaviour {
    fly(): void {
        console.log("I can't fly.");
    }
}

class FlyRocketPowered implements FlyBehaviour {
    fly(): void {
        console.log("I'm flying with a rocket!");
    }
}

class Quack implements QuackBehaviour {
    quack(): void {
        console.log("Quack! Quack!");
    }
}

class Squeak implements QuackBehaviour {
    quack(): void {
        console.log("Squeak! Squeak!");
    }
}

class Silent implements QuackBehaviour {
    quack(): void {
        console.log("<< Silence >>");
    }
}

class MallardDuck extends Duck {
    constructor() {
        super(new FlyWithWings(), new Quack());
    }
}

class ModelDuck extends Duck {
    constructor() {
        super(new FlyNoWay(), new Quack());
    }
}

var mallard = new MallardDuck();
mallard.performFly();
mallard.performQuack();

var model: Duck = new ModelDuck();
model.performFly();
model.setFlyBehaviour(new FlyRocketPowered());
model.performFly();