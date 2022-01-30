import { TAbstractFile } from "obsidian";
import { extname } from "path";

export function isMarkdown(item: TAbstractFile) {
  return extname(item.path) === ".md";
}
