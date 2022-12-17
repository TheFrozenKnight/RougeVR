import * as BABYLON from "babylonjs";
import { decreaseEnemyCount } from "./Enemy";

let VrRay = [],
  VrRayHelper = [];
let laser,
  activeSpawnPoint = [];
export const SetupVrWeapon = (scene, SpawnPoint, count) => {
  VrRay[count] = new BABYLON.Ray();
  VrRayHelper[count] = new BABYLON.RayHelper(VrRay[count]);
  let dir = new BABYLON.Vector3(0, 0, 1);
  let rayOrigin = new BABYLON.Vector3.Zero();
  let length = 1000;

  activeSpawnPoint[count] = SpawnPoint;
  VrRayHelper[count].attachToMesh(SpawnPoint, dir, rayOrigin, length);
  VrRayHelper[count].show(scene);

  laser = new BABYLON.MeshBuilder.CreateCapsule("laser", {}, scene);
  laser.scaling.set(0.25, 0.25, 0.25);
};

export const PlayerShootVR = (scene, count) => {
  let pickedPoint = scene.pickWithRay(VrRay[count]);

  if (pickedPoint.hit) {
    // ShootAudio();

    let hitMesh = pickedPoint.pickedMesh;
    let hitPoint = pickedPoint.pickedPoint;

    if (hitMesh.name.includes("Enemy")) {
      //   GotHit(hitMesh);
      hitMesh.metadata.health -= 10;
      if (hitMesh.metadata.health <= 0) {
        console.log(hitMesh);
        hitMesh.dispose();
        decreaseEnemyCount(scene);
      }
    }

    /********** spawning bullets **********/
    let aimDir = hitPoint
      .subtract(activeSpawnPoint[count].getAbsolutePosition())
      .normalize();

    let laserPref = laser.createInstance("PlayerLaser");
    laserPref.isPickable = false;
    laserPref.position = activeSpawnPoint[count].getAbsolutePosition();
    //laserPref.rotation = activeSpawnPoint.rotation;
    laserPref.lookAt(hitPoint, 0, 0, 0);
    laserPref.rotation.x += Math.PI / 2;
    laserPref.checkCollisions = false;

    /********** spawning bullets **********/

    /********** shooting bullets **********/
    laserPref.physicsImpostor = new BABYLON.PhysicsImpostor(
      laserPref,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0.1, restitution: 0.5, friction: 0 },
      scene
    );
    laserPref.physicsImpostor.applyImpulse(
      aimDir.scale(5),
      activeSpawnPoint[count].getAbsolutePosition()
    );

    // let trailMesh = new BABYLON.TrailMesh(
    //   "BulletTrail",
    //   laserPref,
    //   scene,
    //   0.035,
    //   1,
    //   true
    // );
    // trailMesh.material = laserPref.material;

    window.setTimeout(function () {
      if (laserPref) {
        laserPref.dispose();
        // trailMesh.dispose();
      }
    }, 50);
    /********** shooting bullets **********/
  }
};
