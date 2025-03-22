export const successResponse = (res, message, data = null) => {
  res.status(200).json({ success: true, message, data });
};

export const errorResponse = (res, message, error = null, statusCode = 500) => {
  res.status(statusCode).json({ success: false, message, error });
};
