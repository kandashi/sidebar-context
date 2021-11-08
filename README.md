![](https://img.shields.io/badge/Foundry-v0.8.6-informational)
<!--- Downloads @ Latest Badge -->
<!--- replace <user>/<repo> with your username/repository -->
<!--- ![Latest Release Download Count](https://img.shields.io/github/downloads/<user>/<repo>/latest/module.zip) -->

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
<!--- ![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2F<your-module-name>&colorB=4aa94a) -->

Adds a few right click options for various documents:

### Roll Tables

- Adds a "Roll" button

### Actors

- Adds a "Prototype Token" button
- Adds an "Update Child Tokens" button, updates all tokens from the parent actor to the current Prototype Token data

### Items

- Adds a "Display to chat" button, which sends a chat message in the same way rolling the item from the actor

### Scene

- Adds a menu to the context dropdown for the Scene Directory menus to shut all doors in the selected scene to prepare it for a fresh visit from characters. The Doors that are currently locked remain locked, and are not closed.
- Adds a menu to the context dropdown for the Scene Directory menus to delete fog in the selected scene to prepare it for a fresh visit from characters. I find it useful after QAing a new map for holes in walls/doors and checking lighting, etc.

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/kandashi/sidebar-context/master/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button
