from django.db import models


class Member(models.Model):
    class MembershipType(models.TextChoices):
        REGULAR = 'regular', 'Regular'
        FAMILY = 'family', 'Family'
        LIFETIME = 'lifetime', 'Lifetime'
        HONORARY = 'honorary', 'Honorary'

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        INACTIVE = 'inactive', 'Inactive'
        SUSPENDED = 'suspended', 'Suspended'

    full_name = models.CharField(max_length=150)
    father_name = models.CharField(max_length=150, blank=True)
    cnic = models.CharField(max_length=20, blank=True, help_text="National ID / CNIC number")
    phone = models.CharField(max_length=20)
    alternate_phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    photo = models.ImageField(upload_to='members/', blank=True, null=True)
    membership_type = models.CharField(max_length=20, choices=MembershipType.choices, default=MembershipType.REGULAR)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    family_members_count = models.PositiveIntegerField(default=1)
    occupation = models.CharField(max_length=100, blank=True)
    date_joined = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return self.full_name


class VolunteerCommittee(models.Model):
    class CommitteeRole(models.TextChoices):
        PRESIDENT = 'president', 'President'
        VICE_PRESIDENT = 'vice_president', 'Vice President'
        SECRETARY = 'secretary', 'Secretary'
        TREASURER = 'treasurer', 'Treasurer'
        MEMBER = 'member', 'Committee Member'
        IMAM = 'imam', 'Imam'
        MUEZZIN = 'muezzin', 'Muezzin'

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='committee_roles')
    role = models.CharField(max_length=20, choices=CommitteeRole.choices)
    term_start = models.DateField()
    term_end = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.member.full_name} - {self.get_role_display()}"
