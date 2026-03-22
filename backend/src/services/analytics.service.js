const prisma = require('../utils/prisma');

async function getOverview() {
  const [totalUsers, totalOrders, totalProducts, revenueAgg] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({ where: { status: { not: 'CANCELLED' } }, _sum: { totalAmount: true } }),
  ]);

  return {
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue: revenueAgg._sum.totalAmount ?? 0,
  };
}

async function getRevenueByDay(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const orders = await prisma.order.findMany({
    where:   { status: { not: 'CANCELLED' }, createdAt: { gte: since } },
    select:  { createdAt: true, totalAmount: true },
    orderBy: { createdAt: 'asc' },
  });

  const byDay = {};
  for (const o of orders) {
    const day = o.createdAt.toISOString().slice(0, 10);
    byDay[day] = (byDay[day] ?? 0) + o.totalAmount;
  }
  return Object.entries(byDay).map(([date, revenue]) => ({ date, revenue }));
}

async function getSegmentBreakdown() {
  const groups = await prisma.user.groupBy({ by: ['segment'], _count: { _all: true } });
  return groups.map(g => ({ segment: g.segment, count: g._count._all }));
}

async function getOrdersByStatus() {
  const groups = await prisma.order.groupBy({ by: ['status'], _count: { _all: true } });
  return groups.map(g => ({ status: g.status, count: g._count._all }));
}

module.exports = { getOverview, getRevenueByDay, getSegmentBreakdown, getOrdersByStatus };