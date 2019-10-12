import { Component } from '@angular/core';
import * as list from './config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  public res = list.res;
  public title = this.res.title;  // 页面标题
  public isStart = true;   // 控制开始 结束按钮显示

  public length = this.res.list.length;
  public groupLength = Math.ceil(this.length / 2);
  private time: any;  // 定时器

  public resList = this.res.list;

  public UIList = [];

  constructor() {
    // 执行初始化操作
    this.UIList.push(this.resList.slice(0, this.groupLength ));
    this.UIList.push(this.resList.slice( this.groupLength));
  }

  /**
   * 开始抽奖
   */
  public start() {
    this.isStart = false;
    this.time = setInterval(() => {
      String.fromCharCode();
      this.resList = this.shuffle(this.res.list);
      this.UIList = [];
      this.UIList.push(this.resList.slice(0, this.groupLength));
      this.UIList.push(this.resList.slice(this.groupLength));
    }, 100);
  }

  /**
   * 随机数算法
   * @param arr 
   */
  shuffle(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
      var idx = Math.floor(Math.random() * (len - i));
      var temp = arr[idx];
      arr[idx] = arr[len - i - 1];
      arr[len - i - 1] = temp;
    }
    return arr;
  }

  groupNameByIndex(index: number) {
    return String.fromCharCode(65 + index);
  }

  /**
   * 结束
   */
  public stop() {
    clearInterval(this.time);
    this.isStart = true;
  }

}
