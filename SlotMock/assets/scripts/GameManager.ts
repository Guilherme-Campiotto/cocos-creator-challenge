const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Node)
  machine = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  private block = false;

  private result = null;

  private animationPattern = [];

  private informedResult = true;

  start(): void {
    this.machine.getComponent('Machine').createMachine();
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }

    // Check when the machine stops moving to show sprites glowing when there is a pattern
    if(this.machine.getComponent('Machine').spinning === false && !this.informedResult) {
      this.playPatternAnimation();
    }
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);

    // Let the player click to spin, the reels can't be spinning already
    if (this.machine.getComponent('Machine').spinning === false) {
      this.stopPatternAnimation();
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
  // With a result, each reel must have a array with the number of each texture to show on the screen
  getAnswer(): Promise<Array<Array<number>>> {
    const slotResult = this.checkPattern();
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

  // When the machine stops, get a random number and check the chances of each pattern 
  // The animationPattern marks what object needs to glow in the lines that are formed
  checkPattern(): Array<Array<number>> {
    let chance = Math.random() * 100;
    let result = [];
  
    if(chance <= 7) {
      // all lines equal (7% chance)
      let sprite = this.choseRandomSprite();
      result = [
        [sprite, sprite, sprite], 
        [sprite, sprite, sprite], 
        [sprite, sprite, sprite],
        [sprite, sprite, sprite],
        [sprite, sprite, sprite]];
      this.animationPattern = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9 , 10, 11, 12, 13 ,14];
    } else if(chance > 7 && chance <= 17) {
      // two lines equal (10% chance)
      let sprite = this.choseRandomSprite();
      result = [
        [sprite, sprite, this.choseRandomSprite()], 
        [sprite, sprite, this.choseRandomSprite()], 
        [sprite, sprite, this.choseRandomSprite()],
        [sprite, sprite, this.choseRandomSprite()],
        [sprite, sprite, this.choseRandomSprite()]
      ];
      this.animationPattern = [0, 1, 3, 4, 6, 7, 9, 10, 12, 13];
    } else if(chance > 17 && chance <= 50) {
      let sprite = this.choseRandomSprite();
      result = [
        [sprite, this.choseRandomSprite(), this.choseRandomSprite()], 
        [sprite, this.choseRandomSprite(), this.choseRandomSprite()], 
        [sprite, this.choseRandomSprite(), this.choseRandomSprite()],
        [sprite, this.choseRandomSprite(), this.choseRandomSprite()],
        [sprite, this.choseRandomSprite(), this.choseRandomSprite()],
      ];
      this.animationPattern = [0, 3, 6, 9, 12];
    } else if(chance > 50 && chance <= 100) {
      // random set of sprites (50% chance)
      this.animationPattern = [];
      result = [];
      return result;
    }
  
    return result;
  }

  // Picks a sprite number randomly, from 0 to 29 (the number of sprites in the folder "Square")
  choseRandomSprite(): number {
    let spriteNumber = Math.floor(Math.random() * 29);
    return spriteNumber;
  }

  // Play the glow animation when a pattern is met
  playPatternAnimation(): void {
    this.informedResult = true;
    for (let i = 0; i < this.animationPattern.length; i += 1) {
      let glow = cc.find("GlowNodes/Glow" + this.animationPattern[i]);
      glow.getComponent("Glow").active();
    }
  }

  // Stops all the animations of glowing
  stopPatternAnimation(): void {
    this.informedResult = false;
    for (let i = 0; i < this.animationPattern.length; i += 1) {
      let glow = cc.find("GlowNodes/Glow" + this.animationPattern[i]);
      glow.getComponent("Glow").inactive();
    }
  }
}
