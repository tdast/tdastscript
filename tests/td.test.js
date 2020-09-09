import td from '../lib/td';

describe(td, () => {
  describe('edge cases', () => {
    it('creates root table node if empty or invalid type is provided', () => {
      expect(td()).toEqual({
        type: 'table',
        children: [],
      });
      expect(td('invalid type')).toEqual({
        type: 'table',
        children: [],
      });
    });
  });

  describe('cell', () => {
    it('creates cell node', () => {
      expect(td('cell')).toEqual({
        type: 'cell',
        value: undefined,
      });
      expect(td('cell', 'test')).toEqual({
        type: 'cell',
        value: 'test',
      });
      expect(td('cell', { value: 'test' })).toEqual({
        type: 'cell',
        value: 'test',
      });
    });

    it('creates cell node with whitelisted properties (data, position, value)', () => {
      expect(
        td('cell', {
          badProperty: 'badProperty',
          children: ['cell1', 'cell2'],
          data: { fieldA: 'valueA', fieldB: true },
          position: { start: {}, end: {} },
          value: 'test',
        }),
      ).toEqual({
        type: 'cell',
        data: { fieldA: 'valueA', fieldB: true },
        position: { start: {}, end: {} },
        value: 'test',
      });
    });
  });

  describe('column', () => {
    it('creates column node', () => {
      expect(td('column')).toEqual({
        type: 'column',
        value: undefined,
      });
      expect(td('column', 'test')).toEqual({
        type: 'column',
        value: 'test',
      });
      expect(td('column', { value: 'test' })).toEqual({
        type: 'column',
        value: 'test',
      });
    });

    it('creates column node with whitelisted properties (data, dataType, index, label, position, value)', () => {
      expect(
        td('column', {
          badProperty: 'badProperty',
          children: ['column1', 'column2'],
          data: { fieldA: 'valueA', fieldB: true },
          dataType: 'percentage',
          index: 5,
          label: 'Percentage',
          position: { start: {}, end: {} },
          value: 'test',
        }),
      ).toEqual({
        type: 'column',
        data: { fieldA: 'valueA', fieldB: true },
        dataType: 'percentage',
        index: 5,
        label: 'Percentage',
        position: { start: {}, end: {} },
        value: 'test',
      });
    });
  });

  describe('row', () => {
    it('creates row node with whitelisted properties (data, index, position)', () => {
      expect(
        td('row', {
          badProperty: 'badProperty',
          children: ['cell1', 'cell2'],
          data: { fieldA: 'valueA', fieldB: true },
          index: 5,
          position: { start: {}, end: {} },
          value: 'test',
        }),
      ).toEqual({
        type: 'row',
        data: { fieldA: 'valueA', fieldB: true },
        index: 5,
        position: { start: {}, end: {} },
        children: [],
      });
    });

    it('creates row node with valid cell/column children', () => {
      expect(td('row', ['cell1', 'cell2'])).toEqual({
        type: 'row',
        children: [
          { type: 'cell', columnIndex: 0, value: 'cell1' },
          { type: 'cell', columnIndex: 1, value: 'cell2' },
        ],
      });
      expect(
        td('row', [
          { type: 'cell', value: 'cell1' },
          { type: 'cell', value: 'cell2' },
        ]),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'cell', columnIndex: 0, value: 'cell1' },
          { type: 'cell', columnIndex: 1, value: 'cell2' },
        ],
      });
      expect(
        td('row', [
          { type: 'column', value: 'column1' },
          { type: 'column', value: 'column2' },
        ]),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'column', index: 0, value: 'column1' },
          { type: 'column', index: 1, value: 'column2' },
        ],
      });
      expect(
        td('row', [
          { type: 'invalid type' },
          'cell1',
          { type: 'cell', value: 'cell2' },
          { type: 'invalid type' },
          'c',
        ]),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'cell', columnIndex: 0, value: 'cell1' },
          { type: 'cell', columnIndex: 1, value: 'cell2' },
          { type: 'cell', columnIndex: 2, value: 'c' },
        ],
      });
    });
  });

  describe('table', () => {
    it('creates table node with whitelisted properties (data, position)', () => {
      expect(
        td('table', {
          badProperty: 'badProperty',
          children: ['row1', 'row2'],
          data: { fieldA: 'valueA', fieldB: true },
          position: { start: {}, end: {} },
          value: 'test',
        }),
      ).toEqual({
        type: 'table',
        data: { fieldA: 'valueA', fieldB: true },
        position: { start: {}, end: {} },
        children: [],
      });
    });

    it('creates table node with valid row children', () => {
      expect(td('table', ['row1', 'row2'])).toEqual({
        type: 'table',
        children: [],
      });
      expect(
        td('table', [
          { type: 'row', children: [] },
          { type: 'invalid type' },
          { type: 'row', children: ['cell1', 'cell2'] },
        ]),
      ).toEqual({
        type: 'table',
        children: [
          { type: 'row', index: 0, children: [] },
          {
            type: 'row',
            index: 1,
            children: [
              { type: 'cell', columnIndex: 0, rowIndex: 1, value: 'cell1' },
              { type: 'cell', columnIndex: 1, rowIndex: 1, value: 'cell2' },
            ],
          },
        ],
      });
    });
  });

  describe('is composible', () => {
    it('creates a valid tree', () => {
      const tdast = td('table', [
        td('row', [
          td('column', 'row0-column0'),
          td('column', 2),
          td('column', {
            value: 3,
            badProperty: 'badProperty',
            dataType: 'percentage',
            data: { fieldA: 'valueA', fieldB: true },
            label: 'Column 3',
            position: { start: {}, end: {} },
          }),
          td('column', null),
        ]),
        td('row', [
          'row1-cell0',
          2,
          td('cell', {
            value: 3,
            badProperty: 'badProperty',
            dataType: 'percentage',
            data: { fieldA: 'valueA', fieldB: true },
            label: 'Column 3',
            position: { start: {}, end: {} },
          }),
          null,
        ]),
        td(
          'row',
          {
            value: 3,
            badProperty: 'badProperty',
            dataType: 'percentage',
            data: { fieldA: 'valueA', fieldB: true },
            label: 'Column 3',
            position: { start: {}, end: {} },
          },
          ['row2-cell0', 2, 'row2-cell3', null],
        ),
      ]);
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
                value: 2,
              },
              {
                type: 'column',
                index: 2,
                value: 3,
                dataType: 'percentage',
                data: { fieldA: 'valueA', fieldB: true },
                label: 'Column 3',
                position: { start: {}, end: {} },
              },
              {
                type: 'column',
                index: 3,
                value: null,
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
                value: 2,
              },
              {
                type: 'cell',
                columnIndex: 2,
                rowIndex: 1,
                value: 3,
                data: { fieldA: 'valueA', fieldB: true },
                position: { start: {}, end: {} },
              },
              {
                type: 'cell',
                columnIndex: 3,
                rowIndex: 1,
                value: null,
              },
            ],
          },
          {
            type: 'row',
            index: 2,
            data: { fieldA: 'valueA', fieldB: true },
            position: { start: {}, end: {} },
            children: [
              {
                type: 'cell',
                columnIndex: 0,
                rowIndex: 2,
                value: 'row2-cell0',
              },
              {
                type: 'cell',
                columnIndex: 1,
                rowIndex: 2,
                value: 2,
              },
              {
                type: 'cell',
                columnIndex: 2,
                rowIndex: 2,
                value: 'row2-cell3',
              },
              {
                type: 'cell',
                columnIndex: 3,
                rowIndex: 2,
                value: null,
              },
            ],
          },
        ],
      });
    });
  });
});
