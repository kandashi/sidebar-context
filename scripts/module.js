RollTableDirectory.prototype._getEntryContextOptions = function newTableContext() {
    const options = SidebarDirectory.prototype._getEntryContextOptions.call(this);
    return [
        {
            name: "TABLE.Roll",
            icon: `<i class="fas fa-dice-d20"></i>`,
            condition: li => {
                const table = game.tables.get(li.data("entityId"));
                return table.data.img !== CONST.DEFAULT_TOKEN;
            },
            callback: li => {
                const table = game.tables.get(li.data("entityId"));
                table.draw()
            }
        }
    ].concat(options);
}

/**
JournalDirectory.prototype._getEntryContextOptions = function newJournalContext() {
    const options =  SidebarDirectory.prototype._getEntryContextOptions.call(this);
    return options.concat([
      {
        name: "SIDEBAR.JumpPin",
        icon: '<i class="fas fa-crosshairs"></i>',
        condition: li => {
          const entry = game.journal.get(li.data("entity-id"));
          return !!entry.sceneNote;
        },
        callback: li => {
          const entry = game.journal.get(li.data("entity-id"));
          return entry.panToNote();
        }
      },
      {
        name: "sidebar-context.addImage",
        icon: '<i class="fas fa-images"></i>',
        condition: li => {
          const entry = game.journal.get(li.data("entity-id"));
          return !!entry;
        },
        callback: li => {
          const entry = game.journal.get(li.data("entity-id"));
          return entry.panToNote();
        }
      }
    ]);
  }**/

ActorDirectory.prototype._getEntryContextOptions = function newActorContext() {
    const options = SidebarDirectory.prototype._getEntryContextOptions.call(this);
    return [
        {
            name: "SIDEBAR.CharArt",
            icon: '<i class="fas fa-image"></i>',
            condition: li => {
                const actor = game.actors.get(li.data("entityId"));
                return actor.data.img !== CONST.DEFAULT_TOKEN;
            },
            callback: li => {
                const actor = game.actors.get(li.data("entityId"));
                new ImagePopout(actor.data.img, {
                    title: actor.name,
                    shareable: true,
                    uuid: actor.uuid
                }).render(true);
            }
        },
        {
            name: "SIDEBAR.TokenArt",
            icon: '<i class="fas fa-image"></i>',
            condition: li => {
                const actor = game.actors.get(li.data("entityId"));
                if (actor.data.token.randomImg) return false;
                return ![null, undefined, CONST.DEFAULT_TOKEN].includes(actor.data.token.img);
            },
            callback: li => {
                const actor = game.actors.get(li.data("entityId"));
                new ImagePopout(actor.data.token.img, {
                    title: actor.name,
                    shareable: true,
                    uuid: actor.uuid
                }).render(true);
            }
        },
        {
            name: "sidebar-context.prototype",
            icon: '<i class="fas fa-user circle"></i>',
            condition: li => {
                return true
            },
            callback: li => {
                const actor = game.actors.get(li.data("entityId"));
                new CONFIG.Token.sheetClass(actor, {
                    left: Math.max(this.position.left - 560 - 10, 10),
                    top: this.position.top
                  }).render(true);
            }
        }
    ].concat(options);
}