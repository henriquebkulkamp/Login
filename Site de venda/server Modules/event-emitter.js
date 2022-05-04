export default function createEventEmitter() {
    const observers = []
    function on(type, observerFunction) {
        observers.push({
            type: type,
            function: observerFunction
        })
    }
    function notifyAll(type) {
        for (const observer of observers) {
            if (observer.type === type) {
                observer.function()
            }
        }
    }
    return {
        on,
        notifyAll
    }
}