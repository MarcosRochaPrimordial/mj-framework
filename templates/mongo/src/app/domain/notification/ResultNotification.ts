import { Notification } from "./Notification";

export class ResultNotification<T> extends Notification {
    private result: T = null;

    public setResult(result: T) {
        this.result = result;
        this.setSuccess(true);
    }

    public getResult(): T {
        return this.result;
    }
}