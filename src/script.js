import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import "babylonjs-loaders";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);

const camera = new BABYLON.UniversalCamera(
  "camera",
  new BABYLON.Vector3(0, 0, 0),
  scene
);
camera.attachControl(canvas, true);
camera.inputs.remove(camera.inputs.attached.mousewheel);
camera.rotation.y = Math.PI;
camera.speed = 0.1;
camera.target.set(-0.2, 1.943, -1.39);
camera.position.set(-0.205, 2.791, -1.92);
camera.rotation.set((57.974 * Math.PI) / 180, (0.547 * Math.PI) / 180, 0);
camera.minZ = 0.01;

let light = new BABYLON.HemisphericLight(
  "light",
  new BABYLON.Vector3(0, 50, 0),
  scene
);

const table = BABYLON.SceneLoader.ImportMeshAsync(
  "",
  "assets/BlackJackTable.glb",
  "",
  scene,
  null
).then((container) => {
  tableRoot = container.meshes[0];
  tableRoot.name = "BlackJackTableRoot";
  cardHolder = tableRoot.getChildren()[0].getChildren()[0].getChildren();
  chipHolder = tableRoot.getChildren()[0].getChildren()[2].getChildren();
  dealerCards = tableRoot.getChildren()[0].getChildren()[4];
  // console.log(cardHolder);
  // console.log(chipHolder);
  // console.log(dealerCards);
  // console.log(cardHolder.getChildren());
});

engine.runRenderLoop(() => {
  scene.render();
});

window.onresize = () => {
  engine.resize();
};
