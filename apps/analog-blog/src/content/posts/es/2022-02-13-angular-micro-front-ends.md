---
layout: post
author: Angel Fraga
title: 'Extensions/Plugins based App'
image: https://angular.io/assets/images/logos/angular/angular.svg
hero_image: https://angular.io/assets/images/logos/angular/angular.svg
date: 2022-02-13 12:00:00 +0100
categories: es angular
summary: Series about micro front-ends in angular.
lang: es
languages:
  - en
  - es
config:
  colors:
    h: 216
    s: 85%
    l: 34%
---

## Que es un plugin ?

> **Wikipedia**
> En informática, un complemento o plug-in es una aplicación que se relaciona con otra para agregarle una función nueva y generalmente muy específica.

En nuestros dias podemos usar de ejemplo una app como VSCode, la cuál esta compuesta por
un buen puñado de elementos: alertas, paneles, comandos...que pueden ser usados por las extensiones.

Cada extension hace uso de una libreria "sdk" la cuál es expuesta por el host (VSCode Editor).
Con esta libreria la extension es capaz de registrar sus propias alertas, paneles, commandos ...

En el siguiente ejemplo podemos ver como la extension "Docker" hace uso de esta "sdk" para registrar
un "tree container" y varios "tree".

<figure tabindex="0">
    <figcaption>
        <a href="https://github.com/microsoft/vscode-docker/blob/3dcdb38e64922abc8c1d2ef50a43e45773b30c66/src/tree/registerTrees.ts#L19"
        target="__blank" >
        código original en github
        </a>
    </figcaption>
    <img alt="vscode docker register-trees.ts" src="/assets/images/vscode-docker-register-trees-ts.png">
</figure>

<figure tabindex="0">
<img alt="vscode docker extension" src="/assets/images/vscode-docker-ext.png">
</figure>

Uno de los puntos a tener muy en cuenta es el tiempo de inicio de la aplicacion ya que los plugins tienen que ser cargados al inicio.

Esto explica la diferencia de performance en una instancia de VSCode con y sin extensiones.

### Module Federation (Webpack 5) ❤ Angular (Micro Front-ends)

Gracias a los avances con "Module Federation" en webpack 5, ahora somos capaces desacoplar del código
fuente de la aplicación host el resto de plugins y cargarlos dinámicamente.

Esto ademas nos permite:

- Reducir el coste de operaciones a la hora de introducir una pequeña funcionalidad.
- Desarrollar verticalmente e idependientemente (micro front-ends).
- Enviar/Instalar solo las funcionalidades necesarias para cada cliente.

### Live demo con angular: QuickSearch Plugin Based

El siguiente ejemplo por simplifidad no se usa webpack5 con "Module Federation".

Partiendo de un componente "QuickSearch" el cual esta compuesto de:

- search input (El campo donde escribir algún término de búsqueda)
- dropdown (El contenedor con los resultados)
- dropdown groups (Contenedores con resultados agrupados por tipo)
- dropdown groups items (Elementos que representan un los resultados)

Necesitamos poder extenderlo facilmente para incluir otras búsquedas o incluso añadir acciones a modo de shortcut... Sin alterar el código original y sin añadir nuevas dependencias.

En nuestro caso, vamos a añadir tres grupos: Cities, Departures, Arrivals.
Cada grupo tiene su propia lógica de búsqueda y el click de cada elemento en él puede derivar en diferentes acciones.

Por ejemplo:

El grupo Cities usa una consulta mediante Rest API y cuando hacemos click en una ciudad navegamos hasta /cities/:id.
Mientras que el grupo Fligths obtiene el resultado usando comunicacion basada en websocket.

Puedes ver el ejemplo funcionando en aquí:

<iframe src="https://stackblitz.com/edit/angular-ivy-nedadb?ctl=1&embed=1&file=src/app/flights/flights.module.ts&hideExplorer=1&hideNavigation=1&view=preview"></iframe>

Al importar cada modulo, es este el que al mismo tiempo importa el sdk module y le pasa la configuración.

<figure tabindex="0">
    <img src="/assets/images/quick-search-registration.png">
</figure>

En este caso "FlightsModule" registra dos grupos para la búsqueda: Arrivals y Departures.

<iframe src="https://stackblitz.com/edit/angular-ivy-nedadb?ctl=1&embed=1&file=src/app/flights/flights.module.ts&hideExplorer=1&hideNavigation=1&view=editor"></iframe>

"QuickSearchService" se usa como bridge entre el componente "QuickSearchComponent" y cada tipo de búsqueda.
