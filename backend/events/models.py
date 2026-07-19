from django.db import models


class Event(models.Model):
    class EventType(models.TextChoices):
        JUMMAH = 'jummah', 'Jummah Khutbah'
        EID = 'eid', 'Eid Celebration'
        LECTURE = 'lecture', 'Islamic Lecture'
        NIKAH = 'nikah', 'Nikah Ceremony'
        FUNERAL = 'funeral', 'Funeral / Janazah'
        FUNDRAISER = 'fundraiser', 'Fundraiser'
        RAMADAN = 'ramadan', 'Ramadan Program'
        CLASS = 'class', 'Quran / Islamic Class'
        OTHER = 'other', 'Other'

    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=20, choices=EventType.choices, default=EventType.OTHER)
    description = models.TextField(blank=True)
    speaker = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=200, default='Main Hall')
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(null=True, blank=True)
    banner_image = models.ImageField(upload_to='events/', blank=True, null=True)
    is_published = models.BooleanField(default=True)
    max_attendees = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_datetime']

    def __str__(self):
        return self.title
