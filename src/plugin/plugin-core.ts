import { Menu, Notice, Plugin, request, TAbstractFile, TFile, Workspace } from "obsidian";
import { ShowoffSettings } from "../models/showoff-settings";
import ConfirmationModal from "./confirmation-modal";
import { isMarkdown } from "../utils/file-utils";
import { ShowoffSettingsTab } from "./settings";

const DEFAULT_SETTINGS: ShowoffSettings = {
  host: "http://localhost:5000",
};

export default class PluginCore extends Plugin {
  settings: ShowoffSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new ShowoffSettingsTab(this.app, this));
    this.registerEvent(this.app.workspace.on("file-menu", this.addShareHandler));
  }

  async onunload() {
    this.app.workspace.off("file-menu", this.addShareHandler);
  }

  addShareHandler = (menu: Menu, file: TAbstractFile) => {
    if (!isMarkdown(file)) {
      return;
    }

    menu.addItem((item) => {
      item.setTitle("Share File").onClick(async () => {
        await this.onContextClickHandler(file);
      });
    });
  };

  onContextClickHandler = async (file: TAbstractFile) => {
    const confirmModal = new ConfirmationModal(this.app, this, {
      file,
      sendcallback: this.sendShareRequest,
    });

    confirmModal.open();
  };

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  private sendShareRequest = async (content: string) => {
    const body = JSON.stringify({
      message: content,
    });

	console.log(this);

    await request({
      url: `${this.settings.host}`,
      method: "POST",
      body: body,
    });
  }
}
