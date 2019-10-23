import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import * as list from './config';
import { DataTableModel, PersonModel, CaptainModel } from './type';
import * as path from 'path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // 人员配置文件
  // public configPath = path.join(__dirname, '/assets/config.json');
  public configPath = './assets/config.json';
  // public configPath = './dist/assets/config.json';



  /**新增人员对话框 */
  isVisible = false;

  /**是否启动编辑 */
  public isEdit = false;

  public res = list.res;
  public editCache: DataTableModel[] = [];

  public person: PersonModel = new PersonModel();

  public title: string = this.res.title;   // 页面标题
  public title_Temp = this.title; // 编辑时标题temp

  public isStart = true;   // 控制开始 结束按钮显示



  private time: any;  // 定时器


  public dataSet: PersonModel[] = this.res.list;
  /**分组数，默认为2组*/
  public groupNumber: number = 2;
  /**每组人数 */
  public groupLength = Math.ceil(this.dataSet.length / this.groupNumber);
  /**前端表格展示 */
  public UIList = [];

  constructor(
    public electronService: ElectronService,
  ) {



    if (electronService.isElectron) {
      console.log(process.env);
      // console.log('Mode electron');
      // console.log('Electron ipcRenderer', electronService.ipcRenderer);
      // console.log('NodeJS childProcess', electronService.childProcess);
      this.asyncReadFile(this.configPath);
    } else {
      console.log('Mode web');
      /**重构数据结构 */
      this.updateEditCache();

      // 执行初始化操作
      this.UIList = this.initUIList();
    }

  }


  async asyncReadFile(fileName: string) {
    const f1 = await this.electronService.readFile(fileName);
    this.res = JSON.parse(f1.toString());
    this.dataSet = this.res.list;
    this.title = this.res.title;   // 页面标题
    this.title_Temp = this.title; // 编辑时标题temp
    this.groupLength = Math.ceil(this.dataSet.length / this.groupNumber);
    // console.log(this.dataSet);

    /**重构数据结构 */
    this.updateEditCache();

    // 执行初始化操作
    this.UIList = this.initUIList();
  };

  /**
   * 开始抽奖
   */
  public start() {
    this.isStart = false;
    this.time = setInterval(() => {
      // String.fromCharCode();
      this.dataSet = this.shuffle(this.dataSet);
      this.resetByCaptain();
      this.UIList = this.initUIList();
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

  /**分组 编号 ABCD */
  groupNameByIndex(index: number) {
    return String.fromCharCode(65 + index);
  }

  groupNumberChange() {
    // 队长数组需要置空
    this.captain.length = 0;

    this.UIList = this.initUIList();
  }

  /**分组表格初始化 */
  initUIList() {
    this.groupLength = Math.ceil(this.dataSet.length / this.groupNumber);
    const UIList = [];
    for (let index = 0; index < this.groupNumber; index++) {
      UIList.push(this.dataSet.slice(index * this.groupLength, this.groupLength * (index + 1)));

    }
    return UIList;
  }

  /**
   * 结束
   */
  public stop() {
    clearInterval(this.time);
    this.isStart = true;
  }

  /**
   * 开始编辑
   */
  startAllEdit(){
    this.isEdit = true;
    this.dataSet = this.res.list;
  }

  /**
   * 保存编辑
   */
  async okEdit() {
    this.isEdit = false;

    this.title = this.title_Temp;

    // 更新配置文件里的数据
    this.res.list = this.arraySort(this.dataSet, 'team');
    this.res.title = this.title;

    // 将请假的人从dataSet中剔除
    this.dataSet = [];
    this.editCache.forEach(element => {
      if(!element.leave){
        this.dataSet.push(element.data);
      }
    });

    this.groupLength = Math.ceil(this.dataSet.length / this.groupNumber);
    this.UIList = this.initUIList();

    await this.electronService.writeFile(this.configPath, JSON.stringify(this.res));
    // 队长数组需要置空
    this.captain.length = 0;
  }

  arraySort(array, str) {
    array.sort(function (a, b) {
      return a[str].localeCompare(b[str]);
    });
    // console.log(array);
    return array;
  }

  /**
   * 取消编辑
   */
  public cancelEdit() {
    this.title_Temp = this.title;
    this.dataSet = this.res.list;
    this.editCache.length = 0;
    /**重构数据结构 */
    this.updateEditCache();

    // 执行初始化操作
    this.UIList = this.initUIList();
    this.isEdit = false;

  }

  /**
   * 表格 行开始编辑
   * @param id 
   */
  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }

  /**
    * 表格 行请假按钮
    * @param id 
    */
  leaveClick(id: number): void {
    this.editCache[id].leave = !this.editCache[id].leave;
  }
  /**
   * 表格 行取消编辑
   * @param id 
   */
  cancelTEdit(id: number): void {
    const index = this.dataSet.findIndex(item => item.index === id);
    this.editCache[id] = {
      data: { ...this.dataSet[index] },
      edit: false,
      leave: false
    };
  }

  /**
   * 表格 行保存编辑
   * @param id 
   */
  saveEdit(id: number): void {
    const index = this.dataSet.findIndex(item => item.index === id);
    Object.assign(this.dataSet[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  /**
   * 表格 删除行
   * @param id 
   * @param index 
   */
  deleteEdit(id: number, index: number): void {
    this.dataSet = this.dataSet.filter(d => d.index !== id);
    this.editCache.splice(index, 1);
  }

  /**
   * 表格 编辑 初始化修改数据结构
   */
  updateEditCache(): void {
    this.dataSet = this.arraySort(this.dataSet, 'team');
    this.dataSet.forEach((item, i) => {
      item.index = i;
      this.editCache[i] = {
        edit: false,
        leave: false,
        data: { ...item }
      };
    });
  }


  /** 新增人员 取消*/
  handleCancel() {
    this.isVisible = false;
    this.person = new PersonModel();
  }

  /** 新增人员 确定*/
  handleOk() {
    this.isVisible = false;
    // 增加数据
    const newPerson = {
      index: this.editCache.length,
      name: this.person.name,
      team: this.person.team,
    }
    this.dataSet = [...this.dataSet, newPerson];
    this.editCache.push({ data: newPerson, leave: false, edit: false });
    this.person = new PersonModel();
  }


  /**队长数组 */
  public captain: PersonModel[] = [];
  /**
   * 点击行 选择队长，重点标注
   * @param $event 选中的行
   * @param groupIndex 在第几组
   * @param itemIndex 组内第几号
   * @param data 选中人员信息
   */
  onSelectCaptainClick($event: any, groupIndex: number, itemIndex: number, data: PersonModel) {
    // console.log($event.target.nodeName);
    // console.log($event.target.parentNode);

    const { captain, groupNumber, dataSet, groupLength } = this;

    // 点击的行 在队长数组中的位置
    const captainIndex = captain.findIndex(item => {
      return item.index === data.index;
    });
    //如果点击的队长 已经在数组中，则为取消选中操作
    if (captainIndex !== -1) {
      captain[captainIndex] = new PersonModel();
    } else {
      // 查找第一个空的对象的队长index
      const emptyIndex = captain.findIndex(item => {
        return !item.index;
      });

      /**如果队长数组已经满了 */
      if (captain.length === groupNumber) {
        let index = groupIndex;
        if (captain[index].index && emptyIndex !== -1) {
          // 如果该队有队长了，并且队长数组中有空对象，则把数据附在空对象中
          index = emptyIndex;
        }
        captain[index] = data;
      } else {
        if (emptyIndex !== -1) {
          // 如果队长数组中存在空对象，则赋予第一个空对象
          captain[emptyIndex] = data;
        } else {
          /**加入新加入的队长 */
          captain.push(data);
        }
      }

    }

    this.resetByCaptain();
    this.UIList = this.initUIList();
  }

  /**
   * 根据队长数组，重排整个名单
   */
  resetByCaptain() {
    const { dataSet, captain, groupLength } = this;
    captain.forEach((element, index) => {
      if (element.index) {
        const tempIndex = dataSet.findIndex(item => (element.index === item.index));
        dataSet[tempIndex] = dataSet[index * groupLength];
        dataSet[index * groupLength] = element;
      }
    });
  }
}
