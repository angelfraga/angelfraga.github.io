---
title: Bundle size considerations when using typescript
layout: post
date: '2022-03-09 22:53:19 +0100'
categories:
- en
- typescript
lang: en
languages:
- es
---

<style>
    :root {
        --primary-h: 216;
        --primary-s: 85%;
        --primary-l: 34%;
    }
</style>

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
{% highlight ts linenos %}
export enum ExceptionTypes {
  error = "error",
  info = "info",
  warn = "warn",
}
{% endhighlight %}
</div>

Este código Typescript producirá una salida Javascript como la siguiente:

<div>
{% highlight ts linenos %}
export var ExceptionTypes;
(function (ExceptionTypes) {
    ExceptionTypes["error"] = "error";
    ExceptionTypes["info"] = "info";
    ExceptionTypes["warn"] = "warn";
})(ExceptionTypes || (ExceptionTypes = {}));
{% endhighlight %}
</div>

Comparemos ahora la versión Typescript sin Enum

<div>
{% highlight ts linenos %}
export type ExceptionTypeError = 'error';
export type ExceptionTypeInfo = 'info';
export type ExceptionTypeWarn = 'warn';
export type ExceptionTypes = ExceptionTypeError | ExceptionTypeInfo | ExceptionTypeWarn;
{% endhighlight %}
</div>

En este caso, todo el typing se omite en la versión Javascript ⚡.

<div>
{% highlight ts linenos %}
export {};
{% endhighlight %}
</div>

### Classes vs Interfaces

Examinemos el siguiente trozo de código:

<div>
{% highlight ts linenos %}
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
{% endhighlight %}
</div>

Este código Typescript producirá una salida Javascript como la siguiente:

<div>
{% highlight ts linenos %}
export class Exception extends Error {
}
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
{% endhighlight %}
</div>

Comparemos ahora la versión Typescript sin clases usando solo interfaces:

<div>
{% highlight ts linenos %}
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
{% endhighlight %}

</div>

En este caso, todo el typing se omite en la versión Javascript ⚡.

<div>
{% highlight ts linenos %}
export {};
{% endhighlight %}
</div>
