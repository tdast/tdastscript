# tdastscript

utility to create [**tdast**][tdast] trees.

---

## Install

```sh
npm install tdastscript
```


## Use

```js
import td from 'tdastscript';

const tdast = td('table', [
  td('row', [
    td('column', 'row0-column0'),
    td('column', 'row0-column1'),
    td('column', {
      value: 'row0-column3',
      badProperty: 'badProperty',
      dataType: 'percentage',
      data: { fieldA: 'valueA', fieldB: true },
      label: 'Column 3',
    }),
  ]),
  td('row', [
    'row1-cell0',
    'row1-cell1',
    'row1-cell2',
  ]),
]);
```

yields the following tree:

```js
expect(tdast).toEqual({
  type: 'table',
  children: [
    {
      type: 'row',
      index: 0,
      children: [
        {
          type: 'column',
          index: 0,
          value: 'row0-column0',
        },
        {
          type: 'column',
          index: 1,
          value: 'row0-column1',
        },
        {
          type: 'column',
          index: 2,
          value: 'row0-column2',
        },
      ],
    },
    {
      type: 'row',
      index: 1,
      children: [
        {
          type: 'cell',
          columnIndex: 0,
          rowIndex: 1,
          value: 'row1-cell0',
        },
        {
          type: 'cell',
          columnIndex: 1,
          rowIndex: 1,
          value: 'row1-cell1',
        },
        {
          type: 'cell',
          columnIndex: 2,
          rowIndex: 1,
          value: 'row1-cell2',
        },
      ],
    },
  ],
});
```

## API

### `td(type[, props][, children|value])`
#### Interface
```ts
function td(
  /** Node type */
  type?: NodeType,
  /** Optional node properties */
  properties?: Properties,
  /** Children nodes (for Parent nodes) or value (for Literal nodes) */
  childrenOrValue?: Children | Value,
): Node;
```

Returns a tdast `Node` (i.e. `Cell`, `Column`, `Row`, `Table`) with associated `properties`, `children` or `value` based on how it is called.

`tdastscript` conveniently assigns row/column indices on `Row`, `Column`, `Cell` nodes, based on how it is composed.

`tdastscript` can be used in a composable way, as shown in the opening example.  See the following examples below for details on usage and behaviors.

#### Examples

Use without optional arguments to create simple nodes.

```js
expect(td('table')).toEqual({
  type: 'table',
  children: [],
});
expect(td('row')).toEqual({
  type: 'row',
  children: [],
});
expect(td('cell')).toEqual({
  type: 'cell',
  value: undefined,
});
expect(td('column')).toEqual({
  type: 'column',
  value: undefined,
});
```

For **Literal** nodes, such as `Cell` and `Column`, if the `properties` argument is skipped and only the `value` argument is provided, create the nodes:

```js
expect(td('cell', 'cell1')).toEqual({
  type: 'cell',
  value: 'cell1',
});

expect(td('column', 'column1')).toEqual({
  type: 'column',
  value: 'column1',
});
```

For **Parent** nodes, such as `Table` and `Row`, if the `properties` argument is skipped and only the `children` argument is provided, create the child nodes:

```js
expect(td('table', [
  { type: 'row', children: [] },
  { type: 'row', children: [] },
])).toEqual({
  type: 'table',
  children: [
    { type: 'row', children: [] },
    { type: 'row', children: [] },
  ],
});

expect(td('row', [
  { type: 'cell', value: 'cell1' },
  'cell2', // accepts value literal shorthand to create Cell nodes
])).toEqual({
  type: 'row',
  children: [
    { type: 'cell', value: 'cell1' },
    { type: 'cell', value: 'cell2' },
  ],
});
```

If the `properties` argument is not skipped, attach the properties to the specified nodes.  Note that `tdastscript` will only attach properties specified by the node's interface.  Refer to the formal [type definitions][type-definitions] for details.

```js
expect(td('table', { 
  data: { badProperty: 'badProperty', fieldA: 'valueA' },
  position: UnistPosition,
})).toEqual({
  type: 'table',
  data: { fieldA: 'valueA' },
  position: UnistPosition,
});

expect(td('row', { 
  data: { badProperty: 'badProperty', fieldA: 'valueA' },
  index: 5,
  position: UnistPosition,
}), [
  'cell1',
  'cell2',
]).toEqual({
  type: 'row',
  data: { fieldA: 'valueA' },
  index: 5,
  position: UnistPosition,
  children: [
    { type: 'cell', value: 'cell1' },
    { type: 'cell', value: 'cell2' },
  ],
});
```

#### Related interfaces
```ts
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
```

<!-- Definitions -->
[tdast]: https://github.com/tdast/tdast
[type-definitions]: https://github.com/tdast/tdast-types
