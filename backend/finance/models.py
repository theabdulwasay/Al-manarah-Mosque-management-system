from django.db import models
from members.models import Member


class DonationCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Donation(models.Model):
    class PaymentMethod(models.TextChoices):
        CASH = 'cash', 'Cash'
        BANK_TRANSFER = 'bank_transfer', 'Bank Transfer'
        ONLINE = 'online', 'Online Payment'
        CHEQUE = 'cheque', 'Cheque'

    donor_name = models.CharField(max_length=150)
    donor = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    category = models.ForeignKey(DonationCategory, on_delete=models.SET_NULL, null=True, related_name='donations')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.CASH)
    receipt_number = models.CharField(max_length=50, blank=True)
    is_anonymous = models.BooleanField(default=False)
    is_recurring = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.donor_name} - {self.amount}"


class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Expense(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.SET_NULL, null=True, related_name='expenses')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    paid_to = models.CharField(max_length=150, blank=True)
    approved_by = models.CharField(max_length=150, blank=True)
    receipt = models.FileField(upload_to='expense_receipts/', blank=True, null=True)
    notes = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.amount}"
