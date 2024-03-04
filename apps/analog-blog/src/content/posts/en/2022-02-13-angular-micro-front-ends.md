---
title: Extensions/Plugins based App
author: Angel Fraga
layout: post
image: https://angular.io/assets/images/logos/angular/angular.svg
date: '2022-02-13 12:00:00 +0100'
slug: 2022-02-13-angular-micro-front-ends
categories:
  - en
  - angular
summary: Series about micro front-ends in angular.
lang: en
languages:
  - en
  - es
config:
  hero:
    title: Extensions/Plugins based App
    image: https://angular.io/assets/images/logos/angular/angular.svg
  colors:
    h: 216
    s: 85%
    l: 34%
---

## What is a plugin ?

> **Wikipedia**
> In computing, a plug-in (or plugin, add-in, addin, add-on, or addon) is a software component that adds a specific feature to an existing computer program.

Nowadays we can use as an example an app like VSCode, which is composed by
a bunch of elements: alerts, panels, commands... that can be used by extensions.

Each extension makes use of an "sdk" library which is exposed by the host (VSCode Editor).
With this library, the extension is able to register its own alerts, panels, commands...

In the following example we can see how the "Docker" extension makes use of this sdk to register
a tree container and several trees.

<figure tabindex="0">
    <figcaption>
        <a href="https://github.com/microsoft/vscode-docker/blob/3dcdb38e64922abc8c1d2ef50a43e45773b30c66/src/tree/registerTrees.ts#L19"
        target="__blank" >
        Original Code in Github
        </a>
    </figcaption>
    <img alt="vscode docker register-trees.ts" src="/assets/images/vscode-docker-register-trees-ts.png">
</figure>

<figure tabindex="0">
<img alt="vscode docker extension" src="/assets/images/vscode-docker-ext.png">
</figure>

One of the points to take into account is the startup time of the application since the plugins have to be loaded at startup.

This explains the performance difference between a VSCode instance with and without extensions.

### Module Federation (Webpack 5) ❤ Angular (Micro Front-ends)

Thanks to the advances with "Module Federation" in webpack 5, we are now able to decouple the rest of the plugins from the host application source code and load them dynamically.

This also allows us to:

- Reduce the cost of operations when introducing a small functionality.
- Develop vertically and independently (micro front-ends).
- Ship/install only the necessary functionalities for each client.

### Live demo with angular: QuickSearch Plugin Based

The following example for simplicity does not use webpack5 with "Module Federation", but it shows one approach for plug & extends on the fly an exsiting component.

Starting from a "QuickSearch" component which is composed of:

- search input (The field where to write some search term)
- dropdown (The container with the results)
- dropdown groups (Containers with results grouped by type)
- dropdown groups items (Items representing the results)

We need to be able to extend it easily to include other searches or even add actions as shortcut... Without altering the original code and without adding new dependencies.

In our case, we are going to add three groups: Cities, Departures, Arrivals.
Each group has its own search logic and clicking on each element in it can derive in different actions.

For example:

Cities group uses a query via Rest API and when we click on a city we navigate to /cities/:id.
While the Fligths group gets the result using websocket based communication.

You can see the working example here:

<iframe src="https://stackblitz.com/edit/angular-ivy-nedadb?ctl=1&embed=1&file=src/app/flights/flights.module.ts&hideExplorer=1&hideNavigation=1&view=preview"></iframe>

When importing each module, at the same time imports the SDK module and passes its own configuration to it.

<figure tabindex="0">
    <img src="/assets/images/quick-search-registration.png">
</figure>

In that case "FlightsModule" registers two search groups: Arrivals y Departures.

<iframe src="https://stackblitz.com/edit/angular-ivy-nedadb?ctl=1&embed=1&file=src/app/flights/flights.module.ts&hideExplorer=1&hideNavigation=1&view=editor"></iframe>

"QuickSearchService" is being used as a kind of bridge between "QuickSearchComponent" and each search logic.
