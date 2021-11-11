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

ActorDirectory.prototype._getEntryContextOptions = function newActorContext() {
    const options = SidebarDirectory.prototype._getEntryContextOptions.call(this);
    return [
        {
            name: "SIDEBAR.CharArt",
            icon: '<i class="fas fa-image"></i>',
            condition: li => {
                const actor = game.actors.get(li.data("entityId"));
                if(game.user.isGM || (actor.owner && game.user.can("TOKEN_CONFIGURE"))){
                  return actor.data.img !== CONST.DEFAULT_TOKEN;
                }else{
                  return false;
                }
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
                if(game.user.isGM || (actor.owner && game.user.can("TOKEN_CONFIGURE"))){
                  if (actor.data.token.randomImg) return false;
                  return ![null, undefined, CONST.DEFAULT_TOKEN].includes(actor.data.token.img);
                }else{
                  return false;
                }
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
                const actor = game.actors.get(li.data("entityId"));
                if(game.user.isGM || (actor.owner && game.user.can("TOKEN_CONFIGURE"))){
                  return true;
                }else{
                  return false;
                }
            },
            callback: li => {
                const actor = game.actors.get(li.data("entityId"));
                new CONFIG.Token.sheetClass(actor, {
                    left: Math.max(this.position.left - 560 - 10, 10),
                    top: this.position.top
                }).render(true);
            }
        },
        {
            name: "sidebar-context.updateChildren",
            icon: `<i class="fas fa-user-edit"></i>`,
            condition: li => {
                const actor = game.actors.get(li.data("entityId"));
                if(game.user.isGM || (actor.owner && game.user.can("TOKEN_CONFIGURE"))){
                  return !actor.data.token.actorLink;
                }else{
                  return false;
                }
            },
            callback: li => {
                const actor = game.actors.get(li.data("entityId"));
                updateChildren.call(actor)
            }
        }
    ].concat(options);
}


ItemDirectory.prototype._getEntryContextOptions = function newItemContext() {
    const options = SidebarDirectory.prototype._getEntryContextOptions.call(this);
    return [
        {
            name: "ITEM.ViewArt",
            icon: '<i class="fas fa-image"></i>',
            condition: li => {
                const item = game.items.get(li.data("entityId"));
                return item.data.img !== CONST.DEFAULT_TOKEN;
            },
            callback: li => {
                const item = game.items.get(li.data("entityId"));
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
                const item = game.items.get(li.data("entityId"));
                newChatCard.call(item)
            }
        }
    ].concat(options);
}

SceneDirectory.prototype._getEntryContextOptions = function newSceneEntryContext() {
  const options = SidebarDirectory.prototype._getEntryContextOptions.call(this);
  return [
    {
      name: 'sidebar-context.resetDoors',
      icon: '<i class="fas fa-door-closed"></i>',
      condition: (li) => {
        return game.user?.isGM;
      },
      callback: async (li) => {
        const scene = game.scenes?.get(li.data('entityId'));
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
        const scene = game.scenes?.get(li.data('entityId'));
        const isCurrentScene = scene.data._id == canvas.scene?.data._id;
        await resetFog(isCurrentScene, scene.data._id);
      }
    }
  ].concat(options);
}

SceneDirectory.prototype._getFolderContextOptions  = function newSceneFolderContext() {
  const options = SidebarDirectory.prototype._getFolderContextOptions.call(this);
  return [
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
  ].concat(options);
}

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
    let updates = updateArr.map(i =>  (Object.assign({_id: i.id}, data)))
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
  if (isCurrentScene) {
    await canvas
      .walls?.doors.filter((item) => item.data.ds == 1)
      .forEach((item) => item.update({ ds: 0 }, {}));
  } else {
    if (id) {
      await game
        .scenes?.get(id)
        ?.data.walls.filter((item) => item.data.door != 0)
        .forEach((x) => (x.data.ds = 0));
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

  return Scene.update(updates);
}
