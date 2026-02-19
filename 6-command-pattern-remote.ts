class Command {
    execute() { }
    undo() { }
}

class Light {
    location: string;

    constructor(location: string) {
        this.location = location;
    }

    off() {
        console.log(`${this.location} light is off`);
    }

    on() {
        console.log(`${this.location} light is on`);
    }
}

class Stereo {
    on() {
        console.log("Stereo is on");
    }

    off() {
        console.log("Stereo is off");
    }

    setCD() {
        console.log("Stereo is set for CD input");
    }

    setVolume(volume: number) {
        console.log(`Stereo volume set to ${volume}`);
    }
}

class RemoteControl {
    onCommands: Command[] = [];
    offCommands: Command[] = []

    setCommand(slot: number, onCommand: Command, offCommand: Command) {
        this.onCommands[slot] = onCommand;
        this.offCommands[slot] = offCommand;
    }

    onButtonWasPushed(slot: number) {
        this.onCommands[slot].execute();
    }

    offButtonWasPushed(slot: number) {
        this.offCommands[slot].execute();
    }

    toString() {
        let stringBuff = "\n------ Remote Control -------\n";
        for (let i = 0; i < this.onCommands.length; i++) {
            stringBuff += `[slot ${i}] ${this.onCommands[i].constructor.name}    ${this.offCommands[i].constructor.name}\n`;
        }
        return stringBuff;
    }
}


class LightOffCommand implements Command {
    light: Light

    constructor(light: Light) {
        this.light = light;
    }

    execute() {
        this.light.off();
    }

    undo() {
        this.light.on();
    }
}

class StereoOnWithCDCommand implements Command {
    stereo: Stereo;

    constructor(stereo: Stereo) {
        this.stereo = stereo;
    }

    execute() {
        this.stereo.on();
        this.stereo.setCD();
        this.stereo.setVolume(11);
    }

    undo() {
        this.stereo.off()
    }
}

class NoCommand implements Command {
    execute(): void {
        // do nothing
    }

    undo(): void {
        // do nothing
    }
}

class FirstRemoteLoader {
    static main(): void {
        const remoteControl = new RemoteControl();

        const livingRoomLight = new Light("Living Room");
        const kitchenLight = new Light("Kitchen");
        const stereo = new Stereo();

        const livingRoomLightOff = new LightOffCommand(livingRoomLight);
        const livingRoomLightOn = new LightOffCommand(livingRoomLight);
        const stereoOnWithCD = new StereoOnWithCDCommand(stereo);
        const stereoOff = new StereoOnWithCDCommand(stereo);
        const kitchenLightOff = new LightOffCommand(kitchenLight);
        const kitchenLightOn = new LightOffCommand(kitchenLight);

        remoteControl.setCommand(0, livingRoomLightOn, livingRoomLightOff);
        remoteControl.setCommand(1, stereoOnWithCD, stereoOff);
        remoteControl.setCommand(2, kitchenLightOn, kitchenLightOff);

        console.log(remoteControl.toString());
    }
}

class RemoteLoaderWithUndo {
    onCommands: Command[] = [];
    offCommands: Command[] = []
    undoCommand: Command

    constructor() {
        for (let i = 0; i < 7; i++) {
            this.onCommands[i] = new NoCommand();
            this.offCommands[i] = new NoCommand();
        }

        this.undoCommand = new NoCommand();
    }

    setCommand(slot: number, onCommand: Command, offCommand: Command) {
        this.onCommands[slot] = onCommand;
        this.offCommands[slot] = offCommand;
    }

    onButtonWasPushed(slot: number) {
        this.onCommands[slot].execute();
        this.undoCommand = this.onCommands[slot];
    }

    offButtonWasPushed(slot: number) {
        this.offCommands[slot].execute();
        this.undoCommand = this.offCommands[slot];
    }

    undoButtonWasPushed() {
        this.undoCommand.undo();
    }

    toString() {
        let stringBuff = "\n------ Remote Control -------\n";
        for (let i = 0; i < this.onCommands.length; i++) {
            stringBuff += `[slot ${i}] ${this.onCommands[i].constructor.name}    ${this.offCommands[i].constructor.name}\n`;
        }
        return stringBuff;
    }
}

// Managing state
class CeilingFan {
    static HIGH = 3
    static MEDIUM = 2
    static LOW = 1
    static OFF = 0

    location: string
    speed: number

    constructor(location: string) {
        this.location = location;
        this.speed = CeilingFan.OFF;
    }

    high() {
        this.speed = CeilingFan.HIGH;
        console.log(`${this.location} ceiling fan is on high`);
    }

    medium() {
        this.speed = CeilingFan.MEDIUM;
        console.log(`${this.location} ceiling fan is on medium`);
    }

    low() {
        this.speed = CeilingFan.LOW;
        console.log(`${this.location} ceiling fan is on low`);
    }

    off() {
        this.speed = CeilingFan.OFF;
        console.log(`${this.location} ceiling fan is off`);
    }

    getSpeed() {
        return this.speed;
    }
}

class CeilingFanMediumCommand implements Command {
    ceilingFan: CeilingFan;
    prevSpeed: number;

    constructor(ceilingFan: CeilingFan) {
        this.ceilingFan = ceilingFan;
        this.prevSpeed = ceilingFan.getSpeed();
    }

    execute() {
        this.prevSpeed = this.ceilingFan.getSpeed();
        this.ceilingFan.medium();
    }

    undo() {
        if (this.prevSpeed === CeilingFan.HIGH) {
            this.ceilingFan.high();
        } else if (this.prevSpeed === CeilingFan.MEDIUM) {
            this.ceilingFan.medium();
        } else if (this.prevSpeed === CeilingFan.LOW) {
            this.ceilingFan.low();
        } else if (this.prevSpeed === CeilingFan.OFF) {
            this.ceilingFan.off();
        }
    }
}

class CeilingFanHighCommand implements Command {
    ceilingFan: CeilingFan;
    prevSpeed: number;

    constructor(ceilingFan: CeilingFan) {
        this.ceilingFan = ceilingFan;
        this.prevSpeed = ceilingFan.getSpeed();
    }

    execute() {
        this.prevSpeed = this.ceilingFan.getSpeed();
        this.ceilingFan.high();
    }

    undo() {
        if (this.prevSpeed === CeilingFan.HIGH) {
            this.ceilingFan.high();
        } else if (this.prevSpeed === CeilingFan.MEDIUM) {
            this.ceilingFan.medium();
        } else if (this.prevSpeed === CeilingFan.LOW) {
            this.ceilingFan.low();
        } else if (this.prevSpeed === CeilingFan.OFF) {
            this.ceilingFan.off();
        }
    }
}

class CeilingFanLowCommand implements Command {
    ceilingFan: CeilingFan;
    prevSpeed: number;

    constructor(ceilingFan: CeilingFan) {
        this.ceilingFan = ceilingFan;
        this.prevSpeed = ceilingFan.getSpeed();
    }

    execute() {
        this.prevSpeed = this.ceilingFan.getSpeed();
        this.ceilingFan.low();
    }

    undo() {
        if (this.prevSpeed === CeilingFan.HIGH) {
            this.ceilingFan.high();
        } else if (this.prevSpeed === CeilingFan.MEDIUM) {
            this.ceilingFan.medium();
        } else if (this.prevSpeed === CeilingFan.LOW) {
            this.ceilingFan.low();
        } else if (this.prevSpeed === CeilingFan.OFF) {
            this.ceilingFan.off();
        }
    }
}

class CeilingFanOffCommand implements Command {
    ceilingFan: CeilingFan;
    prevSpeed: number;

    constructor(ceilingFan: CeilingFan) {
        this.ceilingFan = ceilingFan;
        this.prevSpeed = ceilingFan.getSpeed();
    }

    execute() {
        this.prevSpeed = this.ceilingFan.getSpeed();
        this.ceilingFan.off();
    }

    undo() {
        if (this.prevSpeed === CeilingFan.HIGH) {
            this.ceilingFan.high();
        } else if (this.prevSpeed === CeilingFan.MEDIUM) {
            this.ceilingFan.medium();
        } else if (this.prevSpeed === CeilingFan.LOW) {
            this.ceilingFan.low();
        } else if (this.prevSpeed === CeilingFan.OFF) {
            this.ceilingFan.off();
        }
    }
}

class RemoteLoader {
    remoteControl: RemoteLoaderWithUndo;
    ceilingFan: CeilingFan;

    constructor() {
        this.remoteControl = new RemoteLoaderWithUndo();
        this.ceilingFan = new CeilingFan("Living Room");
    }

    main() {
        const ceilingFanMedium = new CeilingFanMediumCommand(this.ceilingFan);
        const ceilingFanHigh = new CeilingFanHighCommand(this.ceilingFan);
        const ceilingFanLow = new CeilingFanLowCommand(this.ceilingFan);
        const ceilingFanOff = new CeilingFanOffCommand(this.ceilingFan);

        this.remoteControl.setCommand(0, ceilingFanMedium, ceilingFanOff);
        this.remoteControl.setCommand(1, ceilingFanHigh, ceilingFanOff);
        this.remoteControl.setCommand(2, ceilingFanLow, ceilingFanOff);

        console.log(this.remoteControl.toString());

        this.remoteControl.onButtonWasPushed(0);
        this.remoteControl.offButtonWasPushed(0);
        console.log("Undoing...");
        this.remoteControl.undoButtonWasPushed();

        this.remoteControl.onButtonWasPushed(1);
        console.log("Undoing...");
        this.remoteControl.undoButtonWasPushed();

        this.remoteControl.onButtonWasPushed(2);
        console.log("Undoing...");
        this.remoteControl.undoButtonWasPushed();

    }
}

const remote = new RemoteLoader();
remote.main();

class MacroCommand implements Command {
    commands:Command[]

    constructor (commands : Command[] ) {
        this.commands = commands
    }

    execute() {
        this.commands.forEach(command => command.execute())
    }

    undo(){
        this.commands.forEach(command => command.undo())
    }
}
