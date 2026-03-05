interface BeatObserver {
    updateBeat(): void;
}

interface BPMObserver {
    updateBPM(): void;
}

interface Runnable {
    run(): void;
}

interface BeatModelInterface {
    initialize(): void;
    on(): void;
    off(): void;
    setBPM(bpm: number): void;
    getBPM(): number;
    registerBeatObserver(observer: BeatObserver): void;
    removeBeatObserver(observer: BeatObserver): void;
    registerBPMObserver(observer: BPMObserver): void;
    removeBPMObserver(observer: BPMObserver): void;
}

interface ControllerInterface {
    start(): void;
    stop(): void;
    increaseBPM(): void;
    decreaseBPM(): void;
    setBPM(bpm: number): void;
}

class BeatModelImpl implements BeatModelInterface {
    beatObservers: BeatObserver[] = [];
    bpmObservers: BPMObserver[] = [];
    bpm: number = 90;

    initialize(): void { }
    on(): void { }
    off(): void { }
    setBPM(bpm: number): void { this.bpm = bpm; this.notifyBPMObservers(); }
    getBPM(): number { return this.bpm; }

    registerBeatObserver(observer: BeatObserver): void {
        this.beatObservers.push(observer);
    }
    removeBeatObserver(observer: BeatObserver): void {
        this.beatObservers = this.beatObservers.filter(o => o !== observer);
    }
    registerBPMObserver(observer: BPMObserver): void {
        this.bpmObservers.push(observer);
    }
    removeBPMObserver(observer: BPMObserver): void {
        this.bpmObservers = this.bpmObservers.filter(o => o !== observer);
    }

    notifyBeatObservers(): void {
        for (const observer of this.beatObservers) {
            observer.updateBeat();
        }
    }
    notifyBPMObservers(): void {
        for (const observer of this.bpmObservers) {
            observer.updateBPM();
        }
    }
}

// The View holds references to both the model and the controller.
// The controller is only used by the control interface (UI controls).
class DJView implements BeatObserver, BPMObserver {
    model: BeatModelInterface;
    controller: ControllerInterface;
    bpmOutputLabel: string = "offline";
    beatBarValue: number = 0;

    constructor(controller: ControllerInterface, model: BeatModelInterface) {
        this.controller = controller;
        this.model = model;
        // Register as both a BeatObserver and a BPMObserver of the model
        model.registerBeatObserver(this);
        model.registerBPMObserver(this);
    }

    createView(): void {
        // Create all UI components here
    }

    // Called when a state change occurs in the model.
    // We update the display with the current BPM requested directly from the model.
    updateBPM(): void {
        const bpm = this.model.getBPM();
        if (bpm === 0) {
            this.bpmOutputLabel = "offline";
        } else {
            this.bpmOutputLabel = "Current BPM: " + this.model.getBPM();
        }
    }

    // Called when the model starts a new beat.
    // We pulse the beat bar by setting it to its max value (100).
    updateBeat(): void {
        this.beatBarValue = 100;
    }
}