const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Node)
  machine = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  private block = false;

  private result = null;

  start(): void {
    this.machine.getComponent('Machine').createMachine();
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);

    // Allow the player to spin, the machine can't be spining
    if (this.machine.getComponent('Machine').spinning === false) {
      this.block = false;
      this.machine.getComponent('Machine').spin();
      this.requestResult();
    } else if (!this.block) {
      // Blocks interaction with the button for a time
      this.block = true;
      this.machine.getComponent('Machine').lock();
    }
  }

  async requestResult(): Promise<void> {
    this.result = null;
    this.result = await this.getAnswer();
  }

  // The result of the spin, with a match or a totally random order
  // With result, each reel must have a array with the number of each texture to show on the screen
  getAnswer(): Promise<Array<Array<number>>> {
    const slotResult = [[2,2,1],[2,2,1],[2,2,1],[2,2,1],[2,2,1]];
    return new Promise<Array<Array<number>>>(resolve => {
      setTimeout(() => {
        resolve(slotResult);
      }, 1000 + 500 * Math.random());
    });
  }

  informStop(): void {
    const resultRelayed = this.result;
    this.machine.getComponent('Machine').stop(resultRelayed);
  }

  // When the machine stops, check if a pattern os elements is true
  checkPattern(): void {
    let chance = Math.random();
  
    if(chance <= 0.07) {
      // all lines equal (7% chance)
      console.log("all lines equal (7% chance)");
    } else if(chance > 0.07 && chance <= 0.17) {
      // two lines equal (10% chance)
      console.log("two lines equal (10% chance)");
    } else if(chance > 0.17 && chance <= 0.5) {
      // one line equal (33% chance)
      console.log("one line equal (33% chance)");
    } else if(chance > 0.5 && chance <= 1) {
      // random set of animals (50% chance)
      console.log("random set of animals (50% chance)")
    }
  
    console.log("Result: " + chance);
  
  }
  
  // Play the glow animation when a pattern is set
  playPatternAnimation(): void {
  
  }
}
