export class Notification {
    private success: boolean;
    private errors: string[] = [];

    public setSuccess(success: boolean) {
        this.success = success;
    }

    public getSuccess(): boolean {
        return this.success;
    }

    public addError(error: string) {
        this.errors.push(error);
        this.setSuccess(false);
    }

    public clearErrors() {
        this.errors = [];
    }

    public hasError(): boolean {
        return !this.errors.length;
    }
}