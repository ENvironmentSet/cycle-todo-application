# cycle-todo-application

Simple todo application via cycle.js

## Why todo?

Because I want to use todo app which can be accessed in everywhere without coast.
but, I couldn't find it. so I built this.

## Used techniques

+ Programming paradigm : Functional Reactive Programming
+ Application architecture : extended MVI(MVI + modified Flux)
  - `Component = Connector(Intent) + Modeler(Model) + Renderer(View) + Router + Dispatcher`
+ Mindsets: Component, Driver, Stream, Source, Sink, Operator, Store, Action etc..(but these are most important ideas), Object as argument.
+ Libraries: ramda, xstream, cyclic-router, switch-path(used by cyclic-router), redux, redux-actions
+ Framework: Cyclejs(run/dom/history/isolate)
+ Environment:
  - Builder: webpack(webpack-dev-server, Hot-Module-Replacement, css/style-loader, html/clean-webpack-plugin)

## Repository structure

+ `/`: root directory, contains source code and configure files.
+ `src`: source code directory, contains source code.
+ `components`: components directory, contains organized components. in outside of component directory, must not access inner files except `index.js`.
  - `index.js`: component code. this file is required.
  - `style.css`: component's style. this file is optional.
+ `constants`: constant value directory.
+ `drivers`: drivers directory.
+ `store`: provides redux store and action creators.
  - `ducks`: contains action creators, follows ducks structure.

## Known Issues

+ index export file of some directory(`constants`, `drivers`, `components`) are missing
+ streams that derived from `state$` are not optimized.
+ no directory for pages, this is my mistake.
