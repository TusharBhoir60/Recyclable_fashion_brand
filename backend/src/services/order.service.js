const prisma = require('../utils/prisma');

async function createOrder({ userId, items, shippingAddress }) {
  const productIds = items.map(i => i.productId);
  const products   = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = Object.fromEntries(products.map(p => [p.id, p]));

  let totalAmount = 0;
  const orderItems = await Promise.all(
    items.map(async ({ productId, quantity, customizationId }) => {
      const product = productMap[productId];
      if (!product) throw Object.assign(new Error(`Product ${productId} not found`), { status: 404 });

      let extraCharge = 0;
      if (customizationId) {
        const c = await prisma.customization.findUnique({ where: { id: customizationId } });
        extraCharge = c?.extraCharge ?? 0;
      }

      const unitPrice = product.basePrice + extraCharge;
      totalAmount += unitPrice * quantity;
      return { productId, quantity, unitPrice, customizationId: customizationId || null };
    })
  );

  return prisma.$transaction(async (tx) =>
    tx.order.create({
      data: { userId, totalAmount, shippingAddress, items: { create: orderItems } },
      include: { items: true },
    })
  );
}

async function getUserOrders(userId) {
  return prisma.order.findMany({
    where:   { userId },
    include: { items: { include: { product: true, customization: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function getOrderById(id, userId) {
  const order = await prisma.order.findUnique({
    where:   { id },
    include: { items: { include: { product: true, customization: true } } },
  });
  if (!order)               throw Object.assign(new Error('Order not found'), { status: 404 });
  if (order.userId !== userId) throw Object.assign(new Error('Forbidden'),    { status: 403 });
  return order;
}

module.exports = { createOrder, getUserOrders, getOrderById };