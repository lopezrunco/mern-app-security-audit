# Resumen ejecutivo

## Auditoría de Seguridad en Aplicación MERN

**Aplicación:** Campo Eventos | Plataforma de preofertas para remates ganaderos

**Período de la auditoría:** Mayo de 2026

**Auditor:** Damián López Runco (desarrollador original)

**Versión:** 1.0

## Resumen

Este reporte refleja los hallazgos de una auditoría de seguridad realizada sobre una aplicación MERN discontinuada. La aplicación fue desarrollada en 2023 para operar en conjunto con transmisiones de remates de ganado en Uruguay. El proyecto fue creado para Campo TV y las transmisiones se realizaban a través de los canales VTV y Campo TV.

Siguiendo un cambio de dirección en Campo TV, el proyecto fue pausado y más tarde discontinuado. De todas maneras, el proyecto se ha conservado como posible base para futuros desarrollos, lo que convierte esta auditoría en un requisito obligatorio.

Durante el período de desarrollo, se propuso a la dirección un fortalecimiento de la seguridad del proyecto, pero la iniciativa no fue aprobada debido a restricciones presupuestarias. Las limitaciones presupuestarias y la priorización de los tiempos de entrega impactaron negativamente en la implementación de controles de seguridad. Esto ilustra cómo las decisiones organizacionales pueden traducirse directamente en riesgo técnico y cómo la inversión en seguridad durante la etapa de desarrollo es considerablemente menor que la requerida durante una etapa de remediación.

El uso potencial para este proyecto sería como base para aplicaciones para escritorios rurales y cabañas de Uruguay, manejando datos sensibles de clientes, así como también información financiera, lo que hace esta auditoría obligatoria.

Esta auditoría fue realizada por el desarrollador original de la aplicación, aportando así una visión única sobre los aspectos técnicos y el contexto organizacional que eventualmente llevaron a las vulnerabilidades descubiertas.

## Hallazgos clave

**Cualquier persona con acceso a internet puede obtener acceso completo a la administración de esta aplicación en menos de 60 segundos, sin conocimiento previo del sistema.**

Esto fue confirmado mediante pruebas de concepto. Los pasos son:
1. Crear una cuenta (el registro está abierto para todo público)
2. Enviar una petición que permite escalar privilegios hasta obtener permisos de administrador.
3. Obtener acceso a todos los datos de usuario, eliminar cuentas y modificar cualquier tipo de contenido.

No se requieren herramientas especiales, conocimientos avanzados ni acceso interno.

## Resumen de riesgos

La auditoría identificó **30 fallas de seguridad** que incluyen:

| Nivel | Número de hallazgos | Impacto en el negocio |
|----------|-------|-----------------|
| Crítico | 3 | Inmediato, riesgo explotable confirmado |
| Alto | 11 | Riesgo significativo que requiere atención urgente |
| Medio | 7 | Problemas importantes que deben resolverse antes de pasar a producción |
| Bajo / Informacional | 9 | Problemas menores y observaciones de proceso |

Se demostraron tres cadenas completas de ataque con sus correspondientes Pruebas de Concepto:

**Cadena de ataque 1: Compromiso completo de la plataforma:** Un usuario anónimo puede convertirse en administrador de la plataforma con tres peticiones, obteniendo acceso a los datos de todos los usuarios, eliminando cuentas y modificando contenido.

**Cadena de ataque 2: Entrega de archivos maliciosos a cualquier visitante de la aplicación:** Un atacante con acceso de administrador puede subir archivos maliciosos disfrazados de imagen (afiches de los eventos). Ese archivo es posteriormente entregado a los visitantes de la plataforma, potencialmente ejecutando código malicioso en sus navegadores.

**Cadena de ataque 3: Secuestro masivo de sesiones mediante artículos del blog:** Un atacante puede publicar un artículo que contiene código malicioso oculto. Cualquier visitante que lea el artículo puede sufrir el robo de sus credenciales, otorgándole al atacante acceso a sus cuentas.

## Datos en riesgo

Durante el período en que estuvo en producción, la aplicación manejó este tipo de datos:
- Nombres completos y alias
- Direcciones de email
- Números de teléfono
- Direcciones
- Montos de preofertas e historial de preofertas
- Contraseñas

La base de datos estuvo accesible públicamente desde cualquier IP en su período de producción sin restricciones de acceso por red.

## Causas

Las vulnerabilidades en esta aplicación comparten cuatro causas:

1. **Controles de seguridad implementados demasiado tarde:** Tanto la autenticación como la autorización fueron implementadas después de finalizado el desarrollo principal de la aplicación, creando brechas que nunca fueron completamente subsanadas.

2. **Priorización de salida a producción por encima de la inversión en seguridad:** Muchas funcionalidades de seguridad fueron deshabilitadas para cumplir con plazos, con la intención de reimplementarlas posteriormente, algo que finalmente no se hizo.

3. **Patrones de inseguridad aprendidos:** Muchas vulnerabilidades reflejan malas prácticas de desarrollo adquiridas durante la formación formal, aparentemente correctas pero que contienen fallas de seguridad fundamentales.

4. **Ausencia de auditorías de código:** La ausencia de auditorías de código, escaneos de seguridad automatizados o pruebas de seguridad permitió que las vulnerabilidades se acumularan durante más de 80 commits a lo largo de dos años.

## Antes de reusar este proyecto

Los siguientes problemas deben resolverse antes de que esta aplicación sea usada como base para nuevos proyectos:

| Prioridad | Problema | Riesgo si se ignora |
|----------|-------|----------------|
| 1 | Arreglar el sistema de autorización roto | Cualquier usuario se convierte en administrador |
| 2 | Arreglar asignación masiva en controladores de actualización | Escalada de privilegios inmediata |
| 3 | Restringir alta de usuarios | Creación de cuentas sin control |
| 4 | Agregar el rol a los tokens JWT | Autorización permanentemente rota |
| 5 | Arreglar configuración CORS | Ataques XSS |
| 6 | Actualizar todas las dependencias | 101 vulnerabilidades conocidas |
| 7 | Mover tokens de autorización fuera del localStorage | Robo de sesiones vía XSS |
| 8 | Agregar validación de inputs en endpoints de tipo UPDATE | Compromiso de la integridad de los datos |
| 9 | Sanitizar el HTML antes del renderizado | Páginas públicas que contienen XSS |
| 10 | Gestionar la carga de archivos a través del backend | Entrega de archivos maliciosos |

## Buenas prácticas

No todos los hallazgos fueron negativos, también se identificaron muchas prácticas de seguridad deliberadas que vale la pena conservar en futuros desarrollos:

- Las credenciales jamás fueron subidas a GitHub a pesar de que el repositorio era público.
- Campos sensibles (como contraseñas o secretos MFA) fueron correctamente excluidos de las respuestas de la API.
- Todos los endpoints de creación de datos tienen validación de inputs.
- La implementación de Mongoose ODM ayudó a prevenir ataques de inyección mediante parámetros de ID.

Estas prácticas demostraron conciencia de seguridad, que, si hubieran sido aplicadas de forma sistemática, habrían reducido el perfil de riesgo de la aplicación.

## Recomendaciones

Este proyecto **no debe utilizarse en producción en su estado actual.** Los hallazgos críticos que se encontraron representan vulnerabilidades confirmadas y explotables.

La hoja de ruta de remediación documenta las acciones de remediación necesarias. Una vez que los hallazgos más críticos hayan sido resueltos y verificados mediante nuevas pruebas, el proyecto podrá servir como una base sólida para desarrollos futuros.

Todos los hallazgos técnicos están documentados en `security-findings.md`.
