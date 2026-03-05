import { copyFileSync } from "node:fs";

interface Quackable extends QuackObservable {
    quack(): void;
}

class _MallardDuck implements Quackable {
    observable: Observable;

    constructor() {
        this.observable = new Observable(this);
    }

    quack() {
        console.log("Quack");
        this.notifyObservers();
    }

    registerObserver(observer: Observer): void {
        this.observable.registerObserver(observer);
    }

    notifyObservers(): void {
        this.observable.notifyObservers();
    }
}

class RedheadDuck implements Quackable {
    observable: Observable;

    constructor() {
        this.observable = new Observable(this);
    }

    quack() {
        console.log("Quack");
        this.notifyObservers();
    }

    registerObserver(observer: Observer): void {
        this.observable.registerObserver(observer);
    }

    notifyObservers(): void {
        this.observable.notifyObservers();
    }
}

class DuckCall implements Quackable {
    observable: Observable;

    constructor() {
        this.observable = new Observable(this);
    }

    quack() {
        console.log("Kwak");
        this.notifyObservers();
    }

    registerObserver(observer: Observer): void {
        this.observable.registerObserver(observer);
    }

    notifyObservers(): void {
        this.observable.notifyObservers();
    }
}

class RubberDuck implements Quackable {
    observable: Observable;

    constructor() {
        this.observable = new Observable(this);
    }

    quack(): void {
        console.log("Squeak");
        this.notifyObservers();
    }

    registerObserver(observer: Observer): void {
        this.observable.registerObserver(observer);
    }

    notifyObservers(): void {
        this.observable.notifyObservers();
    }
}

class Goose {
    honk(): void {
        console.log("Honk");
    }
}

class GooseAdapter implements Quackable {
    private goose: Goose;
    observable: Observable;

    constructor(goose: Goose) {
        this.goose = goose;
        this.observable = new Observable(this);
    }

    quack(): void {
        this.goose.honk();
        this.notifyObservers();
    }

    registerObserver(observer: Observer): void {
        this.observable.registerObserver(observer);
    }

    notifyObservers(): void {
        this.observable.notifyObservers();
    }
}

class QuackCounter implements Quackable {
    private duck: Quackable;
    private static numberOfQuacks: number = 0;

    constructor(duck: Quackable) {
        this.duck = duck;
    }

    quack(): void {
        this.duck.quack();
        QuackCounter.numberOfQuacks++;
    }

    // Delegate to the wrapped duck's observer
    registerObserver(observer: Observer): void {
        this.duck.registerObserver(observer);
    }

    notifyObservers(): void {
        this.duck.notifyObservers();
    }

    static getQuacks(): number {
        return QuackCounter.numberOfQuacks;
    }
}

abstract class AbstractDuckFactory {
    abstract createMallardDuck(): Quackable;
    abstract createRedheadDuck(): Quackable;
    abstract createDuckCall(): Quackable;
    abstract createRubberDuck(): Quackable;
}

class CountingDuckFactory extends AbstractDuckFactory {
    createMallardDuck(): Quackable {
        return new QuackCounter(new _MallardDuck());
    }

    createRedheadDuck(): Quackable {
        return new QuackCounter(new RedheadDuck());
    }

    createDuckCall(): Quackable {
        return new QuackCounter(new DuckCall());
    }

    createRubberDuck(): Quackable {
        return new QuackCounter(new RubberDuck());
    }
}

class Flock implements Quackable {
    quackers: Quackable[] = [];

    add(duck: Quackable): void {
        this.quackers.push(duck);
    }

    quack(): void {
        for (const duck of this.quackers) {
            duck.quack();
        }
    }

    // Register on every duck in the flock
    registerObserver(observer: Observer): void {
        for (const duck of this.quackers) {
            duck.registerObserver(observer);
        }
    }

    notifyObservers(): void {
        // Each duck notifies individually when it quacks
    }
}

interface QuackObservable {
    registerObserver(observer: Observer): void;
    notifyObservers(): void;
}

interface Observer {
    update(duck: QuackObservable): void;
}

class Observable implements QuackObservable {
    private observers: Observer[] = [];
    private duck: QuackObservable;

    constructor(duck: QuackObservable) {
        this.duck = duck;
    }

    registerObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this.duck);
        }
    }
}

// A concrete observer — the Quackologist
class Quackologist implements Observer {
    update(duck: QuackObservable): void {
        console.log("Quackologist: " + duck.constructor.name + " just quacked.");
    }
}



class DuckSimulator {
    main() {
        const simulator = new DuckSimulator();
        const duckFactory = new CountingDuckFactory();
        simulator.simulate();
    }

    simulate(): void;
    simulate(duck: Quackable): void;
    simulate(duckFactory: AbstractDuckFactory): void

    simulate(duck?: Quackable | AbstractDuckFactory): void {
        if (duck instanceof AbstractDuckFactory) {
            const mallardDuck = duck.createMallardDuck();
            const redheadDuck = duck.createRedheadDuck();
            const duckCall = duck.createDuckCall();
            const rubberDuck = duck.createRubberDuck();
            const goose = new Goose();
            const gooseDuck = new QuackCounter(new GooseAdapter(goose));

            const flocksOfDucks = new Flock();
            flocksOfDucks.add(mallardDuck);
            flocksOfDucks.add(redheadDuck);
            flocksOfDucks.add(duckCall);
            flocksOfDucks.add(rubberDuck);
            flocksOfDucks.add(gooseDuck);

            const mallardOne = new _MallardDuck();
            const mallardTwo = new _MallardDuck();
            const mallardThree = new _MallardDuck();
            const mallardFour = new _MallardDuck();

            const flockOfMallards = new Flock();
            flockOfMallards.add(mallardOne);
            flockOfMallards.add(mallardTwo);
            flockOfMallards.add(mallardThree);
            flockOfMallards.add(mallardFour);

            const quackologist = new Quackologist();
            flocksOfDucks.registerObserver(quackologist);
            flockOfMallards.registerObserver(quackologist);

            console.log("Duck Simulator");

            this.simulate(flocksOfDucks);
            this.simulate(flockOfMallards);
        } else if (duck) {
            duck.quack();
        } else {
            console.log("Duck Simulator");

            const mallardDuck = new QuackCounter(new _MallardDuck());
            const redheadDuck = new QuackCounter(new RedheadDuck());
            const duckCall = new QuackCounter(new DuckCall());
            const rubberDuck = new QuackCounter(new RubberDuck());
            const goose = new Goose();
            const gooseDuck = new QuackCounter(new GooseAdapter(goose));

            this.simulate(mallardDuck);
            this.simulate(redheadDuck);
            this.simulate(duckCall);
            this.simulate(rubberDuck);
            this.simulate(gooseDuck);

            console.log(`The ducks quacked ${QuackCounter.getQuacks()} times`);
        }
    }
}


const simulator = new DuckSimulator();
simulator.main();