import { App, Modal, Setting, TAbstractFile, TFile } from "obsidian";
import ShowoffPlugin from "../../main";

type ConfirmationModalProps = {
  file: TAbstractFile;
  sendcallback: (content: string) => Promise<void>;
};

export default class ConfirmationModal extends Modal {
  private props: ConfirmationModalProps;

  constructor(app: App, plugin: ShowoffPlugin, props: ConfirmationModalProps) {
    super(app);
    this.props = props;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: `Share ${this.props.file.name}?` });

    new Setting(contentEl)
      .addButton((btn) => {
        btn.setButtonText("Share").onClick(async () => {
          const content = await this.app.vault.read(this.props.file as TFile);
          await this.props.sendcallback(content);
          this.close();
        });
      })
      .addButton((btn) => {
        btn.setButtonText("Cancel").onClick(() => {
          this.close();
        });
      });
  }

  onClose() {
    this.contentEl.empty();
    this.props = null;
  }
}
