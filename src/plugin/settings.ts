import { App, PluginSettingTab, Setting } from "obsidian";
import ShowoffPlugin from "../../main";

export class ShowoffSettingsTab extends PluginSettingTab {
  plugin: ShowoffPlugin;

  constructor(app: App, plugin: ShowoffPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for the Showoff Plugin" });

    new Setting(containerEl)
      .setName("Host")
      .setDesc("Where are you hosting Show-off")
      .addText((text) => {
        text
          .setPlaceholder("https://localhost:5000")
          .setValue(this.plugin.settings.host)
          .onChange(async (value) => {
            this.plugin.settings.host = value;
            await this.plugin.saveSettings();
          });
      });
  }
}
