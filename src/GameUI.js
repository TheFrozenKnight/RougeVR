import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";

export let CreateSkillMenu = function (scene) {
  let sphere = new BABYLON.MeshBuilder.CreateIcoSphere(
    "",
    { radius: 1 },
    scene
  );
  var mat = new BABYLON.StandardMaterial("mat", scene);
  sphere.material = mat;
  let manager = new GUI.GUI3DManager();
  let skillMenu = new GUI.PlanePanel("skillMenu");
  skillMenu.margin = 0.75;
  manager.addControl(skillMenu);
  skillMenu.scaling.set(0.3, 0.3, 0.3);
  let anchor = new BABYLON.TransformNode("");
  anchor.position.set(-1.575, 1.5, -1);
  anchor.rotation.y = Math.PI;
  anchor.rotation.x = Math.PI / 5;
  skillMenu.linkToTransformNode(anchor);
  addSkillMenuButtons(skillMenu, sphere);
};
let addSkillMenuButtons = function (menu, target) {
  let button1 = new GUI.HolographicButton();
  let button2 = new GUI.HolographicButton();
  let button3 = new GUI.HolographicButton();
  //   menu.blockLayout = true;
  menu.addControl(button1);
  menu.addControl(button2);
  menu.addControl(button3);

  button1.text = "Blue";
  button2.text = "Red";
  button3.text = "Green";

  button1.onPointerDownObservable.add(() => {
    target.material.diffuseColor = BABYLON.Color3.Blue();
  });
  button2.onPointerDownObservable.add(() => {
    target.material.diffuseColor = BABYLON.Color3.Red();
  });
  button3.onPointerDownObservable.add(() => {
    target.material.diffuseColor = BABYLON.Color3.Green();
  });
};
