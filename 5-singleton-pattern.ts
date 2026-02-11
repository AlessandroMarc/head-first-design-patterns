class Singleton {
    static uniqueInstance: Singleton;

    private constructor() { }

    public static getInstance(): Singleton {
        if (this.uniqueInstance === undefined) {
            this.uniqueInstance = new Singleton();
        }
        return this.uniqueInstance;
    }
}

enum SingletonEnum {
    INSTANCE
}

class SingletonEnumClass {
    public static getInstance(): SingletonEnum {
        return SingletonEnum.INSTANCE;
    }
}