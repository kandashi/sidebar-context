Hooks.once('init', async () => {

  Hooks.on('getRollTableDirectoryEntryContext', (html, options) => {
    options.push(
      {
        name: "TABLE.Roll",
        icon: `<i class="fas fa-dice-d20"></i>`,
        condition: li => {
          const table = game.tables.get(li.data("documentId"));
          return table.data.img !== CONST.DEFAULT_TOKEN;
        },
        callback: li => {
          const table = game.tables.get(li.data("documentId"));
          table.draw()
        }
      }
    );
  });

  Hooks.on('getActorDirectoryEntryContext', (html, options) => {
    options.push(
      {
        name: "sidebar-context.prototype",
        icon: '<i class="fas fa-user circle"></i>',
        condition: li => {
          const actor = game.actors.get(li.data("documentId"));
          if (game.user.isGM || (actor.owner && game.user.can("TOKEN_CONFIGURE"))) {
            return true;
          } else {
            return false;
          }
        },
        callback: li => {
          const actor = game.actors.get(li.data("documentId"));
          if (game.version >= 10) {
            new CONFIG.Token.prototypeSheetClass(actor.prototypeToken).render(true);
          } else {
            new CONFIG.Token.prototypeSheetClass(actor).render(true);
          }
        }
      },
      {
        name: "sidebar-context.updateChildren",
        icon: `<i class="fas fa-user-edit"></i>`,
        condition: li => {
          const actor = game.actors.get(li.data("documentId"));
          if (game.user.isGM || (actor.owner && game.user.can("TOKEN_CONFIGURE"))) {
            return !actor.data.token.actorLink;
          } else {
            return false;
          }
        },
        callback: li => {
          const actor = game.actors.get(li.data("documentId"));
          updateChildren.call(actor)
        }
      }
    );
  });

  Hooks.on('getItemDirectoryEntryContext', (html, options) => {
    options.push(
      {
        name: "ITEM.ViewArt",
        icon: '<i class="fas fa-image"></i>',
        condition: li => {
          const item = game.items.get(li.data("documentId"));
          return item.data.img !== CONST.DEFAULT_TOKEN;
        },
        callback: li => {
          const item = game.items.get(li.data("documentId"));
          new ImagePopout(item.data.img, {
            title: item.name,
            shareable: true,
            uuid: item.uuid
          }).render(true);
        }
      },
      {
        name: "sidebar-context.displayChat",
        icon: `<i class="fas fa-dice-d20"></i>`,
        condition: li => {
          return true
        },
        callback: li => {
          const item = game.items.get(li.data("documentId"));
          newChatCard.call(item)
        }
      }
    );
  });

  Hooks.on('getSceneDirectoryEntryContext', (html, options) => {
    options.push(
      {
        name: 'sidebar-context.resetDoors',
        icon: '<i class="fas fa-door-closed"></i>',
        condition: (li) => {
          return game.user?.isGM;
        },
        callback: async (li) => {
          const scene = game.scenes?.get(li.data('documentId'));
          const isCurrentScene = scene.data._id == canvas.scene?.data._id;
          await resetDoors(isCurrentScene, scene.data._id);
        }
      },
      {
        name: 'sidebar-context.resetFog',
        icon: '<i class="fas fa-dungeon"></i>',
        condition: (li) => {
          return game.user?.isGM;
        },
        callback: async (li) => {
          const scene = game.scenes?.get(li.data('documentId'));
          const isCurrentScene = scene.data._id == canvas.scene?.data._id;
          await resetFog(isCurrentScene, scene.data._id);
        }
      },
      {
        name: "SCENES.Preload",
        icon: '<i class="fas fa-download"></i>',
        condition: (li) => {
          return game.user?.isGM;
        },
        callback: li => {
          const scene = game.scenes?.get(li.data('documentId'));
          game.scenes.preload(scene.id, true);
        }
      },
    );
  });

  Hooks.on('getSceneDirectoryFolderContext', (html,options)=>{
    options.push(
      {
        name: 'sidebar-context.showNavAll',
        icon: '<i class="fas fa-eye"></i>',
        condition: (header) => {
          return game.user?.isGM;
        },
        callback: (header) => {
          const folderId = header.parent().data('folderId');
          setNavigationForAllScenes(folderId, true);
        }
      },
      {
        name: 'sidebar-context.hideNavAll',
        icon: '<i class="fas fa-eye-slash"></i>',
        condition: (header) => {
          return game.user?.isGM;
        },
        callback: (header) => {
          const folderId = header.parent().data('folderId');
          setNavigationForAllScenes(folderId, false);
        }
      }
    );
  });
});

async function newChatCard() {
  const templateData = {
    item: this.data,
    data: this.getChatData(),
    labels: this.labels,
    hasAttack: this.hasAttack,
    isHealing: this.isHealing,
    hasDamage: this.hasDamage,
    isVersatile: this.isVersatile,
    isSpell: this.data.type === "spell",
    hasSave: this.hasSave,
    hasAreaTarget: this.hasAreaTarget,
    isTool: this.data.type === "tool",
    hasAbilityCheck: this.hasAbilityCheck
  };
  const html = await renderTemplate("systems/dnd5e/templates/chat/item-card.html", templateData);

  // Create the ChatMessage data object
  const chatData = {
    user: game.user.data._id,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    content: html,
    flavor: this.data.data.chatFlavor || this.name,
    flags: { "core.canPopout": true }
  };

  // Apply the roll mode to adjust message visibility
  ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));

  // Create the Chat Message or return its data
  return ChatMessage.create(chatData)
}

async function updateChildren() {
  let data = this.data.token.toObject()
  let tokArr = Array.from(game.scenes.active.data.tokens)
  let updateArr = tokArr.filter(i => i.data.actorId === this.id)
  let updates = updateArr.map(i => (Object.assign({ _id: i.id }, data)))
  new Dialog({
    title: game.i18n.localize("sidebar-context.updateChildrenTitle"),
    content: game.i18n.localize("sidebar-context.updateChildrenContent"),
    buttons: {
      one: {
        label: game.i18n.localize("Yes"),
        callback: () => {
          game.scenes.active.updateEmbeddedDocuments("Token", updates)
        }
      }
    }
  }).render(true)

}

async function resetDoors(isCurrentScene, id) {
  let updates = []
  if (isCurrentScene) {
    canvas
      .walls?.doors.filter((item) => item.data.ds === 1)
      .forEach((item) => updates.push({ _id: item.id, ds: 0 }))
    await canvas.scene.updateEmbeddedDocuments("Wall", updates)
  } else {
    if (id) {
      let scene = game.scenes?.get(id)
      scene
        .data.walls.filter((item) => item.data.ds === 1)
        .forEach((x) => updates.push({ _id: x.id, ds : 0 }))
      await scene.updateEmbeddedDocuments("Wall", updates)
    }
  }
  ui.notifications?.info(`Doors have been shut.`);
}

async function resetFog(isCurrentScene, id = null) {
  if (isCurrentScene) {
    canvas.sight?.resetFog();
  } else {
    if (id) {
      await SocketInterface.dispatch('modifyDocument', {
        type: 'FogExploration',
        action: 'delete',
        data: { scene: id },
        options: { reset: true },
        //parentId: "",
        //parentType: ""
      });
      ui.notifications?.info(`Fog of War exploration progress was reset.`);
    }
  }
}

/**
 * Shows or hides all scenes in this folder in the navigation bar
 * @param {string}  folder  the id or name of the folder in which to toggle permissions
 * @param {boolean} navOn   whether navigation should be on or off for all scenes in the given folder
 */
function setNavigationForAllScenes(folder, navOn) {
  const folderObject = game.folders.get(folder) || game.folders.getName(folder);

  const updates = game.scenes
    .filter((scene) => scene.data.folder === folderObject.id)
    .map((scene) => ({ _id: scene.id, navigation: navOn }));

  return Scene.updateDocuments(updates);
}
