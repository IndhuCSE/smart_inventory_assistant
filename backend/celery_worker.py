from celery import Celery

celery_app = Celery(
    "inventory_tasks",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

# This will automatically find tasks inside backend.tasks
celery_app.autodiscover_tasks(['backend.tasks'])

celery_app.conf.beat_schedule = {
    "check-low-stock-every-minute": {
        "task": "backend.tasks.check_low_stock",
        "schedule": 3600.0,  # every 60 seconds
    }
}
