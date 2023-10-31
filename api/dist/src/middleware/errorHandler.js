export const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.json({
        status,
        message: err.message
    });
};
