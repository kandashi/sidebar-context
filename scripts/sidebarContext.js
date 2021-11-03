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
        },
        {
            name: "sidebar-context.updateChildren",
            icon: `<i class="fas fa-user-edit"></i>`,
            condition: li => {
                const actor = game.actors.get(li.data("entityId"));
                return !actor.data.token.actorLink
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
        },
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