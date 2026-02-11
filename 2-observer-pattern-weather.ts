/*
class BadWeatherData {
    public measurementsChanged() {
        let temp: number = getTemperature();
        let humidity: number = getHumidity();
        let pressure: number = getPressure();

        currentConditionsDisplay.update(temp, humidity, pressure);
        statisticsDisplay.update(temp, humidity, pressure);
        forecastDisplay.update(temp, humidity, pressure);
    }
}
*/

interface Subject {
    registerObserver(o: Observer): void;
    removeObserver(o: Observer): void;
    notifyObservers(): void;
}

interface Observer {
    update(temp: number, humidity: number, pressure: number): void;
}

interface DisplayElement {
    display(): void;
}

class ConcreteSubject implements Subject {
    registerObserver(o: Observer): void {
        throw new Error("Method not implemented.");
    }
    removeObserver(o: Observer): void {
        throw new Error("Method not implemented.");
    }
    notifyObservers(): void {
        throw new Error("Method not implemented.");
    }

    getState() { }
    setState() { }
}

class ConcreteObserver implements Observer {
    update(): void {
        throw new Error("Method not implemented.");
    }
}

class WeatherData implements Subject {
    private observers: Observer[] = [];
    private temperature: number = 0;
    private humidity: number = 0
    private pressure: number = 0;

    registerObserver(o: Observer): void {
        this.observers.push(o);
    }

    removeObserver(o: Observer): void {
        const index = this.observers.indexOf(o);
        if (index >= 0) {
            this.observers.splice(index, 1);
        }
    }
    notifyObservers(): void {
        this.observers.forEach(observer => {
            observer.update(this.temperature, this.humidity, this.pressure);
        });
    }

    measturementChanged() {
        this.notifyObservers();
    }

    setMeasurements(temperature: number, humidity: number, pressure: number) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        this.measturementChanged();
    }

    getTemperature(): number {
        return this.temperature;
    }

    getHumidity(): number {
        return this.humidity;
    }

    getPressure(): number {
        return this.pressure;
    }
}

class CurrentConditionsDisplay implements Observer, DisplayElement {
    private temperature: number = 0;
    private humidity: number = 0;
    private pressure: number = 0;
    private weatherData: WeatherData;

    constructor(weatherData: WeatherData) {
        this.weatherData = weatherData;
        weatherData.registerObserver(this);
    }

    update(temp: number, humidity: number, pressure: number): void {
        this.temperature = temp;
        this.humidity = humidity;
        this.pressure = pressure;
        this.display();
    }

    display(): void {
        console.log(`Current conditions: ${this.temperature}F degrees and ${this.humidity}% humidity and ${this.pressure} pressure`);
    }
}

class StatisticsDisplay implements Observer, DisplayElement {
    update(): void {
        throw new Error("Method not implemented.");
    }
    display(): void {
        throw new Error("Method not implemented.");
    }
}

class ForecastDisplay implements Observer, DisplayElement {
    update(): void {
        throw new Error("Method not implemented.");
    }
    display(): void {
        throw new Error("Method not implemented.");
    }
}

class ThirdPartyDisplay implements Observer, DisplayElement {
    update(): void {
        throw new Error("Method not implemented.");
    }
    display(): void {
        throw new Error("Method not implemented.");
    }
}

class AvgMaxMinDisplay implements Observer, DisplayElement {
    private currentTemperature: number = 80;
    private previousTemperature: number = 80;
    private minTemperature: number = 80;
    private maxTemperature: number = 80

    constructor(weatherData: WeatherData) {
        weatherData.registerObserver(this);
    }

    update(temp: number, humidity: number, pressure: number): void {
        this.previousTemperature = this.currentTemperature;
        this.currentTemperature = temp;
        this.minTemperature = Math.min(this.minTemperature, temp);
        this.maxTemperature = Math.max(this.maxTemperature, temp);
        this.display();
    }

    display(): void {
        var message = this.getTemperatureStatus();

        console.log(`Avg/Max/Min temperature: Current = ${this.currentTemperature}, Previous = ${this.previousTemperature}. ${message}. Max = ${this.maxTemperature}, Min = ${this.minTemperature}`);
    }

    private getTemperatureStatus(): "Temperature is falling" | "Temperature is rising" | "Temperature is stable" {
        let message: "Temperature is falling" | "Temperature is rising" | "Temperature is stable";
        message = this.currentTemperature > this.previousTemperature ? "Temperature is rising" : (this.currentTemperature < this.previousTemperature ? "Temperature is falling" : "Temperature is stable");
        return message;
    }
}

class WeatherStation {
    public static main(): void {
        const weatherData = new WeatherData();

        const currentDisplay = new CurrentConditionsDisplay(weatherData);
        const statisticsDisplay = new StatisticsDisplay();
        const forecastDisplay = new ForecastDisplay();
        const avgMaxMinDisplay = new AvgMaxMinDisplay(weatherData);

        weatherData.setMeasurements(80, 65, 30.4);
        weatherData.setMeasurements(82, 70, 29.2);
        weatherData.setMeasurements(78, 90, 29.2);
    }
}

WeatherStation.main();