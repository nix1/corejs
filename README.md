The library has been created by Samsung Electronics Co., Ltd. but since it is licensed under an open source license (Apache License, Version 2.0) I created a public repository using the code imported from the Tizen SDK.
You are welcome to fork the repository and to submit pull requests.


# CoreJS Micro Framework #
The core.js Micro Framework is a small, modular application framework designed specifically for Tizen Web Applications.

# Overview #

The web applications based on CoreJS usually use a simple MVP (Model View Presenter) architecture.

The core part determines the architecture and the app part determines the application behavior.


# Overview of core.js #

The `core.js` file implements a simple AMD-like loader. It's similar to [requirejs](https://github.com/requirejs) (although the formats are not compatible), but it's much lighter and therefore more suitable for devices with low memory and processing power such as the Samsung Gear series.

Modules definition organizes code into simple units (modules).
Module can refer to other modules – dependency references.

# Overview of modules #

The modules help with the development of web applications. Many of them are based on Tizen APIs and provide easier to system functions and add some useful higher-level functionalities.

## Loading ##

`core.js` loads files with a different approach than &lt;script&gt; tags in HTML file.

`core.js` loads each file as a script tag, using _document.createElement_ and _head.appendChild_ and then waits for all dependencies to load, figures the right order to call definitions of module.

## Usage ##

Adding `core.js` to index.html:
```
<script src="./js/libs/core/core.js" data-main="./js/app.js"></script>
```


Where `app.js` is the main application module.

```
define({
    name: 'app',
    def: function def() {}
});
```

### Defining a module ###
A module is a file with simple code unit, different from a traditional script file. Modules keep the global (_window_) namespace clean, no variables are created in the global scope.
Any valid return from a module is allowed - the module can return an object, a function or nothing. If the module definition returns and object with
with an _init_ method, then this method with be automatically called so the module will be initialized.
There should only be __one__ module definition per file.


# Contributors #

* Sergiusz Strumiński
* Paweł Sierszeń
* Kamil Stepczuk
