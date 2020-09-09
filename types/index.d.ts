import { Cell, Column, Row, Table } from 'tdast-types';

/** tdastscript can return any valid tdast node. */
type Node = Cell | Column | Row | Table;

/** Node types of tdast nodes. */
type NodeType = 'cell' | 'column' | 'row' | 'table';

/** Child nodes can be actual nodes or string alias representing Cell nodes */
type Children = Node[] | string[];

type Properties = Record<string, any>;

type Value = any;

/**
 * Creates a tdast node based on arguments
 **/
export default function td(
  /** Node type */
  arg1?: NodeType,
  /** Accept either children, properties, or value */
  arg2?: Children | Properties | Value,
  /** Children nodes */
  arg3?: Children,
): Node;
