import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public lucky = '幸运儿';  // 页面显示结果
  public isStart = true;   // 控制开始 结束按钮显示

  private list = ['叶孟', '钟鑫火', '温宇强', '叶孟2', '钟鑫火2', '温宇强2', '叶孟3', '钟鑫火3', '温宇强3'];
  private length = this.list.length;
  private time: any;  // 定时器

  /**
   * 开始抽奖
   */
  public start() {
    this.isStart = false;
    this.time = setInterval(() => {
      const index = Math.floor(Math.random() * this.length);
      this.lucky = this.list[index];
    }, 100);
  }

  /**
   * 结束
   */
  public stop() {
    clearInterval(this.time);
    this.isStart = true;
  }

}
