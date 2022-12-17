import * as BABYLON from "babylonjs";
import { playerCollider } from "./script";

let enemyList = [];
export let enemyCount = 0;
let localPlayer,
  fireDelay = 1000;
let laser;

export const enemysCreator = (scene) => {
  //   let enemy = new BABYLON.TransformNode("EnemyParent", scene);
  let shape1 = new BABYLON.MeshBuilder.CreatePolyhedron(
    "Enemy1",
    { type: 1 },
    scene
  );
  let shape2 = new BABYLON.MeshBuilder.CreatePolyhedron(
    "Enemy2",
    { type: 2 },
    scene
  );
  let shape3 = new BABYLON.MeshBuilder.CreatePolyhedron(
    "Enemy3",
    { type: 4 },
    scene
  );
  let shape4 = new BABYLON.MeshBuilder.CreatePolyhedron(
    "Enemy4",
    { type: 11 },
    scene
  );
  let shape5 = new BABYLON.MeshBuilder.CreatePolyhedron(
    "Enemy5",
    { type: 12 },
    scene
  );

  enemyList = [shape1, shape2, shape3, shape4, shape5];
  enemyList.forEach((Element) => {
    Element.position.y = 1000;
  });

  localPlayer = playerCollider;
  laser = new BABYLON.MeshBuilder.CreateCapsule("laser", {}, scene);
  laser.scaling.set(0.25, 0.25, 0.25);

  instantiateEnemy(scene);
};

const instantiateEnemy = (scene) => {
  for (let i = 0; i < enemyList.length; i++) {
    let enemyTemp = enemyList[i].createInstance("Enemy" + i);
    enemyCount++;
    enemyTemp.metadata = { health: 10 };
    enemyTemp.position.x = 5 - 5 * Math.random() - i;
    enemyTemp.position.z = -10 + i;
    enemyTemp.position.y = 2 + 5 * Math.random();
    EnemyShoot(enemyTemp, scene);
  }
};

export const EnemyShoot = (enemy, scene) => {
  if (enemy != null && enemy.metadata.health) {
    setTimeout(() => {
      fireBullet(enemy, scene);
      EnemyShoot(enemy);
    }, fireDelay);
  }
};

export const fireBullet = (enemy, currScene) => {
  /********** spawning bullets **********/
  let aimDir = localPlayer
    .getAbsolutePosition()
    .subtract(enemy.getAbsolutePosition())
    .normalize();

  let laserPref = laser.createInstance("Enemy_laser");
  // console.log(laserPref);
  laserPref.isPickable = false;
  laserPref.position = enemy.getAbsolutePosition();
  //laserPref.rotation = activeSpawnPoint.rotation;
  laserPref.lookAt(localPlayer.getAbsolutePosition(), 0, 0, 0);
  laserPref.rotation.x += Math.PI / 2;
  laserPref.checkCollisions = false;
  /********** spawning bullets **********/

  /********** shooting bullets **********/
  laserPref.physicsImpostor = new BABYLON.PhysicsImpostor(
    laserPref,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0.01, restitution: 0.5, friction: 0 },
    currScene
  );
  laserPref.physicsImpostor.applyImpulse(
    aimDir.scale(0.05),
    enemy.getAbsolutePosition()
  );
  // let trailMesh = new BABYLON.TrailMesh(
  //   "BulletTrail",
  //   laserPref,
  //   currScene,
  //   0.035,
  //   1,
  //   true
  // );
  // trailMesh.material = laserPref.material;

  laserPref.actionManager = new BABYLON.ActionManager(currScene);
  laserPref.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      {
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
        parameter: localPlayer,
      },
      () => {
        let damageAmount = Math.floor(Math.random() * 4) + 4;
        console.log("player hit:  " + damageAmount);
        // UpdateHealth(-damageAmount);
      }
    )
  );

  window.setTimeout(function () {
    if (laserPref) {
      laserPref.dispose();
      // trailMesh.dispose();
    }
  }, 5000);
  /********** shooting bullets **********/
};

export const decreaseEnemyCount = (scene) => {
  enemyCount--;
  if (enemyCount <= 0) instantiateEnemy(scene);
};
