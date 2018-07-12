import { decorate, observable, action, computed } from "mobx";

class timerModel {
  timer = 60;

  constructor() {
    setInterval(() => {
      
      if(this.timer >= 0){
        this.timer -= 1;
      }
    }, 1000);
  }

  // @action.bound
  reset() {
    this.timer = 60;
  }
}

decorate(timerModel, {
    timer: observable,
    reset:action,
    // getAllData: computed
});

export default new timerModel();
