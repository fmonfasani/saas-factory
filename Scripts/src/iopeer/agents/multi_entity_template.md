Para soportar múltiples entidades, agregar al SPEC:

Entidades:

Task:
- id: int
- title: str
- done: bool

Project:
- id: int
- name: str

Relaciones:
- Project tiene muchas Task

El planner debe generar múltiples routers:
routers/tasks.py
routers/projects.py
