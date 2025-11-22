# Agent-Process Project

Generated NestJS repository with two services: agent and process.

Run with:

```
docker-compose up --build
```

Agent runs on port 3000 (inside container) and produces fake events to the BullMQ queue.
Process runs on port 3001 (inside container), consumes the queue, stores events and matches in MongoDB.
