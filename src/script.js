import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
import "babylonjs-loaders";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
scene.debugLayer.show();

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

const createXRExperience = async () => {
  const xr = await scene.createDefaultXRExperienceAsync();
  const webXRInput = await xr.input;
  // const featuresManager = xr.baseExperience.featuresManager;

  xr.baseExperience.camera.setTransformationFromNonVRCamera(camera);
  webXRInput.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      if (motionController.handness === "left") {
        controller.onMeshLoadedObservable.add((mesh) => {
          motionController.rootMesh = gunRoot;
        });
        const xr_ids = motionController.getComponentIds();
        let triggerComponent = motionController.getComponent(xr_ids[0]); //xr-standard-trigger
        triggerComponent.onButtonStateChangedObservable.add(() => {
          if (triggerComponent.pressed) {
            console.log("Trigger");
          }
        });
      }
      // if (
      //   motionController.handness === "left" ||
      //   motionController.handness === "right"
      // ) {
      //   const xr_ids = motionController.getComponentIds();
      //   for (let index = 0; index < xr_ids.length; index++) {
      //     let component = motionController.getComponent(xr_ids[index]);

      //     switch (xr_ids[index]) {
      //       case "xr-standard-trigger":
      //         component.onButtonStateChangedObservable.add(() => {
      //           if (component.pressed) {
      //             console.log(
      //               xr.pointerSelection.getMeshUnderPointer(controller.uniqueId)
      //             );
      //           }
      //         });
      //         break;
      //     }
      //   }
      // }
    });
  });
};
let RoomRoot, gunRoot;
const room = BABYLON.SceneLoader.ImportMeshAsync(
  "",
  "assets/SpaceStation.glb",
  "",
  scene,
  null
).then((container) => {
  RoomRoot = container.meshes[0];
  RoomRoot.name = "RoomRoot";

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
    gunRoot.rotation.x = (5 * Math.PI) / 12;
    gunRoot.scaling.set(0.5, 0.5, 0.5);

    gunRoot
      .getChildren()[0]
      .getChildren()
      .forEach((part) => {
        part.isPickable = false;
      });
    createXRExperience();
  });
});

engine.runRenderLoop(() => {
  scene.render();
});

window.onresize = () => {
  engine.resize();
};
