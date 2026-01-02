import { Request, Response, NextFunction } from 'express';

class HttpError extends Error {
    public statusCode: number;
    
    constructor(message: string, statusCode: number, name: string) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

class ValidationError extends HttpError {
    constructor(message: string) {
        super(message, 400, 'ValidationError');
    }
}

class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404, 'NotFoundError');
    }
}

class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(message, 401, 'UnauthorizedError');
    }
}

class ForbiddenError extends HttpError {
    constructor(message: string) {
        super(message, 403, 'ForbiddenError');
    }
}

class InternalServerError extends HttpError {
    constructor(message: string) {
        super(message, 500, 'InternalServerError');
    }
}

class ConflictError extends HttpError {
    constructor(message: string) {
        super(message, 409, 'ConflictError');
    }
}

class BadRequestError extends HttpError {
    constructor(message: string) {
        super(message, 400, 'BadRequestError');
    }
}

class UnprocessableEntityError extends HttpError {
    constructor(message: string) {
        super(message, 422, 'UnprocessableEntityError');
    }
}

class TooManyRequestsError extends HttpError {
    constructor(message: string) {
        super(message, 429, 'TooManyRequestsError');
    }
}

class ServiceUnavailableError extends HttpError {
    constructor(message: string) {
        super(message, 503, 'ServiceUnavailableError');
    }
}

class GatewayTimeoutError extends HttpError {
    constructor(message: string) {
        super(message, 504, 'GatewayTimeoutError');
    }
}

function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Handle HttpError instances
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            error: {
                name: err.name,
                message: err.message,
                statusCode: err.statusCode
            }
        });
    }

    // Handle unexpected errors
    console.error('Unexpected error:', err);
    return res.status(500).json({
        error: {
            name: 'InternalServerError',
            message: 'An unexpected error occurred',
            statusCode: 500
        }
    });
}

export {
    HttpError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
    ConflictError,
    BadRequestError,
    UnprocessableEntityError,
    TooManyRequestsError,
    ServiceUnavailableError,
    GatewayTimeoutError,
    errorHandler
};