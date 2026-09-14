// middleware/errorHandler.js — basic, beginner-friendly error handling

// runs when no route matches the request
function notFound(req, res, next) {
    const error = new Error(
        `Route not found: ${req.method} ${req.originalUrl}`,
    );
    error.statusCode = 404;
    next(error);
}

// catches every error passed to next(err) in the app
function errorHandler(err, req, res, next) {
    console.error(err.message);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
    });
}

module.exports = { notFound, errorHandler };
