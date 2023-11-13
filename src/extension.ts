import * as vscode from 'vscode';
import fs from 'node:fs';
import path from 'node:path';

export function activate(context: vscode.ExtensionContext) {
	if(vscode.workspace.workspaceFolders !== undefined) {
		let wf = vscode.workspace.workspaceFolders[0].uri.path;
		const infoPath = path.join(wf, `support${path.sep}info.json`);
		if (fs.existsSync(infoPath)){
			fs.watch(infoPath, (eventType, file) => {
				const compiling = JSON.parse(fs.readFileSync(infoPath, "utf-8"))["compiling"];
				if (!compiling){ 
					vscode.workspace.getConfiguration().update("files.watcherExclude", undefined, 2);
					vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer");
				}else{
					vscode.workspace.getConfiguration().update("files.watcherExclude", { "dist": true, "dist/**": true, "dist/**/*": true }, 2);
				}
			});
		}
	} 
}

// This method is called when your extension is deactivated
export function deactivate() {}
