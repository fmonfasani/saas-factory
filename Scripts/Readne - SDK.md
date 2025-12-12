Crear el Archivo Toml

[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "py-agent-client"
version = "0.0.2.dev1"  
authors = [
  { name="Federico Monfasani", email="fmonfasani@gmail.com" },
]
description = "Placeholder for the official Python SDK for the Intelligent Agents Platform (IAP). Coming soon!"
readme = "README.md"
requires-python = ">=3.8"
license = "MIT"
classifiers = [
    "Development Status :: 2 - Pre-Alpha",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Operating System :: OS Independent",
    "Intended Audience :: Developers",
    "Topic :: Software Development :: Libraries :: Python Modules",
    "Topic :: Scientific/Engineering :: Artificial Intelligence",
]

[project.urls]
Homepage = "https://github.com/fmonfasani/intelligent-agents-platform"
"Bug Tracker" = "https://github.com/fmonfasani/intelligent-agents-platform/issues"
Documentation = "https://github.com/fmonfasani/intelligent-agents-platform/wiki"
Repository = "https://github.com/fmonfasani/intelligent-agents-platform"


Crear Archivo LICENSE

"---------------------------------------------------------------------------
Copyright (c) 2025 by @fmonfasani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
----------------------------------------------------------------------------"

## Actualizar el proyecto

Chequear bien si no hay errores


pip install build twine



python -m build

# Si todo está bien, verás algo como:

Successfully built iopeer-0.1.0.tar.gz
Successfully built iopeer-0.1.0-py3-none-any.whl

# Ejecuta
python -m twine upload dist/*
 
(cuando te pidael token copia y pega el token de abajo)


twine upload dist/* -u __token__ -p 

https://pypi.org/project/py-agent-tool/
https://pypi.org/project/py-agent-server/
https://pypi.org/project/py-agent-resources/
https://pypi.org/project/py-agent-core/
https://pypi.org/project/py-agent-client/

