import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  get isElectron() {
    return window && window.process && window.process.type;
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  /**
   * 读取配置文件
   * @param fileName 文件路径
   */
  readFile(fileName: string) {
    return new Promise(function (resolve, reject) {
      fs.readFile(fileName, function (error, data) {
        if (error) return reject(error);
        resolve(data);
      });
    });
  };


  writeFile(fileName: string, content: any) {
    console.log("准备写入文件:",fileName);
    return new Promise(function (resolve, reject) {
      fs.writeFile(fileName, content, function (error) {
        if (error) return reject(error);
        console.log("写入文件成功");
      });
    });
  }
}
