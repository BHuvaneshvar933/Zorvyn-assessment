import FinancialRecord from "../models/FinancialRecord.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const buildDateMatch = ({ startDate, endDate }) => {
  if (!startDate && !endDate) return undefined;

  const date = {};
  if (startDate) date.$gte = new Date(startDate);
  if (endDate) date.$lte = new Date(endDate);
  return date;
};

export const getSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate, category } = req.query;
  const dateMatch = buildDateMatch({ startDate, endDate });

  const match = { isDeleted: false };
  if (dateMatch) match.date = dateMatch;
  if (category) match.category = category;

  const result = await FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" }
      }
    }
  ]);

  let income = 0;
  let expense = 0;

  result.forEach(item => {
    if (item._id === "INCOME") income = item.total;
    if (item._id === "EXPENSE") expense = item.total;
  });

  res.success({
    totalIncome: income,
    totalExpense: expense,
    netBalance: income - expense
  });
});

export const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const { startDate, endDate, type } = req.query;
  const dateMatch = buildDateMatch({ startDate, endDate });

  const match = { isDeleted: false };
  if (dateMatch) match.date = dateMatch;
  if (type) match.type = type;

  const result = await FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        incomeTotal: {
          $sum: {
            $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0]
          }
        },
        expenseTotal: {
          $sum: {
            $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0]
          }
        }
      }
    },
    {
      $addFields: {
        netBalance: { $subtract: ["$incomeTotal", "$expenseTotal"] },
        total: { $add: ["$incomeTotal", "$expenseTotal"] }
      }
    },
    { $sort: { total: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        incomeTotal: 1,
        expenseTotal: 1,
        netBalance: 1,
        total: 1
      }
    }
  ]);

  res.success(result);
});

export const getTrends = asyncHandler(async (req, res) => {
  const { startDate, endDate, interval = "month", category } = req.query;
  const dateMatch = buildDateMatch({ startDate, endDate });

  const match = { isDeleted: false };
  if (dateMatch) match.date = dateMatch;
  if (category) match.category = category;

  const groupId =
    interval === "week"
      ? {
          year: { $isoWeekYear: "$date" },
          week: { $isoWeek: "$date" }
        }
      : {
          year: { $year: "$date" },
          month: { $month: "$date" }
        };

  const sort =
    interval === "week"
      ? { "_id.year": 1, "_id.week": 1 }
      : { "_id.year": 1, "_id.month": 1 };

  const project =
    interval === "week"
      ? {
          _id: 0,
          year: "$_id.year",
          week: "$_id.week",
          income: 1,
          expense: 1,
          netBalance: { $subtract: ["$income", "$expense"] }
        }
      : {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          income: 1,
          expense: 1,
          netBalance: { $subtract: ["$income", "$expense"] }
        };

  const result = await FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: groupId,
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0]
          }
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0]
          }
        }
      }
    },
    { $sort: sort },
    { $project: project }
  ]);

  res.success(result);
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const { startDate, endDate, type, category } = req.query;
  const dateMatch = buildDateMatch({ startDate, endDate });

  const limitRaw = parseInt(req.query.limit ?? "10", 10) || 10;
  const limit = Math.min(Math.max(limitRaw, 1), 50);

  const match = { isDeleted: false };
  if (dateMatch) match.date = dateMatch;
  if (type) match.type = type;
  if (category) match.category = category;

  const records = await FinancialRecord.find(match)
    .sort({ date: -1, createdAt: -1 })
    .limit(limit);

  res.success(records, { limit });
});
