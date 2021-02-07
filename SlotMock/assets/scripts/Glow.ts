const {ccclass, property} = cc._decorator;

@ccclass
export default class Glow extends cc.Component {

    // Show the animation
    active(): void {
        this.node.opacity = 150;
    }

    // Hides animation with a opacity of 0
    inactive(): void {
        this.node.opacity = 0;
    }

}
