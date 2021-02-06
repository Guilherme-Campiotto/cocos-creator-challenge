const { ccclass, property } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
  @property({ type: [cc.SpriteFrame], visible: true })
  private textures = [];
  private groupNumbers = [];

  async onLoad(): Promise<void> {
    await this.loadTextures();
  }

  async resetInEditor(): Promise<void> {
    await this.loadTextures();
    this.setRandom();
  }

  // Load all animal squares
  async loadTextures(): Promise<boolean> {
    const self = this;
    return new Promise<boolean>(resolve => {
      cc.loader.loadResDir('gfx/Square', cc.SpriteFrame, function afterLoad(err, loadedTextures) {
        self.textures = loadedTextures;
        //console.log("Size of Textures: " + loadedTextures.length);
        resolve(true);
      });
    });
  }

  choseGroup(): void {
    let numberChosen;
    for(let i = 0; i < 5; i++) {
      numberChosen = Math.floor(Math.random() * (this.textures.length + 1));
      console.log(numberChosen);
      //this.groupNumbers.push(numberChosen);
    }
  }

  // Place animal square in the tile
  setTile(index: number): void {
    this.node.getComponent(cc.Sprite).spriteFrame = this.textures[index];
  }

  // Chose a random animal to show on tile
  setRandom(): void {
    const randomIndex = Math.floor(Math.random() * this.textures.length);
    this.setTile(randomIndex);
  }
}
