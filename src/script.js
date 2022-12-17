import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { enemysCreator } from "./Enemy";
import { CreateSkillMenu } from "./GameUI";
import { PlayerShootVR, SetupVrWeapon } from "./Weapons";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
scene.debugLayer.show();

scene.enablePhysics(new BABYLON.Vector3.Zero());

const camera = new BABYLON.UniversalCamera(
  "camera",
  new BABYLON.Vector3(0, 1.8, 0),
  scene
);
camera.attachControl(canvas, true);
camera.inputs.remove(camera.inputs.attached.mousewheel);
camera.rotation.y = Math.PI;
// camera.speed = 0.1;
// camera.target.set(-0.2, 1.943, -1.39);
// camera.position.set(-0.205, 2.791, -1.92);
// camera.rotation.set((57.974 * Math.PI) / 180, (0.547 * Math.PI) / 180, 0);
camera.minZ = 0.01;

let light = new BABYLON.HemisphericLight(
  "light",
  new BABYLON.Vector3(0, 50, 0),
  scene
);

let RoomRoot, gunRoot, gunMat;

const room = BABYLON.SceneLoader.ImportMeshAsync(
  "",
  "assets/SpaceStation.glb",
  "",
  scene,
  null
).then((container) => {
  RoomRoot = container.meshes[0];
  RoomRoot.name = "RoomRoot";
  // BABYLON.SceneLoader.LoadAssetContainerAsync(
  //   "",
  //   "assets/Gun.glb",
  //   scene,
  //   null
  // ).then((gun) => {
  //   gunRoot = gun;
  //   gun.meshes[0].name = "gunRoot";
  //   gun.meshes[0].rotationQuaternion = null;
  //   gun.meshes[0].rotation.x = Math.PI / 4;
  //   gun.meshes[0].scaling.set(0.45, 0.45, 0.45);
  //   gun.meshes[0].getChildren()[0].isPickable = false;
  //   createXRExperience();
  // });
});

const gun = BABYLON.SceneLoader.ImportMeshAsync(
  "",
  "assets/Gun.glb",
  "",
  scene,
  null
).then((container) => {
  gunRoot = container.meshes[0];
  gunRoot.name = "gunRoot";
  gunRoot.rotationQuaternion = null;
  gunRoot.rotation.x = Math.PI / 4;
  gunRoot.scaling.set(0.45, 0.45, 0.45);
  let a = gunRoot.getChildren()[0];
  gunMat = a.material;
  // a.isPickable = false;
  createXRExperience();
});

export let playerCollider = new BABYLON.MeshBuilder.CreateBox(
  "playerCollider",
  scene
);
playerCollider.scaling.set(0.5, 0.5, 0.5);
playerCollider.collision = true;

let leftmotionController, rightmotionController;
const createXRExperience = async () => {
  const xr = await scene.createDefaultXRExperienceAsync();
  const webXRInput = await xr.input;

  xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
    playerCollider.parent = xr.baseExperience.camera;
  });

  CreateSkillMenu(scene);

  xr.baseExperience.camera.setTransformationFromNonVRCamera(camera);
  webXRInput.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      if (motionController.handness === "right") {
        rightmotionController = motionController;

        controller.onMeshLoadedObservable.add((mesh) => {
          let NewGun = gunRoot.clone();
          NewGun.getChildren()[0].material = gunMat.clone();
          motionController.rootMesh = NewGun;
          SetupVrWeapon(scene, NewGun.getChildren()[0].getChildren()[0], 0);

          // console.log(NewGun.getChildren()[0].getChildren()[0]);
        });

        const xr_ids = motionController.getComponentIds();
        let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
        triggerComponent.onButtonStateChangedObservable.add(() => {
          if (triggerComponent.pressed) {
            PlayerShootVR(scene, 0);
            console.log("Trigger");
          }
        });
      }

      if (motionController.handedness === "left") {
        leftmotionController = motionController;

        controller.onMeshLoadedObservable.add((mesh) => {
          let NewGun = gunRoot.clone();
          NewGun.getChildren()[0].material = gunMat.clone();
          motionController.rootMesh = NewGun;
          SetupVrWeapon(scene, NewGun.getChildren()[0].getChildren()[0], 1);
          enemysCreator();
          // console.log(NewGun.getChildren()[0].getChildren()[0]);
        });

        const xr_ids = motionController.getComponentIds();
        let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
        triggerComponent.onButtonStateChangedObservable.add(() => {
          if (triggerComponent.pressed) {
            PlayerShootVR(scene, 1);
            console.log("Trigger");
          }
        });
      }
    });
  });
};

engine.runRenderLoop(() => {
  scene.render();
});

window.onresize = () => {
  engine.resize();
};
