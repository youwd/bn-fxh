import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public lucky = '幸运儿';  // 页面显示结果
  public isStart = true;   // 控制开始 结束按钮显示

  private list = ['蔡威威', '曾培林', '曾智成', '陈国军', '陈惠勇', '陈扬帆', '迟海', '邓永明',
    '丁俊杰', '管信太', '郭振强', '何玮婷', '黄仙龙', '胡东阳', '柯肇丰', '寇海燕', '蓝锦玉', '林燕辉',
    '刘少勇', 'Louis', 'NICKO', '王翠莲', '王福厚', '王悦', '翁茂春', '温宇强', '吴胜杰',
    '吴祖贤', '肖雨薇', '谢彪飞', '许勇滨', '杨税令', '叶孟', '游伟东', '郑启辰', '钟鑫火'];
  private length = this.list.length;
  private time: any;  // 定时器

  /**
   * 开始抽奖
   */
  public start() {
    this.isStart = false;
    this.time = setInterval(() => {
      const index = Math.floor(Math.random() * this.length);
      // console.log(index);
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
