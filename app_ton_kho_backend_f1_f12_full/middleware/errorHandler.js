function notFound(req, res, next) {
  const error = new Error(`Route không tồn tại - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    ok: false,
    message: err.message || "Lỗi server",
    stack: process.env.NODE_ENV === "production" ? "🥲" : err.stack,
  });
}

module.exports = { notFound, errorHandler };
