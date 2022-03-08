from email.policy import default

from django.contrib.auth.models import User
from django.db import models
from taggit.managers import TaggableManager


class Recipe(models.Model):

    title = models.CharField(
        max_length=32,
        unique=True,
        help_text="Recipe title, must be unqiue and no more than 50 chars",
    )

    summary = models.CharField(max_length=256, blank=True)

    content = models.TextField(blank=True)

    prep_time = models.IntegerField(blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True, editable=False)

    tags = TaggableManager(blank=True, related_name="recipes")

    image = models.ImageField(
        "Image",
        # upload_to=upload_to,
        default="default.jpeg",
    )

    user = models.ForeignKey(
        User,
        null=True,
        on_delete=models.CASCADE,
        related_name="recipes",
    )

    ingredients = models.JSONField(default=dict)

    def __str__(self):
        return str(self.title)

    class Meta:
        ordering = ["-created"]


class Comment(models.Model):

    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    content = models.TextField()

    rating = models.IntegerField(default=-1)

    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        content = self.content[:20]
        if len(self.content) > 20:
            content += "..."
        return f"{self.user} om {self.recipe}: {content}"


class Like(models.Model):

    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name="likes",
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="likes",
    )

    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "recipe"]

    # def __str__(self):
    #     TODO: imeplement


class UserFollow(models.Model):

    user = models.ForeignKey(
        User,
        related_name="following",
        on_delete=models.CASCADE,
    )

    follows = models.ForeignKey(
        User,
        related_name="followers",
        on_delete=models.CASCADE,
    )

    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "follows"]

    def __str__(self):
        return f"{self.user} follows {self.follows}"
