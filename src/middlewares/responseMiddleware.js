export const responseEnvelope = (req, res, next) => {
  res.success = (data, meta) => {
    const payload = { success: true, data: data ?? null };
    if (meta !== undefined) payload.meta = meta;
    return res.json(payload);
  };

  next();
};
