import { Cell, Column, Row, Table } from 'tdast-types';

/** tdastscript can return any valid tdast node. */
type Node = Cell | Column | Row | Table;

/** Node types of tdast nodes. */
type NodeType = 'cell' | 'column' | 'row' | 'table';

/** Child nodes can be actual nodes or string alias representing Cell nodes */
type Children = Node[] | string[];

/**
 * Creates a tdast node based on arguments
 **/
export default function td(
  /** Node type */
  arg1?: NodeType,
  /** Either an array of children, or map of properties or any value */
  arg2?: Children | Record<string, any> | any,
  /** Must be an array of children */
  arg3?: Children,
): Node;
