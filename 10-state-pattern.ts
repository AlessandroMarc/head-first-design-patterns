class GunballMachineV1 {
    SOLD_OUT = 0;
    NO_QUARTER = 1
    HAS_QUARTER = 2;
    SOLD = 3;

    state: number = this.SOLD_OUT;
    count: number = 0;

    constructor(count: number) {
        this.count = count;
        if (count > 0) {
            this.state = this.NO_QUARTER;
        }
    }

    insertQuarter(): void {
        if (this.state === this.HAS_QUARTER) {
            console.log("You can't insert another quarter");
        } else if (this.state === this.NO_QUARTER) {
            this.state = this.HAS_QUARTER;
            console.log("You inserted a quarter");
        } else if (this.state === this.SOLD_OUT) {
            console.log("You can't insert a quarter, the machine is sold out");
        } else if (this.state === this.SOLD) {
            console.log("Please wait, we're already giving you a gumball");
        }
    }

    ejectQuarter(): void {
        if (this.state === this.HAS_QUARTER) {
            console.log("Quarter returned");
            this.state = this.NO_QUARTER;
        } else if (this.state === this.NO_QUARTER) {
            console.log("You haven't inserted a quarter");
        } else if (this.state === this.SOLD_OUT) {
            console.log("You can't eject, you haven't inserted a quarter yet");
        } else if (this.state === this.SOLD) {
            console.log("Sorry, you already turned the crank");
        }
    }

    turnCrank(): void {
        if (this.state === this.SOLD) {
            console.log("Turning twice doesn't get you another gumball!");
        } else if (this.state === this.NO_QUARTER) {
            console.log("You turned but there's no quarter");
        } else if (this.state === this.SOLD_OUT) {
            console.log("You turned but there are no gumballs");
        } else if (this.state === this.HAS_QUARTER) {
            console.log("You turned...");
            this.state = this.SOLD;
            this.dispense();
        }
    }

    dispense(): void {
        if (this.state === this.SOLD) {
            console.log("A gumball comes rolling out the slot...");
            this.count = this.count - 1;
            if (this.count === 0) {
                console.log("Oops, out of gumballs!");
                this.state = this.SOLD_OUT;
            } else {
                this.state = this.NO_QUARTER;
            }
        } else if (this.state === this.NO_QUARTER) {
            console.log("You need to pay first");
        } else if (this.state === this.SOLD_OUT) {
            console.log("No gumball dispensed");
        } else if (this.state === this.HAS_QUARTER) {
            console.log("No gumball dispensed");
        }
    }
}

interface State {
    insertQuarter(): void;
    ejectQuarter(): void;
    turnCrank(): void;
    dispense(): void;
}

class NoQuarterState implements State {
    gumballMachine: GumballMachine

    constructor(gumballMachine: GumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    insertQuarter(): void {
        console.log("You inserted a quarter");
        this.gumballMachine.setState(this.gumballMachine.getHasQuarterState());
    }

    ejectQuarter(): void {
        console.log("You haven't inserted a quarter");
    }

    turnCrank(): void {
        console.log("You turned but there's no quarter");
    }

    dispense(): void {
        console.log("You need to pay first");
    }
}

class HasQuarterState implements State {
    gumballMachine: GumballMachine

    constructor(gumballMachine: GumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    insertQuarter(): void {
        console.log("You can't insert another quarter");
    }

    ejectQuarter(): void {
        console.log("Quarter returned");
        this.gumballMachine.setState(this.gumballMachine.getNoQuarterState());
    }

    turnCrank(): void {
        console.log("You turned...");
        let winner: number = Math.floor(Math.random() * 10);
        if (winner === 0 && this.gumballMachine.getCount() > 1) {
            this.gumballMachine.setState(this.gumballMachine.getWinnerState());
        } else {
            this.gumballMachine.setState(this.gumballMachine.getSoldState());
        }
    }

    dispense(): void {
        console.log("No gumball dispensed");
    }
}

class SoldState implements State {
    gumballMachine: GumballMachine

    constructor(gumballMachine: GumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    insertQuarter(): void {
        console.log("Please wait, we're already giving you a gumball");
    }

    ejectQuarter(): void {
        console.log("Sorry, you already turned the crank");
    }

    turnCrank(): void {
        console.log("Turning twice doesn't get you another gumball!");
    }

    dispense(): void {
        this.gumballMachine.dispense();
    }
}

class SoldOutState implements State {
    gumballMachine: GumballMachine

    constructor(gumballMachine: GumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    insertQuarter(): void {
        console.log("You can't insert a quarter, the machine is sold out");
    }

    ejectQuarter(): void {
        console.log("You can't eject, you haven't inserted a quarter yet");
    }

    turnCrank(): void {
        console.log("You turned, but there are no gumballs");
    }

    dispense(): void {
        console.log("No gumball dispensed");
    }
}

class WinnerState implements State {
    gumballMachine: GumballMachine

    constructor(gumballMachine: GumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    insertQuarter(): void {
        console.log("Please wait, we're already giving you a gumball");
    }

    ejectQuarter(): void {
        console.log("Sorry, you already turned the crank");
    }

    turnCrank(): void {
        console.log("Turning twice doesn't get you another gumball!");
    }

    dispense(): void {
        this.gumballMachine.releaseBall();
        if (this.gumballMachine.getCount() == 0) {
            this.gumballMachine.setState(this.gumballMachine.getSoldOutState());
        } else {
            console.log("You are a winner!");
            this.gumballMachine.releaseBall();
            if (this.gumballMachine.getCount() == 0) {
                this.gumballMachine.setState(this.gumballMachine.getSoldOutState());
            } else {
                this.gumballMachine.setState(this.gumballMachine.getNoQuarterState());
            }
        }
    }
}

export class GumballMachine {
    noQuarterState: NoQuarterState;
    hasQuarterState: HasQuarterState;
    soldState: SoldState;
    soldOutState: SoldOutState;
    winnerState: WinnerState;
    location: string

    state: State;
    count: number = 0;

    constructor(count: number, location: string) {
        this.noQuarterState = new NoQuarterState(this);
        this.hasQuarterState = new HasQuarterState(this);
        this.soldState = new SoldState(this);
        this.soldOutState = new SoldOutState(this);
        this.winnerState = new WinnerState(this);
        this.count = count;
        this.state = count > 0 ? this.noQuarterState : this.soldOutState;
        this.location = location
    }

    setState(state: State): void {
        this.state = state;
    }

    getNoQuarterState(): State {
        return this.noQuarterState;
    }

    getHasQuarterState(): State {
        return this.hasQuarterState;
    }

    getSoldState(): State {
        return this.soldState;
    }

    getSoldOutState(): State {
        return this.soldOutState;
    }

    insertQuarter(): void {
        this.state.insertQuarter();
    }

    ejectQuarter(): void {
        this.state.ejectQuarter();
    }

    getCount(): number {
        return this.count;
    }

    turnCrank(): void {
        this.state.turnCrank();
        this.state.dispense();
    }

    getWinnerState(): State {
        return this.winnerState;
    }

    dispense(): void {
        this.releaseBall();
        if (this.count === 0) {
            console.log("Oops, out of gumballs!");
            this.setState(this.getSoldOutState());
        } else {
            this.setState(this.getNoQuarterState());
        }
    }

    releaseBall() {
        if (this.count > 0) {
            console.log("A gumball comes rolling out the slot...");
            this.count = this.count - 1;
        }
    }
}

class GumballMachineTestDrive {
    main(): void {
        const gumballMachine: GumballMachine = new GumballMachine(5, "Hall");

        console.log(gumballMachine);

        for (let attempt: number = 1; attempt <= 5; attempt++) {
            console.log(`--- Attempt ${attempt} ---`);
            gumballMachine.insertQuarter();
            gumballMachine.turnCrank();
        }

        console.log(gumballMachine);
    }
}

const testDrive: GumballMachineTestDrive = new GumballMachineTestDrive();
testDrive.main();