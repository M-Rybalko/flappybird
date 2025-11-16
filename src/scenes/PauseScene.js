import BaseScene from './BaseScene';

class PauseScene extends BaseScene {

  constructor(config) {
    super('PauseScene', config);

    this.menu = [
      {scene: 'PlayScene', text: 'Continue'},
      {scene: 'MenuScene', text: 'Exit'},
    ]
  }

  create = () => {
    this.add.rectangle(0, 0, this.config.width, this.config.height, 0x000000, 0.7).setOrigin(0)
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents = (menuItem) => {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on('pointerover', () => {
      textGO.setStyle({fill: '#ff0'});
    })

    textGO.on('pointerout', () => {
      textGO.setStyle({fill: '#fff'});
    })

    textGO.on('pointerup', () => {
      if (menuItem.scene && menuItem.text === 'Continue') {
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        this.scene.stop('PlayScene');
        this.scene.start(menuItem.scene);
      }
    })
  }
}

export default PauseScene;