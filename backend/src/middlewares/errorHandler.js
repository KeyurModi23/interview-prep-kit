export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error('[Error]:', err.message);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    data: null,
    error: process.env.NODE_ENV === 'development' ? err.stack : err.status
  });
};
