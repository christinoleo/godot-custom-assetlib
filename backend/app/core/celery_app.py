from celery import Celery


celery_app.conf.task_routes = {"app.tasks.*": "main-queue"}
