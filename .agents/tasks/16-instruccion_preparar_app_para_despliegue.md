# Instrucción para preparar la aplicación antes del despliegue

## Objetivo

Preparar la aplicación para su primer despliegue.

La aplicación será utilizada inicialmente solo por mí, por lo que en esta etapa no necesito una arquitectura de seguridad avanzada. Sin embargo, sí necesito una base mínima segura, código limpio, estable y fácil de mantener.

No agregar funcionalidades nuevas.

No rediseñar la aplicación.

No cambiar el comportamiento actual salvo que exista un error, un riesgo claro o código innecesario.

Antes de realizar cambios, revisar completamente el proyecto y documentar qué se encontró.

---

# 1. Revisión general del proyecto

Revisar todo el repositorio y verificar:

- Estructura de carpetas
- Componentes
- Servicios
- Hooks
- Utilidades
- Estilos
- Configuración
- Variables de entorno
- Dependencias
- Rutas
- Formularios
- Manejo de errores
- Archivos de prueba
- Archivos temporales
- Código comentado
- Código duplicado
- Código que ya no se utiliza

No modificar archivos automáticamente sin entender primero para qué sirven.

---

# 2. Limpiar código innecesario

Eliminar únicamente código que esté confirmado como innecesario.

Buscar y retirar:

- Imports no utilizados
- Variables no utilizadas
- Funciones no utilizadas
- Componentes que no se renderizan
- Hooks sin uso
- Servicios antiguos
- Archivos duplicados
- Código comentado que ya no es necesario
- Consolas de depuración
- Datos de prueba que no deban llegar a producción
- Rutas antiguas
- Estilos sin uso
- Dependencias no utilizadas
- Configuraciones obsoletas
- Archivos generados accidentalmente
- Credenciales o valores sensibles escritos directamente en el código

No eliminar nada si existe duda sobre su uso.

Si un archivo parece innecesario pero no se puede confirmar, incluirlo en el informe y no eliminarlo.

---

# 3. Ordenar e identificar el código

Asegurar que el código quede:

- Correctamente indentado
- Separado por módulos
- Con nombres claros
- Sin archivos excesivamente grandes
- Sin componentes con demasiadas responsabilidades
- Sin estilos mezclados innecesariamente con la lógica
- Sin lógica repetida en varios archivos

Separar cuando sea necesario:

- Componentes
- Hooks
- Servicios
- Tipos
- Utilidades
- Constantes
- Validaciones
- Estilos
- Configuración

No hacer una refactorización masiva.

Solo realizar cambios pequeños, seguros y fáciles de verificar.

---

# 4. Formato y calidad del código

Ejecutar y corregir:

- Formateador
- Linter
- Verificación de TypeScript
- Pruebas existentes
- Compilación de producción

Comandos esperados, adaptándolos al proyecto:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
```

Si alguno de estos scripts no existe, revisar `package.json` y utilizar el comando equivalente.

No ocultar errores con:

```ts
any
```

No desactivar reglas del linter sin una justificación clara.

No agregar comentarios como:

```ts
// eslint-disable
```

salvo que sea estrictamente necesario y esté documentado.

---

# 5. Dependencias

Revisar las dependencias del proyecto.

Verificar:

- Dependencias no utilizadas
- Dependencias duplicadas
- Paquetes obsoletos
- Paquetes con vulnerabilidades conocidas
- Librerías instaladas solo para pruebas antiguas
- Paquetes que pueden reemplazarse con funcionalidades ya existentes

Ejecutar:

```bash
npm audit
```

No actualizar todas las dependencias automáticamente.

No hacer actualizaciones mayores sin revisar posibles incompatibilidades.

Corregir vulnerabilidades de bajo riesgo únicamente cuando el cambio sea seguro.

Para vulnerabilidades medias, altas o críticas:

1. Identificar el paquete afectado.
2. Determinar si se utiliza realmente.
3. Revisar si existe una actualización compatible.
4. Documentar el riesgo.
5. Aplicar el cambio solo si no rompe la aplicación.

No utilizar:

```bash
npm audit fix --force
```

sin revisar previamente el impacto.

---

# 6. Variables de entorno

Revisar que ningún dato sensible esté escrito directamente en el código.

Mover a variables de entorno cualquier valor como:

- URLs privadas
- Claves
- Tokens
- Contraseñas
- Credenciales
- Secretos
- Identificadores privados
- Configuración específica del entorno

Verificar que exista:

```text
.env.example
```

Este archivo debe contener únicamente nombres de variables y valores de ejemplo seguros.

Ejemplo:

```env
VITE_API_URL=http://localhost:8080
```

No incluir secretos reales en `.env.example`.

Verificar que los archivos reales estén ignorados por Git:

```gitignore
.env
.env.local
.env.production
.env.*.local
```

No eliminar variables existentes sin comprobar dónde se utilizan.

---

# 7. Seguridad mínima del frontend

Aplicar una seguridad mínima razonable.

## Validación

- Validar todos los formularios.
- Limitar la longitud de los campos.
- No confiar únicamente en datos del navegador.
- Evitar valores vacíos o formatos inválidos.
- Mostrar errores sin exponer información técnica interna.

## Contenido ingresado por el usuario

- No renderizar HTML ingresado por el usuario.
- Evitar `dangerouslySetInnerHTML`.
- Si es obligatorio utilizarlo, sanitizar el contenido.
- Escapar o tratar correctamente textos personalizados.
- No ejecutar scripts contenidos en textos o configuraciones.

## Enlaces

Para enlaces externos abiertos en otra pestaña:

```tsx
target="_blank"
rel="noopener noreferrer"
```

## Errores

- No mostrar trazas completas.
- No mostrar rutas internas.
- No mostrar tokens.
- No mostrar respuestas técnicas completas del servidor.
- No revelar variables de entorno.

## Almacenamiento

- No guardar contraseñas.
- No guardar secretos.
- No guardar tokens sensibles permanentemente sin necesidad.
- Evitar almacenar datos privados en `localStorage` si no es necesario.

---

# 8. Seguridad mínima del backend, si existe

Si el proyecto tiene backend, revisar:

- Validación de todos los datos recibidos
- Manejo centralizado de errores
- Límites de tamaño de las solicitudes
- Configuración de CORS
- Variables de entorno
- Credenciales
- Logs
- Acceso a archivos
- Consultas a base de datos
- Endpoints expuestos
- Rate limiting básico cuando sea posible

## CORS

No permitir todos los orígenes en producción.

Evitar:

```text
*
```

Permitir únicamente el dominio real del frontend.

## Errores

No enviar al cliente:

- Stack traces
- Consultas SQL
- Rutas del servidor
- Datos internos
- Credenciales
- Tokens
- Variables de entorno

## Base de datos

- Utilizar consultas parametrizadas.
- No construir consultas con texto ingresado por el usuario.
- Validar identificadores.
- No exponer IDs sensibles innecesariamente.
- No registrar datos privados en logs.

## Autenticación

Si actualmente la aplicación no requiere autenticación porque será de uso personal:

- No implementar todavía un sistema complejo.
- No crear roles innecesarios.
- No agregar OAuth sin necesidad.
- Documentar claramente qué rutas quedarán públicas.
- Evitar exponer herramientas de administración públicamente.
- Proteger cualquier panel interno si existe.

---

# 9. Archivos y carga de imágenes

Si la aplicación permite cargar imágenes:

- Validar tipos permitidos.
- Validar tamaño máximo.
- No confiar únicamente en la extensión.
- Rechazar formatos no esperados.
- Generar nombres seguros.
- Evitar utilizar directamente el nombre enviado por el usuario.
- No permitir rutas arbitrarias.
- No ejecutar archivos cargados.
- Mostrar mensajes de error claros.

Formatos esperados:

- JPG
- JPEG
- PNG
- WEBP

Definir un tamaño máximo razonable.

No permitir SVG cargados por usuarios sin sanitización.

---

# 10. Configuración para producción

Revisar que el modo producción no incluya:

- Logs de depuración
- Datos falsos
- Credenciales de prueba
- URLs de localhost
- Mock APIs activas
- Herramientas de desarrollo
- Source maps públicos si contienen información sensible
- Mensajes técnicos visibles al usuario
- Funciones experimentales incompletas

Verificar que la URL del backend y otros servicios provengan de variables de entorno.

No dejar valores como:

```text
http://localhost:3000
http://localhost:5173
http://localhost:8080
```

escritos directamente en componentes o servicios.

---

# 11. Manejo de errores

Agregar o revisar:

- Pantalla de error general
- Estado de carga
- Estado vacío
- Error de red
- Error al cargar imágenes
- Ruta no encontrada
- Datos inválidos
- Respuesta inesperada del servidor

La aplicación no debe quedar en blanco cuando ocurra un error.

Los errores deben ser comprensibles para el usuario.

La información técnica debe quedar solo en logs controlados y nunca mostrar secretos.

---

# 12. Rendimiento básico

Revisar:

- Imágenes demasiado pesadas
- Imágenes sin dimensiones
- Componentes que se renderizan innecesariamente
- Peticiones duplicadas
- Dependencias grandes
- Animaciones costosas
- Listas sin `key`
- Eventos sin limpieza
- `setTimeout` o `setInterval` sin cancelación
- Observadores sin desconexión
- Recursos que no se liberan

Optimizar imágenes cuando sea posible.

Mantener las animaciones con:

- `transform`
- `opacity`

Evitar animar propiedades que provoquen recalcular continuamente el diseño.

---

# 13. Accesibilidad mínima

Verificar:

- Botones con texto o `aria-label`
- Imágenes con `alt`
- Campos con `label`
- Navegación por teclado
- Foco visible
- Modales accesibles
- Contraste suficiente
- Respeto de `prefers-reduced-motion`
- Uso correcto de títulos `h1`, `h2`, `h3`
- No utilizar elementos `div` como botones sin accesibilidad

---

# 14. Git y archivos que no deben subirse

Revisar `.gitignore`.

Asegurar que no se suban:

- `.env`
- Credenciales
- Tokens
- Contraseñas
- Logs
- Carpetas de compilación
- Archivos temporales
- Cachés
- Dependencias instaladas
- Configuración local del editor
- Archivos del sistema operativo

Ejemplos:

```gitignore
node_modules/
dist/
build/
.env
.env.local
.env.production
*.log
.DS_Store
.vscode/
.idea/
coverage/
```

No ignorar archivos necesarios para construir la aplicación.

---

# 15. Pruebas mínimas antes del despliegue

Probar manualmente como mínimo:

1. Abrir la página principal.
2. Navegar por todas las rutas.
3. Crear una invitación.
4. Cambiar datos del formulario.
5. Verificar la vista previa.
6. Probar imágenes.
7. Probar fondos.
8. Probar gradientes.
9. Probar animaciones.
10. Hacer scroll hacia abajo y hacia arriba.
11. Probar en móvil.
12. Probar en escritorio.
13. Recargar una ruta interna.
14. Probar una URL inválida.
15. Probar campos vacíos.
16. Probar textos largos.
17. Probar imágenes grandes.
18. Verificar que no existan errores en consola.
19. Verificar que no existan solicitudes fallidas.
20. Ejecutar la compilación final de producción.

---

# 16. Reglas para realizar cambios

Seguir estas reglas:

- No agregar nuevas funcionalidades.
- No cambiar el diseño sin necesidad.
- No eliminar código si no se confirmó que está sin uso.
- No hacer una refactorización completa.
- No actualizar dependencias mayores automáticamente.
- No utilizar soluciones temporales.
- No ocultar errores.
- No desactivar validaciones.
- No reducir la seguridad existente.
- No cambiar nombres de archivos masivamente.
- No romper rutas existentes.
- No modificar el comportamiento de las invitaciones.
- Mantener compatibilidad con móvil y escritorio.

Realizar cambios pequeños y verificables.

Después de cada grupo de cambios:

1. Ejecutar el linter.
2. Ejecutar la verificación de tipos.
3. Ejecutar las pruebas.
4. Ejecutar la compilación.

---

# 17. Informe final obligatorio

Al terminar, entregar un informe con:

## Archivos modificados

Indicar cada archivo modificado y explicar por qué.

## Archivos eliminados

Indicar cada archivo eliminado y justificar cómo se confirmó que no se utilizaba.

## Código retirado

Explicar qué código obsoleto, duplicado o innecesario fue eliminado.

## Problemas corregidos

Listar:

- Errores
- Advertencias
- Problemas de TypeScript
- Problemas del linter
- Problemas de compilación
- Riesgos de seguridad
- Problemas de rendimiento

## Riesgos pendientes

Indicar qué riesgos no se corrigieron y por qué.

Clasificarlos como:

- Bajo
- Medio
- Alto
- Crítico

## Comandos ejecutados

Mostrar los comandos utilizados y su resultado.

Ejemplo:

```text
npm run lint: OK
npm run typecheck: OK
npm run test: OK
npm run build: OK
npm audit: 2 riesgos bajos pendientes
```

## Estado final

Confirmar claramente:

- Si el proyecto compila.
- Si las pruebas pasan.
- Si existen errores en consola.
- Si quedan vulnerabilidades.
- Si está preparado para un primer despliegue de uso personal.
- Qué mejoras de seguridad deberían realizarse antes de abrirlo a otros usuarios.

---

# Resultado esperado

El proyecto debe quedar:

- Limpio
- Ordenado
- Compilable
- Sin código muerto confirmado
- Sin credenciales expuestas
- Sin errores importantes de consola
- Con variables de entorno organizadas
- Con validaciones mínimas
- Con seguridad básica
- Con dependencias revisadas
- Con un informe claro de todo lo realizado

Esta etapa es únicamente para un primer despliegue de uso personal.

No considerar esta revisión como seguridad suficiente para publicar la aplicación a muchos usuarios o almacenar información sensible.
