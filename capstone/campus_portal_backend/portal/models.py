from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
class Teacher(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    designation = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    semester = models.IntegerField()
    department = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.code})"
    
    class Meta:
        unique_together = ('name', 'semester')

class Room(models.Model):
    ROOM_TYPES = [
        ('Lab', 'Lab'),
        ('Theatre', 'Theatre'),
    ]

    name = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    type = models.CharField(max_length=20, choices=ROOM_TYPES)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.capacity} capacity)"
    
class Day(models.Model):
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class TimeSlot(models.Model):
    day = models.ForeignKey(Day, on_delete=models.CASCADE, related_name="timeslots")
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.day.name} {self.start_time} - {self.end_time}"

    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError("End time must be after start time.")
