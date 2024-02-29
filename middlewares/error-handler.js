export function notFoundError(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
};
export function errorHandler(err, req, res, next){
    console.error(err)
    res.status(err.status || 500).json({
        message: err.message,
    })
};