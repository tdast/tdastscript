import { Cell, Column, Row, Table } from 'tdast-types';

/** tdastscript can return any valid tdast node. */
type Node = Cell | Column | Row | Table;

/** Node types of tdast nodes. */
type NodeType = 'cell' | 'column' | 'row' | 'table';

/** Child nodes can be actual nodes or string values representing Cell nodes */
type Children = Node[] | string[];

/** Node properties in object syntax */
type Properties = Record<string, any>;

/** Alias for loosely-typed value */
type Value = any;

/**
 * Creates a tdast node based on arguments
 **/
export default function td(
  /** Node type */
  type?: NodeType,
  /** Optional node properties */
  properties?: Properties,
  /** Children nodes (for Parent nodes) or value (for Literal nodes) */
  childrenOrValue?: Children | Value,
): Node;
