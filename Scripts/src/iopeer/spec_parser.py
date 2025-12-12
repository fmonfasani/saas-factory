from pathlib import Path

def parse_spec(path: Path):
    """
    Parser ultra-simple de entidades:
    Detecta bloques como:

    Entidad User:
       name: str
       age: int
    """
    content = path.read_text().splitlines()
    entities = {}
    current = None

    for line in content:
        line = line.strip()

        if line.lower().startswith("entidad "):
            name = line.split(" ")[1].replace(":", "")
            entities[name] = {}
            current = name
            continue

        if ":" in line and current:
            field, type_ = [x.strip() for x in line.split(":", 1)]
            entities[current][field] = type_

    return entities
