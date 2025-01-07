import express, { Request, Response, NextFunction } from 'express';

const devErrors = (err: any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const prodErrors = (err: any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    if (process.env.NODE_ENV === 'development') {
        devErrors(err, res);
    } else {
        prodErrors(err, res);
    }
};

export default globalErrorHandler;