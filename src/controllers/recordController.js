import FinancialRecord from "../models/FinancialRecord.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";


// CREATE record (ADMIN)
export const createRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  const record = await FinancialRecord.create({
    amount,
    type,
    category,
    date,
    notes,
    createdBy: req.user._id
  });

  res.status(201).success(record);
});


// GET records (ANALYST, ADMIN)
export const getRecords = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, search } = req.query;

  const pageNum = Math.max(parseInt(req.query.page ?? "1", 10) || 1, 1);
  const limitNumRaw = parseInt(req.query.limit ?? "10", 10) || 10;
  const limitNum = Math.min(Math.max(limitNumRaw, 1), 100);

  const query = { isDeleted: false };
  if (type) query.type = type;
  if (category) query.category = category;

  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    query.$or = [{ category: regex }, { notes: regex }];
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (pageNum - 1) * limitNum;

  const [records, total] = await Promise.all([
    FinancialRecord.find(query).skip(skip).limit(limitNum).sort({ date: -1 }),
    FinancialRecord.countDocuments(query)
  ]);

  res.success(records, {
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    limit: limitNum
  });
});

// GET single record (ANALYST, ADMIN)
export const getRecordById = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findById(req.params.id);

  if (!record || record.isDeleted) {
    return res.status(404).json({
      success: false,
      error: { message: "Record not found", code: "NOT_FOUND" },
      requestId: req.id || req.headers["x-request-id"]
    });
  }

  res.success(record);
});

// UPDATE record (ADMIN)
export const updateRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findById(req.params.id);

  if (!record || record.isDeleted) {
    return res.status(404).json({
      success: false,
      error: { message: "Record not found", code: "NOT_FOUND" },
      requestId: req.id || req.headers["x-request-id"]
    });
  }

  const allowed = ["amount", "type", "category", "date", "notes"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) record[key] = req.body[key];
  }
  await record.save();

  res.success(record);
});


// DELETE(ADMIN)
export const deleteRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findById(req.params.id);

  if (!record || record.isDeleted) {
    return res.status(404).json({
      success: false,
      error: { message: "Record not found", code: "NOT_FOUND" },
      requestId: req.id || req.headers["x-request-id"]
    });
  }

  record.isDeleted = true;
  await record.save();

  res.success({ message: "Record deleted (soft)" });
});
