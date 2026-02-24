abstract class CaffeeineBeverageWithHook {

    abstract brew(): void

    boilWater(): void {
        console.log("Boiling")
    }

    pourInCup(): void {
        console.log("Pouring into cup")
    }

    abstract addCondiments(): void

    customerWantsCondiments(): boolean {
        return true
    }

    prepareRecipe(): void {
        this.boilWater()
        this.brew()
        this.pourInCup()
        if (this.customerWantsCondiments()) this.addCondiments()
    }

    hook(): void { }
}

class CoffeeWithHoos extends CaffeeineBeverageWithHook {
    brew(): void {
        console.log("Dripping coffee with filter")
    }

    addCondiments(): void {
        throw new Error("Method not implemented.")
    }

    customerWantsCondiments(): boolean {
        console.log("No, coffee is good already!")
        return false
    }

}