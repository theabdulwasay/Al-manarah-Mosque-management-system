from rest_framework.routers import DefaultRouter
from .views import (DonationViewSet, DonationCategoryViewSet, ExpenseViewSet,
                     ExpenseCategoryViewSet, FinanceSummaryView)

router = DefaultRouter()
router.register('donations', DonationViewSet, basename='donation')
router.register('donation-categories', DonationCategoryViewSet, basename='donation-category')
router.register('expenses', ExpenseViewSet, basename='expense')
router.register('expense-categories', ExpenseCategoryViewSet, basename='expense-category')
router.register('summary', FinanceSummaryView, basename='finance-summary')

urlpatterns = router.urls
