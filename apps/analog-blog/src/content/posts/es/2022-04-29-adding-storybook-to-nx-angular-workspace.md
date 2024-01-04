---
title: Añadir storybook a nx workspace
layout: post
slug: 2022-04-29-adding-storybook-to-nx-angular-workspace
date: 2022-04-29
categories:
  - en
  - nx
  - angular
  - storybook
lang: en
languages:
  - en
  - es
config:
  colors:
    h: 355
    s: 100%
    l: 38%
---

En los últimos dias, decidimos en mi equipo migrar nuestra aplicación "dev ui" hecha en angular a storybook.
Durant el proceso nos enfrentamos a un par de retos que me gustaría compartir contigo aquí.

### El projecto NX + angular + ddd plugin + material

Nuestro projecto es un projecto nx con angular que luce de la siguiente manera:

<pre>
|-apps
| |-app-a
| |-...
|-libs
| |-context-a 
| | |-domain
| | | |-application
| | | |-entities
| | | |-infrastructure
| | |-feature-a
| | |-shared-ui
| |-other-context
| |-shared
| | |-ui-appearance
| | | |-src
| | | | |-lib
| | | | | |- theming (basado en angular material )
| | | | | | |-... (mixins | variables | overrides ...)
| | | | | | |- themes
| | | | | | | |- _dark.scss
| | | | | | | |- _light.scss
| | | | | | | |- main.scss (light + dark setup)
| | | | | |- ui-module-n (forms | dialogs | layout ... )
| | |- utils-a
...
</pre>

Con storybook queriamos principalmente cubrir la documentación de nuestra libreria "ui-appearance" que es "buildable" & "publishable".

### El setup de Storybook

Seguimos la documentatición oficail de Nx para Storybook en angular que puedes encontrar aquí :

https://nx.dev/storybook/overview-angular

`npm i -D @nrwl/storybook`

Acto seguido, añadimos la configuración de Storybook a nuestra libreria `shared-ui-appearance`.

`npm run nx g @nrwl/angular:storybook-configuration shared-ui-appearance`

Y lanzamos la web app de Storybook con el siguiente comando

`npm run nx run shared-ui-appearance:storybook`

And ... voila!

### Adding a global storybook

Prontro, nos dimos cuenta que otras librerias compartidas también necesitarían este setup, especialment aquellas con directivas y pipes.

Repetimos el proceso y todo funcionó perfectamente. Pero claro lanzar un storybook por librería 😅 no entraba en el plan de tener un única instancia de Storybook con todo.

Afortunadamente, los chicos de Nx subieron un vídeo planteando una manera de obtener no solo por librería si no tambien una instancia global con todas las stories en el repo.

<iframe width="560" height="315" src="https://www.youtube.com/embed/c323HOuFKkA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Para ser honesto no encontramos este video mientra tratabamos de solucionar este problemilla 😅, por eso nos llevo un tiempo pensar como incluir todas las stories en una instancia.

Nuestra solución final es identica a la propuesta por los chicos de Nx en el vídeo, exceptio porque nosotros usamos una `app` llamada `storybook` y eliminamos todo el setup previo de cada librería.
Entre otras cosas, esto nos permite eliminar la **tarea de monos** de añadir este setup con cada nueva librería 🚀.

<pre>
|-apps
| |-app-a
| |-**storybook**
| |-...
|-libs
| |-context-a 
| | |-domain
| | | |-application
| | | |-entities
| | | |-infrastructure
| | |-feature-a
| | |-shared-ui
| |-other-context
| |-shared
| | |-ui-appearance
| | | |-src
| | | | |-lib
| | | | | |- theming (angular material based)
| | | | | | |-... (mixins | variables | overrides ...)
| | | | | | |- themes
| | | | | | | |- _dark.scss
| | | | | | | |- _light.scss
| | | | | | | |- main.scss (light + dark setup)
| | | | | |- ui-module-n (forms | dialogs | layout ... )
| | |- utils-a
...
     
</pre>

_Tare de monos_ , añadir los estilos globales, addons ...

### Añadir un addon para cambiar el tema

Nuestro dos temas se activan cuando el valor del atributo `data-theme` en elemento `body` contiene `light` or `dark`. Ya que no tenemos un tema por defecto si no que este es calculado teniendo encuenta la configuración de la app, del localstorage ... Necesitabamos algo que activara un tema al cargar la story en el `canvas`.

Para ello, creamos un `Toolbar` addon siguiento esta guía.

https://storybook.js.org/docs/angular/addons/writing-addons

TODO: add solution without JSX
