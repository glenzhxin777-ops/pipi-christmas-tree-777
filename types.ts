
export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface Wish {
  id: string;
  text: string;
  timestamp: number;
}

export interface ParticleData {
  scatterPos: [number, number, number];
  treePos: [number, number, number];
  color: string;
  size: number;
  rotationSpeed: number;
}
