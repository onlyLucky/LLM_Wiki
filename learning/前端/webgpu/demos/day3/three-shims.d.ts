// three 0.186.0 未随包发布类型声明（官方 build/*.js 无 .d.ts，工程依赖也未装 @types/three），
// Day 3 各 demo 以「宽松 any 级」环境声明接入，保证 tsc --noEmit 通过。
// 环境声明是全局的：本文件对 tsconfig include 的全部目录生效，
// 其他 Day 3 demo / 作业无需重复声明；如需更严格的类型请整体替换本文件，
// 不要在别的目录再写一份不同内容的同名声明（会产生重复标识符冲突）。
declare module 'three/webgpu' {
  export class WebGPURenderer {
    constructor(parameters?: any);
    [key: string]: any;
  }
  export class RenderPipeline {
    constructor(renderer?: any, outputNode?: any);
    [key: string]: any;
  }
  export class PostProcessing {
    constructor(renderer?: any, outputNode?: any);
    [key: string]: any;
  }
  export class Scene {
    constructor();
    [key: string]: any;
  }
  export class Group {
    constructor();
    [key: string]: any;
  }
  export class PerspectiveCamera {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class Mesh {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class InstancedMesh {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class Sprite {
    constructor(material?: any);
    [key: string]: any;
  }
  export class Points {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class Raycaster {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class BufferGeometry {
    constructor();
    [key: string]: any;
  }
  export class PlaneGeometry {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class SphereGeometry {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class TorusGeometry {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class BoxGeometry {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class Vector2 {
    constructor(x?: any, y?: any);
    [key: string]: any;
  }
  export class Vector3 {
    constructor(x?: any, y?: any, z?: any);
    [key: string]: any;
  }
  export class Color {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class Plane {
    constructor(normal?: any, constant?: any);
    [key: string]: any;
  }
  export class AmbientLight {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class DirectionalLight {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class PointLight {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class InstancedBufferAttribute {
    constructor(array: any, itemSize: any);
    [key: string]: any;
  }
  export class StorageInstancedBufferAttribute {
    constructor(arrayOrCount: any, itemSize?: any);
    [key: string]: any;
  }
  export class NodeMaterial {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class MeshBasicNodeMaterial {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class MeshStandardNodeMaterial {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class MeshPhysicalNodeMaterial {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class SpriteNodeMaterial {
    constructor(...args: any[]);
    [key: string]: any;
  }
  export class PointsNodeMaterial {
    constructor(...args: any[]);
    [key: string]: any;
  }
  // 渲染器/材质属性用的枚举常量（toneMapping / setHex 的 colorSpace / blending / side）
  export const ACESFilmicToneMapping: any;
  export const LinearSRGBColorSpace: any;
  export const AdditiveBlending: any;
  export const DoubleSide: any;
}

declare module 'three/tsl' {
  export const Fn: any;
  export const If: any;
  export const Loop: any;
  export const storage: any;
  export const instancedArray: any;
  export const instanceIndex: any;
  export const uniform: any;
  export const time: any;
  export const deltaTime: any;
  export const vec2: any;
  export const vec3: any;
  export const vec4: any;
  export const float: any;
  export const int: any;
  export const uint: any;
  export const color: any;
  export const uv: any;
  export const positionLocal: any;
  export const positionWorld: any;
  export const positionGeometry: any;
  export const normalLocal: any;
  export const normalWorld: any;
  export const attribute: any;
  export const texture: any;
  export const pass: any;
  export const hash: any;
  export const mx_noise_float: any;
  export const shapeCircle: any;
  export const screenUV: any;
  export const mix: any;
  export const select: any;
  export const smoothstep: any;
  export const clamp: any;
  export const min: any;
  export const max: any;
  export const abs: any;
  export const exp: any;
  export const pow: any;
  export const sin: any;
  export const cos: any;
  export const length: any;
  export const sqrt: any;
  export const step: any;
  export const mul: any;
  export const add: any;
  export const sub: any;
  export const varying: any;
}

declare module 'three/addons/tsl/display/BloomNode.js' {
  export const bloom: any;
}
