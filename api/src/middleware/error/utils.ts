<<<<<<< HEAD
export class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
=======
export class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
};