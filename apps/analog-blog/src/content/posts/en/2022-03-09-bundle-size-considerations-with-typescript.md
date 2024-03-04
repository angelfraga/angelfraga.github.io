---
title: Bundle size considerations when using typescript
layout: post
date: '2022-03-09 22:53:19 +0100'
slug: 2022-03-09-bundle-size-considerations-with-typescript
categories:
  - en
  - typescript
lang: en
languages:
  - es
config:
  hero:
    title: Bundle size considerations when using typescript
  colors:
    h: 216
    s: 85%
    l: 34%
---

## Intro

Tras cada nueva versión, Typescript trae nuevas características que hacen la vida del desarrollador
mucho más facil.

Como por ejemplo:

- Enums
- Null coalescing operator
- Optional chaining
- Unions and Intersection Types
- etc

Es muy tentador usar todas esas nuevas características en nuestros proyectos, pero no todo es oro lo que reluce.

No debemos olvidar que Typescript compila en Javacript. Según el tipo de target que definamos en nuestra configuración de Typescript el tiempo inicial de carga de nuestra app puede verse afectado.

Incluso usando el target de compilación más moderno, puede ser que algunas de las características no estén soportadas aún. Es aquí donde los polyfills o incluso el output the la build de Typescript nos puede dar dolores de cabeza en cuanto de bundle size y de loading time se refiere.

En las secciones siguientes podemos ver dos formas de reducir la salida de código Javascript preveniendo el uso de Enums y Class.

<div class="alert alert-primary" role="alert">
NOTA: Puedes usar el Playground Online de Typescript para ver la version Javascript.
<br>
<a href="https://www.typescriptlang.org/play" class="alert-link">Playground</a>

</div>

### Enums vs Types

Examinemos el siguiente trozo de código:

<div>

```typescript
export enum ExceptionTypes {
  error = 'error',
  info = 'info',
  warn = 'warn',
}
```

</div>

Este código Typescript producirá una salida Javascript como la siguiente:

<div>

```typescript
export var ExceptionTypes;
(function (ExceptionTypes) {
  ExceptionTypes['error'] = 'error';
  ExceptionTypes['info'] = 'info';
  ExceptionTypes['warn'] = 'warn';
})(ExceptionTypes || (ExceptionTypes = {}));
```

</div>

Comparemos ahora la versión Typescript sin Enum

<div>

```typescript
export type ExceptionTypeError = 'error';
export type ExceptionTypeInfo = 'info';
export type ExceptionTypeWarn = 'warn';
export type ExceptionTypes =
  | ExceptionTypeError
  | ExceptionTypeInfo
  | ExceptionTypeWarn;
```

</div>

En este caso, todo el typing se omite en la versión Javascript ⚡.

<div>

```typescript
export {};
```

</div>

### Classes vs Interfaces

Examinemos el siguiente trozo de código:

<div>

```typescript
export abstract class Exception extends Error {
  abstract type: ExceptionTypes;
}
export class ErrorException extends Exception {
  public readonly type = ExceptionTypes.error;
}
export class InfoException extends Exception {
  public readonly type = ExceptionTypes.info;
}
export class WarningException extends Exception {
  public readonly type = ExceptionTypes.warn;
}
```

</div>

Este código Typescript producirá una salida Javascript como la siguiente:

<div>

```typescript
export class Exception extends Error {}
export class ErrorException extends Exception {
  constructor() {
    super(...arguments);
    this.type = ExceptionTypes.error;
  }
}
export class InfoException extends Exception {
  constructor() {
    super(...arguments);
    this.type = ExceptionTypes.info;
  }
}
export class WarningException extends Exception {
  constructor() {
    super(...arguments);
    this.type = ExceptionTypes.warn;
  }
}
```

</div>

Comparemos ahora la versión Typescript sin clases usando solo interfaces:

<div>

```typescript
export interface Exception extends Error {
  type: ExceptionTypes;
  message: string;
}
export interface ErrorException extends Exception {
  readonly type: ExceptionTypeError;
}

export interface InfoException extends Exception {
  readonly type: ExceptionTypeInfo;
}
export interface WarningException extends Exception {
  readonly type: ExceptionTypeWarn;
}
```

</div>

En este caso, todo el typing se omite en la versión Javascript ⚡.

<div>

```typescript
export {};
```

</div>
