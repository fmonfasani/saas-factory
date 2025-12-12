import importlib

def test_import():
    module = importlib.import_module("output.main")
    assert hasattr(module, "app")
