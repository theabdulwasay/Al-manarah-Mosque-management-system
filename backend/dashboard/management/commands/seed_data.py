import random
from datetime import date, timedelta, time
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User
from members.models import Member, VolunteerCommittee
from finance.models import DonationCategory, Donation, ExpenseCategory, Expense
from events.models import Event
from announcements.models import Announcement
from prayer.models import PrayerTiming


class Command(BaseCommand):
    help = 'Seed the database with demo data for Al-Manarah Mosque Management System'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Al-Manarah demo data...')

        # --- Users ---
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin', email='admin@almanarah.org', password='admin12345',
                first_name='Abdullah', last_name='Khan', role='super_admin',
                mosque_name='Al-Manarah Central Mosque'
            )
            self.stdout.write(self.style.SUCCESS('  Created superuser: admin / admin12345'))

        if not User.objects.filter(username='imam').exists():
            User.objects.create_user(
                username='imam', email='imam@almanarah.org', password='imam12345',
                first_name='Muhammad', last_name='Siddiqui', role='imam'
            )
        if not User.objects.filter(username='treasurer').exists():
            User.objects.create_user(
                username='treasurer', email='treasurer@almanarah.org', password='treasurer12345',
                first_name='Yusuf', last_name='Ahmed', role='treasurer'
            )

        # --- Members ---
        names = [
            "Ahmed Raza", "Bilal Hussain", "Usman Ghani", "Hamza Tariq", "Imran Sheikh",
            "Farhan Malik", "Kashif Iqbal", "Waqas Ali", "Zeeshan Baig", "Adnan Yousaf",
            "Salman Qureshi", "Tariq Mehmood", "Nasir Javed", "Rashid Latif", "Aamir Farooq",
            "Junaid Aslam", "Shahid Anwar", "Kamran Shah", "Naveed Akhtar", "Faisal Rehman"
        ]
        member_types = ['regular', 'family', 'lifetime', 'honorary']
        created_members = []
        for i, name in enumerate(names):
            m, _ = Member.objects.get_or_create(
                full_name=name,
                defaults=dict(
                    father_name="Abdul " + name.split()[-1],
                    phone=f"030{random.randint(10000000,99999999)}",
                    email=f"{name.split()[0].lower()}@example.com",
                    address="Hazro City, Punjab, Pakistan",
                    membership_type=random.choice(member_types),
                    status='active',
                    family_members_count=random.randint(1, 7),
                    occupation=random.choice(['Teacher', 'Businessman', 'Engineer', 'Doctor', 'Shopkeeper', 'Farmer']),
                )
            )
            created_members.append(m)
        self.stdout.write(self.style.SUCCESS(f'  Created {len(created_members)} members'))

        # --- Committee ---
        roles = ['president', 'vice_president', 'secretary', 'treasurer', 'imam', 'muezzin']
        for i, role in enumerate(roles):
            if i < len(created_members):
                VolunteerCommittee.objects.get_or_create(
                    member=created_members[i], role=role,
                    defaults=dict(term_start=date(2025, 1, 1), is_active=True)
                )

        # --- Donation Categories ---
        don_cats = ['General Sadaqah', 'Zakat', 'Masjid Construction', 'Ramadan Iftar Fund',
                    'Orphan Support', 'Education Fund']
        don_cat_objs = [DonationCategory.objects.get_or_create(name=c)[0] for c in don_cats]

        exp_cats = ['Utility Bills', 'Imam Salary', 'Maintenance & Repairs', 'Cleaning Supplies',
                    'Ramadan Iftar Expenses', 'Construction Material']
        exp_cat_objs = [ExpenseCategory.objects.get_or_create(name=c)[0] for c in exp_cats]

        # --- Donations (last 6 months) ---
        today = date.today()
        donation_count = 0
        for i in range(90):
            d = today - timedelta(days=random.randint(0, 180))
            donor = random.choice(created_members)
            Donation.objects.create(
                donor_name=donor.full_name,
                donor=donor,
                category=random.choice(don_cat_objs),
                amount=random.choice([500, 1000, 2000, 5000, 10000, 15000, 25000]),
                payment_method=random.choice(['cash', 'bank_transfer', 'online', 'cheque']),
                receipt_number=f"RCP-{2000+i}",
                date=d,
            )
            donation_count += 1
        self.stdout.write(self.style.SUCCESS(f'  Created {donation_count} donations'))

        # --- Expenses ---
        expense_titles = [
            ("Electricity Bill", "Utility Bills"), ("Water Bill", "Utility Bills"),
            ("Monthly Imam Salary", "Imam Salary"), ("AC Repair", "Maintenance & Repairs"),
            ("Carpet Cleaning", "Cleaning Supplies"), ("Iftar Ingredients", "Ramadan Iftar Expenses"),
            ("Cement & Bricks", "Construction Material"), ("Sound System Repair", "Maintenance & Repairs"),
        ]
        expense_count = 0
        for i in range(45):
            d = today - timedelta(days=random.randint(0, 180))
            title, cat_name = random.choice(expense_titles)
            cat = ExpenseCategory.objects.get(name=cat_name)
            Expense.objects.create(
                title=title, category=cat,
                amount=random.choice([1500, 3000, 5000, 8000, 12000, 20000]),
                paid_to=random.choice(['WAPDA', 'Local Vendor', 'Staff', 'Contractor']),
                approved_by='Abdullah Khan',
                date=d,
            )
            expense_count += 1
        self.stdout.write(self.style.SUCCESS(f'  Created {expense_count} expenses'))

        # --- Events ---
        events_data = [
            ("Jummah Khutbah: The Importance of Sabr", "jummah", "Imam Muhammad Siddiqui"),
            ("Eid-ul-Fitr Celebration", "eid", "Imam Muhammad Siddiqui"),
            ("Weekly Tafseer Class", "class", "Imam Muhammad Siddiqui"),
            ("Fundraiser for Masjid Expansion", "fundraiser", "Committee"),
            ("Ramadan Iftar Gathering", "ramadan", "Committee"),
            ("Youth Islamic Lecture Series", "lecture", "Guest Speaker Dr. Anwar"),
        ]
        for i, (title, etype, speaker) in enumerate(events_data):
            Event.objects.get_or_create(
                title=title,
                defaults=dict(
                    event_type=etype,
                    description=f"Join us for {title}. All community members are welcome.",
                    speaker=speaker,
                    location="Main Hall",
                    start_datetime=timezone.now() + timedelta(days=(i * 7) - 14),
                )
            )
        self.stdout.write(self.style.SUCCESS('  Created sample events'))

        # --- Announcements ---
        anns = [
            ("Masjid Renovation Update", "The renovation of the ablution area will begin next week.", "high", True),
            ("Ramadan Timetable Published", "The full Ramadan prayer and iftar timetable is now available.", "normal", True),
            ("Jumma Parking Notice", "Please use the rear lot for Jummah parking due to construction.", "urgent", True),
            ("New Quran Classes for Kids", "Weekend Quran classes for children start this Saturday.", "normal", False),
        ]
        for title, content, priority, pinned in anns:
            Announcement.objects.get_or_create(
                title=title,
                defaults=dict(content=content, priority=priority, is_pinned=pinned, posted_by='Admin Office')
            )
        self.stdout.write(self.style.SUCCESS('  Created announcements'))

        # --- Prayer Timings for next 14 days ---
        base_times = dict(
            fajr_adhan=time(4, 45), fajr_iqamah=time(5, 5),
            dhuhr_adhan=time(12, 15), dhuhr_iqamah=time(12, 45),
            asr_adhan=time(16, 30), asr_iqamah=time(16, 50),
            maghrib_adhan=time(19, 5), maghrib_iqamah=time(19, 10),
            isha_adhan=time(20, 30), isha_iqamah=time(20, 50),
            jummah_khutbah=time(13, 15), jummah_iqamah=time(13, 45),
            sunrise=time(6, 10),
        )
        for i in range(-3, 14):
            d = today + timedelta(days=i)
            PrayerTiming.objects.get_or_create(date=d, defaults=base_times)
        self.stdout.write(self.style.SUCCESS('  Created prayer timings'))

        self.stdout.write(self.style.SUCCESS('\nSeeding complete! Login with admin / admin12345'))
