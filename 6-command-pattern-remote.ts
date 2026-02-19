class Command {
    execute() { }
}

class Light {
    location: string;

    constructor(location: string) {
        this.location = location;
    }

    off() {
        console.log("Light is off");
    }
}

class Stereo {
    on() {
        console.log("Stereo is on");
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
}

class NoCommand implements Command {
    execute(): void {
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