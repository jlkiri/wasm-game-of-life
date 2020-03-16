/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Cell {
  Dead,
  Alive,
}
export class Universe {
  free(): void;
/**
*/
  tick(): void;
/**
* @param {number} width 
* @param {number} height 
* @returns {Universe} 
*/
  static new(width: number, height: number): Universe;
/**
* @returns {number} 
*/
  width(): number;
/**
* Set the width of the universe.
*
* Resets all cells to the dead state.
* @param {number} width 
*/
  set_width(width: number): void;
/**
* @returns {number} 
*/
  height(): number;
/**
* Set the height of the universe.
*
* Resets all cells to the dead state.
* @param {number} height 
*/
  set_height(height: number): void;
/**
* @returns {number} 
*/
  cells(): number;
/**
* @param {number} row 
* @param {number} column 
*/
  toggle_cell(row: number, column: number): void;
}
