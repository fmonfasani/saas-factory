# 🤖 SaaS Factory - Guía Completa de Agentes

## Tabla de Contenidos
- [Introducción](#introducción)
- [ab-tester](#ab-tester)
- [ai-feature-builder](#ai-feature-builder)
- [analytics-tracker](#analytics-tracker)
- [api-designer](#api-designer)
- [api-discovery-qa-fixer](#api-discovery-qa-fixer)
- [auth-backend-specialist](#auth-backend-specialist)
- [database-optimizer](#database-optimizer)
- [frontend-analyzer](#frontend-analyzer)
- [fullstack-integrator](#fullstack-integrator)
- [landing-generator](#landing-generator)
- [multitenant-backend-architect](#multitenant-backend-architect)
- [notification-engine](#notification-engine)
- [onboarding-flow](#onboarding-flow)
- [python-code-auditor](#python-code-auditor)
- [saas-deploy-automator](#saas-deploy-automator)
- [saas-landing-optimizer](#saas-landing-optimizer)
- [security-auditor](#security-auditor)
- [tech-docs-writer](#tech-docs-writer)
- [ui-library-builder](#ui-library-builder)

---

## Introducción

Los subagentes de Qoder CLI son herramientas especializadas diseñadas para ayudarte a realizar tareas complejas de desarrollo de software de manera autónoma. Cada subagente tiene un conjunto específico de habilidades y conocimientos especializados que le permiten manejar diferentes aspectos del desarrollo de software, desde la generación de código hasta la optimización del rendimiento, pruebas y seguridad.

Para utilizar un subagente, simplemente usa el comando `/agent [nombre-del-agente]` seguido de tu solicitud específica. Los subagentes trabajarán de forma independiente para completar la tarea asignada y proporcionarán un informe detallado cuando hayan terminado.

---

## ab-tester

El agente `ab-tester` está especializado en la configuración, gestión y análisis de pruebas A/B para aplicaciones web o páginas de destino. Este agente puede:

- Crear variantes de prueba
- Definir métricas para rastrear
- Implementar código de seguimiento
- Interpretar resultados para determinar significancia estadística

**Casos de uso comunes:**
- Configurar una prueba A/B para una página de registro para ver qué titular convierte mejor
- Comparar diferentes diseños de interfaz de usuario para optimizar las tasas de conversión
- Evaluar el impacto de cambios en el flujo de usuario

**Ejemplo de uso:**
```
/agent ab-tester Configura una prueba A/B para nuestra página de inicio de sesión comparando dos diseños diferentes
```

---

## ai-feature-builder

El agente `ai-feature-builder` se especializa en implementar nuevas funciones impulsadas por IA para aplicaciones SaaS. Es particularmente útil para extender el generador de páginas de destino actual con capacidades inteligentes.

**Casos de uso comunes:**
- Agregar descripciones de funciones generadas por IA basadas en la idea central del SaaS
- Implementar sugerencias de contenido inteligente
- Desarrollar capacidades de personalización basadas en datos del usuario

**Ejemplo de uso:**
```
/agent ai-feature-builder Agrega descripciones de funciones generadas por IA basadas en la idea principal del proyecto SaaS
```

---

## analytics-tracker

El agente `analytics-tracker` se enfoca en implementar, verificar o depurar funcionalidades de seguimiento analítico en aplicaciones web. Puede:

- Configurar seguimiento de eventos
- Monitorear vistas de página
- Crear embudos de conversión
- Integrar con plataformas analíticas como Google Analytics, Mixpanel o soluciones de seguimiento personalizadas

**Casos de uso comunes:**
- Agregar análisis para rastrear clics de botones en la página de destino
- Verificar que la configuración de análisis esté funcionando correctamente
- Implementar seguimiento de conversiones para campañas de marketing

**Ejemplo de uso:**
```
/agent analytics-tracker Agrega seguimiento analítico para rastrear clics en el botón de registro
```

---

## api-designer

El agente `api-designer` está especializado en diseñar o rediseñar APIs RESTful para aplicaciones SaaS. Sus capacidades incluyen:

- Definir endpoints
- Establecer métodos HTTP
- Diseñar esquemas de solicitud/respuesta
- Planificar estrategias de autenticación
- Manejar versionado de API

**Casos de uso comunes:**
- Diseñar una nueva API para funcionalidades de backend
- Rediseñar una API existente para mejorar consistencia
- Crear especificaciones OpenAPI/Swagger

**Ejemplo de uso:**
```
/agent api-designer Diseña una API RESTful para gestionar proyectos SaaS con endpoints CRUD
```

---

## api-discovery-qa-fixer

El agente `api-discovery-qa-fixer` se especializa en probar, validar y reparar APIs de backend mediante descubrimiento y pruebas autónomas.

**Casos de uso comunes:**
- Probar todos los endpoints después de cambios importantes en el backend
- Validar el estado de la API cuando se hereda un proyecto sin documentación
- Investigar errores intermitentes en la API

**Ejemplo de uso:**
```
/agent api-discovery-qa-fixer Prueba todos los endpoints de la API después de actualizar el sistema de autenticación
```

---

## auth-backend-specialist

El agente `auth-backend-specialist` se especializa en implementar, revisar o solucionar problemas de autenticación y autorización en sistemas backend. Sus capacidades incluyen:

- Configurar flujos OAuth2
- Implementar gestión de tokens JWT
- Diseñar gestión de sesiones
- Configurar autenticación de cuentas de servicio
- Implementar control de acceso basado en roles (RBAC)

**Casos de uso comunes:**
- Agregar autenticación de usuario al generador de páginas de destino
- Resolver problemas de expiración rápida de tokens JWT
- Revisar implementaciones de integración OAuth2

**Ejemplo de uso:**
```
/agent auth-backend-specialist Implementa un sistema de autenticación seguro para activadores de construcción
```

---

## database-optimizer

El agente `database-optimizer` se especializa en analizar y optimizar el rendimiento de bases de datos. Sus capacidades incluyen:

- Identificar consultas lentas
- Sugerir estrategias de indexación
- Optimizar estructuras de tablas
- Mejorar eficiencia general de la base de datos

**Casos de uso comunes:**
- Analizar rendimiento de consultas cuando las respuestas de la API son lentas
- Realizar auditorías de rendimiento durante el escalado de aplicaciones
- Optimizar cuellos de botella en bases de datos

**Ejemplo de uso:**
```
/agent database-optimizer Analiza las consultas de base de datos que están causando tiempos de respuesta lentos
```

---

## frontend-analyzer

El agente `frontend-analyzer` se especializa en analizar, modificar, mejorar o depurar código frontend incluyendo HTML, CSS y JavaScript.

**Casos de uso comunes:**
- Mejorar páginas de destino generadas para hacerlas más modernas y responsivas
- Diagnosticar problemas de diseño responsivo
- Agregar animaciones JavaScript a secciones de desplazamiento
- Optimizar estructura de página y estilo

**Ejemplo de uso:**
```
/agent frontend-analyzer Analiza la landing.html y sugiere mejoras para hacerla más moderna y responsiva
```

---

## fullstack-integrator

El agente `fullstack-integrator` se especializa en integrar componentes frontend y backend, asegurando que los contratos de API se implementen correctamente en ambos lados.

**Casos de uso comunes:**
- Integrar nuevos endpoints de backend con formularios frontend
- Resolver problemas de formato de datos entre frontend y backend
- Verificar integración completa de características fullstack

**Ejemplo de uso:**
```
/agent fullstack-integrator Coordina la integración entre el nuevo endpoint POST /api/saas-projects y el formulario frontend
```

---

## landing-generator

El agente `landing-generator` se especializa en generar páginas de destino HTML desde datos de proyectos SaaS almacenados en Google Sheets.

**Casos de uso comunes:**
- Generar una página de destino para la última idea SaaS
- Actualizar una página de destino con datos nuevos de Google Sheets
- Solucionar problemas con el proceso de generación de páginas de destino

**Ejemplo de uso:**
```
/agent landing-generator Genera una página de destino para mi última idea SaaS desde Google Sheets
```

---

## multitenant-backend-architect

El agente `multitenant-backend-architect` se especializa en diseñar, implementar, revisar u optimizar sistemas y arquitecturas backend multitenante.

**Casos de uso comunes:**
- Agregar aislamiento de tenants a aplicaciones Django
- Revisar consultas conscientes de tenants para seguridad
- Diseñar estrategias de aislamiento de tenants (schema-per-tenant, database-per-tenant, shared schema)

**Ejemplo de uso:**
```
/agent multitenant-backend-architect Diseña una estrategia integral de aislamiento de tenants para mi aplicación Django
```

---

## notification-engine

El agente `notification-engine` se especializa en implementar, probar o depurar sistemas de notificación como correo electrónico, SMS, notificaciones push o entregas webhook.

**Casos de uso comunes:**
- Implementar notificaciones de bienvenida por correo electrónico después del registro
- Configurar integraciones de proveedores de notificación como Twilio o SendGrid
- Solucionar problemas de entrega de notificaciones

**Ejemplo de uso:**
```
/agent notification-engine Implementa un sistema de notificaciones por correo electrónico para nuevos registros de usuarios
```

---

## onboarding-flow

El agente `onboarding-flow` se especializa en implementar, probar o corregir flujos de incorporación de usuarios en aplicaciones web, particularmente procesos de varios pasos.

**Casos de uso comunes:**
- Implementar un flujo completo de incorporación de usuarios con verificación por correo electrónico
- Probar el recorrido de registro a configuración de perfil
- Manejar casos extremos como cuentas duplicadas o perfiles incompletos

**Ejemplo de uso:**
```
/agent onboarding-flow Implementa un flujo completo de incorporación de usuarios con verificación de correo electrónico
```

---

## python-code-auditor

El agente `python-code-auditor` se especializa en revisar código Python escrito o modificado antes de confirmarlo.

**Casos de uso comunes:**
- Revisar funciones nuevas implementadas para procesar datos de Google Sheets
- Auditar lógica de autenticación refactorizada
- Revisar código de generación de plantillas HTML

**Ejemplo de uso:**
```
/agent python-code-auditor Revisa la función que acabo de implementar para analizar datos de SaaS desde la hoja de cálculo
```

---

## saas-deploy-automator

El agente `saas-deploy-automator` se especializa en implementar o automatizar el despliegue de páginas de destino SaaS generadas por el sistema SaaS Factory.

**Casos de uso comunes:**
- Desplegar la última página de destino SaaS desde Google Sheets
- Automatizar el proceso completo de construcción y despliegue
- Abrir la página generada en un navegador

**Ejemplo de uso:**
```
/agent saas-deploy-automator Despliega la última página de destino SaaS desde Google Sheets
```

---

## saas-landing-optimizer

El agente `saas-landing-optimizer` se especializa en mejorar, revisar u optimizar páginas de destino SaaS generadas por el script build.py.

**Casos de uso comunes:**
- Revisar páginas de destino generadas y sugerir mejoras
- Mejorar la plantilla de páginas de destino para mayor efectividad
- Optimizar páginas para mejores tasas de conversión

**Ejemplo de uso:**
```
/agent saas-landing-optimizer Revisa mi página de destino generada y sugiere mejoras para aumentar las conversiones
```

---

## security-auditor

El agente `security-auditor` se especializa en realizar auditorías de seguridad en bases de código, identificar vulnerabilidades y evaluar la postura general de seguridad de la aplicación.

**Casos de uso comunes:**
- Revisar implementaciones de autenticación por posibles vulnerabilidades
- Verificar que nuevos endpoints de API sigan buenas prácticas de seguridad
- Evaluar protección contra inyecciones SQL, XSS, CSRF

**Ejemplo de uso:**
```
/agent security-auditor Revisa la implementación del nuevo sistema de autenticación para identificar posibles vulnerabilidades
```

---

## tech-docs-writer

El agente `tech-docs-writer` se especializa en crear, actualizar o mejorar documentación técnica para código, APIs, arquitectura o características del proyecto.

**Casos de uso comunes:**
- Crear documentación para integraciones de Google Sheets
- Agregar docstrings adecuados a todas las funciones en build.py
- Crear documentación de API para endpoints del SaaS Factory

**Ejemplo de uso:**
```
/agent tech-docs-writer Crea documentación completa para la integración de Google Sheets en build.py
```

---

## ui-library-builder

El agente `ui-library-builder` se especializa en crear o modificar componentes de interfaz de usuario para sistemas de diseño o bibliotecas de componentes.

**Casos de uso comunes:**
- Construir componentes reutilizables de React/Vue/Angular con estilos consistentes
- Crear documentación de componentes con tablas de propiedades y ejemplos de uso
- Implementar tokens de diseño (colores, tipografía, espaciado) desde especificaciones de diseño

**Ejemplo de uso:**
```
/agent ui-library-builder Crea un componente de botón con variantes primaria y secundaria
```