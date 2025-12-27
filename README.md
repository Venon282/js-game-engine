"# js-game-engine"

engine/
├── core/
│   ├── Engine.js               ✓
│   ├── GameLoop.js             ✓
│   ├── Time.js                 ✓
│   ├── SceneManager.js         ✓
│   ├── Scene.js                ✓
│   └── Config.js
│
├── ecs/
│   ├── World.js                ✓
│   ├── EntityManager.js        ✓
│   ├── ComponentManager.js     ✓
│   ├── SystemManager.js        ✓
│   ├── Query.js                ✓
│   ├── EventBus.js             ✓
│   └── index.js                ✓
│
├── components/
│   ├── Transform.js            ✓
│   ├── Velocity.js             ✓
│   ├── Sprite.js               ✓
│   ├── Camera.js               ✓
│   ├── Bounds.js               ✓
│   ├── Collider.js             ✓
│   ├── RigidBody.js            ✓
│   ├── Health.js
│   ├── AudioSource.js          ✓
│   ├── Animation.js            ✓
│   └── index.js
│
├── systems/
│   ├── MovementSystem.js       ✓
│   ├── RenderSystem.js         ✓
│   ├── CameraSystem.js         ✓
|   ├── CullingSystem.js        ✓
│   ├── CollisionSystem.js      ✓
│   ├── PhysicsSystem.js        ✓
│   ├── AnimationSystem.js      ✓
│   ├── AudioSystem.js          ✓
│   └── index.js
│
├── rendering/
│   ├── Renderer.js             ✓
│   ├── WebGLRenderer.js
│   ├── CanvasRenderer.js       ✓
│   ├── Shader.js               ✓
│   ├── Texture.js              ✓
│   └── SpriteBatch.js          ✓
│
├── physics/
│   ├── PhysicsWorld.js         ✓
│   ├── BroadPhase.js           ✓
│   ├── NarrowPhase.js          ✓
│   └── CollisionResolver.js    ✓
│
├── input/
│   ├── InputManager.js         ✓
│   ├── Keyboard.js
│   ├── Mouse.js
│   ├── Gamepad.js
│   └── Bindings.js
│
├── assets/
│   ├── AssetManager.js         ✓
│   ├── Loader.js               ✓
│   ├── ImageLoader.js          ✓
│   ├── AudioLoader.js          ✓
│   ├── FontLoader.js           ✓
│   └── Cache.js                ✓
│
├── audio/
│   ├── AudioManager.js         ✓
│   ├── Sound.js                ✓
│   └── Music.js                ✓
│
├── math/
│   ├── Vector2.js
│   ├── Vector3.js
│   ├── Matrix3.js
│   ├── Matrix4.js
│   ├── AABB.js
│   └── Utils.js
│
├── utils/
│   ├── EventEmitter.js
│   ├── Logger.js
│   ├── ObjectPool.js
│   ├── UID.js
│   ├── Assert.js
│   └── DeepClone.js
│
├── debug/
│   ├── DebugDraw.js            ✓
│   ├── Stats.js
│   ├── Inspector.js
│   └── Overlay.js
│
├── platform/
│   ├── Browser.js
│   ├── Mobile.js
│   └── Desktop.js
│
├── plugins/
│   └── PluginManager.js
│
├── index.js
└── version.js
