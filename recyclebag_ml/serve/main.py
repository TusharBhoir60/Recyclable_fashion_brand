from routers.visual_search_router import router as visual_search_router
app.include_router(visual_search_router, prefix="/visual-search", tags=["visual-search"])