# Sidebar Context

![Latest Release Download Count](https://img.shields.io/github/downloads/kandashi/sidebar-context/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) 

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fsidebar-context&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=sidebar-context) 

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fkandashi%2Fsidebar-context%2Fmaster%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fkandashi%2Fsidebar-context%2Fmaster%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fsidebar-context%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/sidebar-context/)

Adds a few right click options for various documents:

### Roll Tables

- Adds a "Roll" button
- Make Roll: Performs the roll in public and displays the results to GM only.
- Request Named Roll: Displays a chat card with button asking a player to click it to roll on a the table which is named. When they click it, the roll happens just as with the 'Make Roll' option.
- Request Blind Roll: Displays the same chat card prompt, but without the name of the table.

### Actors

- Adds a "Prototype Token" button
- Adds an "Update Child Tokens" button, updates all tokens from the parent actor to the current Prototype Token data

### Items

- Adds a "Display to chat" button, which sends a chat message in the same way rolling the item from the actor

### Scene

- Adds a menu to the context dropdown for the Scene Directory menus to shut all doors in the selected scene to prepare it for a fresh visit from characters. The Doors that are currently locked remain locked, and are not closed.
- Adds a menu to the context dropdown for the Scene Directory menus to delete fog in the selected scene to prepare it for a fresh visit from characters. I find it useful after QAing a new map for holes in walls/doors and checking lighting, etc.
- Add on the folder scene context options the two options for hide all the scene on the navigation bar or show all.

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/kandashi/sidebar-context/master/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### socketlib

This module uses the [socketlib](https://github.com/manuelVo/foundryvtt-socketlib) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/kandashi/sidebar-context/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

- [Rolltable Requester](https://github.com/colinbate/rolltable-requester): [MIT](https://github.com/colinbate/rolltable-requester/blob/main/LICENSE)


This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- [Rolltable Requester](https://github.com/colinbate/rolltable-requester) ty to [Malekal4699](ttps://github.com/colinbate/)
