import CONSTANTS from "./constants";

// const CONSTANTS.MODULE_NAME = 'sidebar-context';
// const TEMPLATE_PATH = `/modules/${CONSTANTS.MODULE_NAME}/templates`;
// const WHISPER_FN = 'cheekyWhisper';

export const initHooks = async (): Promise<void> => {
	Hooks.on("getRollTableDirectoryEntryContext", (html, options) => {
		options.push({
			name: "TABLE.Roll",
			icon: `<i class="fas fa-dice-d20"></i>`,
			condition: (li) => {
				const table = <any>game.tables?.get(li.data("documentId"));
				return table.data.img !== CONST.DEFAULT_TOKEN;
			},
			callback: (li) => {
				const table = <any>game.tables?.get(li.data("documentId"));
				table.draw();
			},
		});
		// const menuId = 'rolltable-requester';
		// if (entries.some(e => e.menuId === menuId)) {
		//   return;
		// }
		// Add options at the top.
		options.unshift(
			{
				// menuId,
				name: game.i18n.localize("sidebar-context.menuMakeRoll"),
				icon: '<i class="fas fa-dice-d20"></i>',
				callback: (target) => makeRollById(target.data("document-id")),
			},
			{
				name: game.i18n.localize("sidebar-context.menuRequestRoll"),
				icon: '<i class="fas fa-question-circle"></i>',
				condition: game.user?.isGM,
				callback: (target) => requestRollById(target.data("document-id")),
			},
			{
				name: game.i18n.localize("sidebar-context.menuRequestBlindRoll"),
				icon: '<i class="fas fa-eye-slash"></i>',
				condition: game.user?.isGM,
				callback: (target) => requestRollById(target.data("document-id"), { blind: true }),
			},
			{
				name: game.i18n.localize("sidebar-context.menuRequestDescRoll"),
				icon: '<i class="fas fa-book-sparkles"></i>',
				condition: game.user?.isGM,
				callback: (target) => requestRollById(target.data("document-id"), { description: true }),
			}
		);
		// }
	});

	Hooks.on("getActorDirectoryEntryContext", (html, options) => {
		options.push(
			{
				name: "sidebar-context.prototype",
				icon: '<i class="fas fa-user circle"></i>',
				condition: (li) => {
					const actor = <Actor>game.actors?.get(li.data("documentId"));
					if (game.user?.isGM || (actor.isOwner && game.user?.can("TOKEN_CONFIGURE"))) {
						return true;
					} else {
						return false;
					}
				},
				callback: (li) => {
					const actor = <any>game.actors?.get(li.data("documentId"));
					// if (game.version >= 10) {
					new CONFIG.Token.prototypeSheetClass(actor.prototypeToken).render(true);
					// } else {
					//   new CONFIG.Token.prototypeSheetClass(actor).render(true);
					// }
				},
			},
			{
				name: "sidebar-context.updateChildren",
				icon: `<i class="fas fa-user-edit"></i>`,
				condition: (li) => {
					const actor = <any>game.actors?.get(li.data("documentId"));
					if (game.user?.isGM || (actor.isOwner && game.user?.can("TOKEN_CONFIGURE"))) {
						return !actor.data.token.actorLink;
					} else {
						return false;
					}
				},
				callback: (li) => {
					const actor = game.actors?.get(li.data("documentId"));
					updateChildren.call(actor);
				},
			}
		);
	});

	Hooks.on("getItemDirectoryEntryContext", (html, options) => {
		options.push(
			{
				name: "ITEM.ViewArt",
				icon: '<i class="fas fa-image"></i>',
				condition: (li) => {
					const item = <any>game.items?.get(li.data("documentId"));
					return item.data.img !== CONST.DEFAULT_TOKEN;
				},
				callback: (li) => {
					const item = <any>game.items?.get(li.data("documentId"));
					new ImagePopout(item.data.img, {
						title: item.name,
						shareable: true,
						uuid: item.uuid,
					}).render(true);
				},
			},
			{
				name: "sidebar-context.displayChat",
				icon: `<i class="fas fa-dice-d20"></i>`,
				condition: (li) => {
					return true;
				},
				callback: (li) => {
					const item = game.items?.get(li.data("documentId"));
					newChatCard.call(item);
				},
			}
		);
	});

	Hooks.on("getSceneDirectoryEntryContext", (html, options) => {
		options.push(
			{
				name: "sidebar-context.resetDoors",
				icon: '<i class="fas fa-door-closed"></i>',
				condition: (li) => {
					return game.user?.isGM;
				},
				callback: async (li) => {
					const scene = <any>game.scenes?.get(li.data("documentId"));
					const isCurrentScene = scene.data._id == canvas.scene?.data._id;
					await resetDoors(isCurrentScene, scene.data._id);
				},
			},
			{
				name: "sidebar-context.resetFog",
				icon: '<i class="fas fa-dungeon"></i>',
				condition: (li) => {
					return game.user?.isGM;
				},
				callback: async (li) => {
					const scene = <any>game.scenes?.get(li.data("documentId"));
					const isCurrentScene = scene.data._id == canvas.scene?.data._id;
					await resetFog(isCurrentScene, scene.data._id);
				},
			},
			{
				name: "SCENES.Preload",
				icon: '<i class="fas fa-download"></i>',
				condition: (li) => {
					return game.user?.isGM;
				},
				callback: (li) => {
					const scene = <any>game.scenes?.get(li.data("documentId"));
					game.scenes?.preload(scene.id, true);
				},
			}
		);
	});

	Hooks.on("getSceneDirectoryFolderContext", (html, options) => {
		options.push(
			{
				name: "sidebar-context.showNavAll",
				icon: '<i class="fas fa-eye"></i>',
				condition: (header) => {
					return game.user?.isGM;
				},
				callback: (header) => {
					const folderId = header.parent().data("folderId");
					setNavigationForAllScenes(folderId, true);
				},
			},
			{
				name: "sidebar-context.hideNavAll",
				icon: '<i class="fas fa-eye-slash"></i>',
				condition: (header) => {
					return game.user?.isGM;
				},
				callback: (header) => {
					const folderId = header.parent().data("folderId");
					setNavigationForAllScenes(folderId, false);
				},
			}
		);
	});
};

Hooks.once("ready", async function () {
	$(document).on("click.sidebar-context-rolltable-requester", ".rt-requester", function () {
		console.log("RR: Handling button click");
		const c = $(this);
		const tid = c.data("tableid");
		makeRollById(tid);
	});
});

let sideBarContextSocket;

Hooks.once("socketlib.ready", () => {
	//@ts-ignore
	sideBarContextSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);
	sideBarContextSocket.register(CONSTANTS.WHISPER_FN, cheekyWhisper);
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
		hasAbilityCheck: this.hasAbilityCheck,
	};
	const html = await renderTemplate(`modules/${CONSTANTS.MODULE_NAME}/templates/item-card.html`, templateData);

	// Create the ChatMessage data object
	const chatData = {
		user: game.user?.data._id,
		type: CONST.CHAT_MESSAGE_TYPES.OTHER,
		content: html,
		flavor: this.data.data.chatFlavor || this.name,
		flags: { "core.canPopout": true },
	};

	// Apply the roll mode to adjust message visibility
	ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));

	// Create the Chat Message or return its data
	return ChatMessage.create(chatData);
}

async function updateChildren() {
	let data = this.data.token.toObject();
	let tokArr = Array.from(<any>game.scenes?.active?.data.tokens);
	let updateArr = tokArr.filter((i: any) => i.data.actorId === this.id);
	let updates = updateArr.map((i: any) => Object.assign({ _id: i.id }, data));
	new Dialog({
		title: game.i18n.localize("sidebar-context.updateChildrenTitle"),
		content: game.i18n.localize("sidebar-context.updateChildrenContent"),
		buttons: {
			one: {
				label: game.i18n.localize("Yes"),
				callback: () => {
					game.scenes?.active?.updateEmbeddedDocuments("Token", updates);
				},
			},
		},
	}).render(true);
}

async function resetDoors(isCurrentScene, id) {
	let updates = <any[]>[];
	if (isCurrentScene) {
		canvas.walls?.doors
			.filter((item) => item.data.ds === 1)
			.forEach((item) => updates.push({ _id: item.id, ds: 0 }));
		await canvas.scene?.updateEmbeddedDocuments("Wall", updates);
	} else {
		if (id) {
			let scene = <any>game.scenes?.get(id);
			scene.data.walls.filter((item) => item.data.ds === 1).forEach((x) => updates.push({ _id: x.id, ds: 0 }));
			await scene.updateEmbeddedDocuments("Wall", updates);
		}
	}
	ui.notifications?.info(`Doors have been shut.`);
}

async function resetFog(isCurrentScene, id = null) {
	if (isCurrentScene) {
		canvas.sight?.resetFog();
	} else {
		if (id) {
			await SocketInterface.dispatch("modifyDocument", <any>{
				type: "FogExploration",
				action: "delete",
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
	const folderObject = <any>game.folders?.get(folder) || game.folders?.getName(folder);

	const updates = game.scenes
		?.filter((scene) => scene.data.folder === folderObject.id)
		.map((scene) => ({ _id: scene.id, navigation: navOn }));

	return Scene.updateDocuments(updates);
}

async function rolltableRequesterMakeRoll(table) {
	const formula = table.formula ?? table.data.formula;
	const pRoll = new Roll(formula);
	const die = await pRoll.roll({ async: true });
	await pRoll.toMessage({}, <any>{
		rollMode: CONFIG.Dice.rollModes.publicroll,
		create: true,
	});

	const results = table.getResultsForRoll(die.total);
	const thanks = game.i18n.localize("sidebar-context.playerThanks");
	const user = thanks.replace(/\{PLAYER\}/g, <any>game.user?.name);
	const myHtml = await renderTemplate(`${CONSTANTS.TEMPLATE_PATH}/result-card.html`, {
		name: table.name,
		thumbnail: table.thumbnail,
		total: die.total,
		user,
		content: results[0].text ?? results[0].data.text,
	});
	const drawChatData = {
		content: myHtml,
	};
	await sideBarContextSocket.executeAsGM(CONSTANTS.WHISPER_FN, drawChatData);
}

async function makeRollById(tid) {
	const table = game.tables?.get(tid);
	rolltableRequesterMakeRoll(table);
}

async function makeRollByName(tableName) {
	const table = game.tables?.getName(tableName);
	rolltableRequesterMakeRoll(table);
}

async function requestRollById(tid, { blind, description } = <any>{ blind: false, description: false }) {
	const tmplData = {
		name: "???",
		description: "",
		thumbnail: "icons/svg/d20-grey.svg",
		tid,
		system: game.system.id,
	};
	let table;
	if (!blind || description) {
		table = game.tables?.get(tid);
	}
	if (!blind) {
		table = game.tables?.get(tid);
		tmplData.name = table.name;
		tmplData.thumbnail = table.thumbnail;
	}
	if (description) {
		tmplData.description = table.description;
		if (
			typeof tmplData.description === "string" &&
			tmplData.description.length &&
			!tmplData.description.includes("<")
		) {
			const paras = tmplData.description
				.split(/\r?\n\r?\n/)
				.filter((x) => !!x.trim())
				.join("</p><p>");
			tmplData.description = `<p>${paras}</p>`;
		}
	}
	const myHtml = await renderTemplate(`${CONSTANTS.TEMPLATE_PATH}/request-card.html`, tmplData);
	const chatData = {
		user: game.user?.id,
		content: myHtml,
	};
	ChatMessage.create(chatData, {});
	return table;
}

async function requestRollByName(tableName, opts = { blind: false, description: false }) {
	const table = <any>game.tables?.getName(tableName);
	return await requestRollById(table.id, opts);
}

function cheekyWhisper(msg) {
	const chatMsg = {
		...msg,
		whisper: ChatMessage.getWhisperRecipients("GM"),
	};
	ChatMessage.create(chatMsg);
}
