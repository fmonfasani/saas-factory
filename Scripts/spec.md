Crear API REST de tareas con FastAPI:

Entidad Task:
- id: int (auto)
- title: str (requerido)
- description: str (opcional)
- done: bool (default false)

Endpoints:
- POST /tasks
- GET /tasks
- GET /tasks/{id}
- PUT /tasks/{id}
- DELETE /tasks/{id}

Base de datos: SQLite con SQLAlchemy
Tests: pytest
