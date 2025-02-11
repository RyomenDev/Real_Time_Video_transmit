from django.db import models

class Video(models.Model):
    question_id = models.CharField(max_length=255)
    question_text = models.TextField()
    video_file = models.FileField(upload_to="videos/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Video {self.id} - Question {self.question_id}"
