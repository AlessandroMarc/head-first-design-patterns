
class HomeTheatherElement {
    on() {
        console.log(`${this.constructor.name} on`)
    }
    off() {
        console.log(`${this.constructor.name} off`)
    }
}

class Amplifier extends HomeTheatherElement {
    on() {
        console.log("Amplifier on")
    }
    off() {
        console.log("Amplifier off")
    }
}

class Tuner extends HomeTheatherElement { }

class DvdPlayer extends HomeTheatherElement { }

class CdPlayer extends HomeTheatherElement { }

class Projector extends HomeTheatherElement { }

class TheaterLights extends HomeTheatherElement { }

class Screen extends HomeTheatherElement { }

class PopcornPopper extends HomeTheatherElement { }

// facade pattern
class HomeTheaterFacade {
    private amplifier: Amplifier
    private tuner: Tuner
    private dvdPlayer: DvdPlayer
    private cdPlayer: CdPlayer
    private projector: Projector
    private theaterLights: TheaterLights
    private screen: Screen
    private popcornPopper: PopcornPopper

    constructor(
        amplifier: Amplifier,
        tuner: Tuner,
        dvdPlayer: DvdPlayer,
        cdPlayer: CdPlayer,
        projector: Projector,
        theaterLights: TheaterLights,
        screen: Screen,
        popcornPopper: PopcornPopper
    ) {
        this.amplifier = amplifier
        this.tuner = tuner
        this.dvdPlayer = dvdPlayer
        this.cdPlayer = cdPlayer
        this.projector = projector
        this.theaterLights = theaterLights
        this.screen = screen
        this.popcornPopper = popcornPopper
    }

    watchMovie(movie: string) {
        console.log(`Get ready to watch a movie...`)
        this.popcornPopper.on()
        this.popcornPopper.off()
        this.theaterLights.on()
        this.screen.on()
        this.projector.on()
        this.amplifier.on()
        this.dvdPlayer.on()
    }

    endMovie() {
        console.log(`Shutting movie theater down...`)
        this.popcornPopper.off()
        this.theaterLights.off()
        this.screen.off()
        this.projector.off()
        this.amplifier.off()
        this.dvdPlayer.off()
    }
}