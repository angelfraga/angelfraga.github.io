---
title: Adding storybook to nx angular workspace
layout: post
categories:
- en
- nx
- angular
- storybook
lang: en
languages:
- en
- es
---

In the last days in my team we were moving from a custom "dev ui" written in angular  to storybook.
During the process we faced several challenges that I would like to share with you here. 

### The NX Project + angular + ddd plugin + material

Our nx angular workspace which structure looks similar to the next one:


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

We wanted storybook mainly for covering components in  "ui-appearance" library which is "buildable" & "publishable". 


### The storybook setup

So we  followed official documentation in order to add storybook capaibilities to our nx workspace.


<code>
npm i -D @nrwl/storybook
</code>

Then, we run the command for configuring the storybook for appearance library.


<code>
npm run nx g @nrwl/angular:storybook-configuration shared-ui-appearance
</code>


Right after we run storybook for that library with the next command 

<code>
npm run nx run shared-ui-appearance:storybook
</code>

And ... voila! 

 ### Adding a global storybook

We quickly noticed we wanted to add storybook to other shared libraries , specially  for all of them with directives and pipes in order to add more documentation.

We repeat the process and we everything worked again like charm!! Besides the fact we had to run the storybook run command invidually 😅.
Fourtunately, Nx guys did upload a video suggesting a workaround for having all libraries stories working together


<iframe width="560" height="315" src="https://www.youtube.com/embed/c323HOuFKkA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


To be honnest we did not found this video while working in our  own solution 😅 and we spent some time to figure how to include all the story files.
 
Our solution uses an app called storybook instead of a library but in the bassis is the same solution.  We also we did removed the configuration for every library since the global one was already including all stories. That allow us forget about adding the storybook configuration boilerplate* for every new library 🚀.


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


*Boilerplate* * global styles, addons ... 


 ### Adding theme toggle to storybook

Our themes are actived by adding `data-theme` attribute to the `body` element tag.  Even the light theme is not applied by default unless this attribute is set to `light`. 
Well in our app the `ThemingService` will set the default automatically. 

We decided to create our own `addon`.  From all addon types we took the toolbar one . 


One of the problems we faced, is about `JSX` support in typescript files. Since storybook is mainly written in react, our addons would be like react components.

For example  [the official addon docs](https://storybook.js.org/tutorials/create-an-addon/react/en/register-an-addon/) :

 
```typescript

import React, { useCallback } from 'react';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';
import { TOOL_ID } from './constants';

export const Tool = () => {
  const [{ myAddon }, updateGlobals] = useGlobals();

  const toggleMyTool = useCallback(
    () =>
      updateGlobals({
        myAddon: !myAddon,
      }),
    [myAddon]
  );

  return (
    <IconButton
      key={TOOL_ID}
      active={myAddon}
      title="Apply outlines to the preview"
      onClick={toggleMyTool}
    >
      <Icons icon="outline" />
    </IconButton>
  );
};
```

We would need to enable the jsx support for typescript, which is currently officially supported and described in the [typescript documentation](https://www.typescriptlang.org/docs/handbook/jsx.html): 

`base.tsconfig.json`
```json
"compilationOptions": {
     "jsx": "react"
}
```

But one of the cool things in react world is that every component is a function. So, we could convert the return statement to a function call like that: 


```typescript

... 
return IconButton(...args);
...
```
