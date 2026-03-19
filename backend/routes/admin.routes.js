// routes/admin.routes.js — add this to the backend

router.get('/ml/review-queue', auth, isAdmin, async (req, res) => {
  // In production, this reads from a DB table written by the Python service
  const items = await prisma.mlReviewQueue.findMany({
    where: { reviewed: false },
    orderBy: { createdAt: 'asc' },
    take: 50,
  });
  res.json(items);
});

router.patch('/ml/review-queue/:id', auth, isAdmin, async (req, res) => {
  const { trueLabel } = req.body;
  const item = await prisma.mlReviewQueue.update({
    where: { id: req.params.id },
    data: { trueLabel, reviewed: true, reviewedAt: new Date() },
  });
  // Trigger the Python labelling pipeline asynchronously
  await fetch(`${process.env.ML_SERVICE_URL}/active-learning/label`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  res.json(item);
});