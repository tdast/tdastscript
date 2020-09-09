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

    it('creates cell node with whitelisted properties (data, position)', () => {
      expect(
        td('cell', {
          badProperty: 'a',
          children: ['a', 'b'],
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

    it('creates column node with whitelisted properties (data, dataType, index, label, position)', () => {
      expect(
        td('column', {
          badProperty: 'a',
          children: ['a', 'b'],
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
          badProperty: 'a',
          children: ['a', 'b'],
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
      expect(td('row', ['a', 'b'])).toEqual({
        type: 'row',
        children: [
          { type: 'cell', value: 'a' },
          { type: 'cell', value: 'b' },
        ],
      });
      expect(
        td('row', [
          { type: 'cell', value: 'a' },
          { type: 'cell', value: 'b' },
        ]),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'cell', value: 'a' },
          { type: 'cell', value: 'b' },
        ],
      });
      expect(
        td('row', [
          { type: 'column', value: 'a' },
          { type: 'column', value: 'b' },
        ]),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'column', index: 0, value: 'a' },
          { type: 'column', index: 1, value: 'b' },
        ],
      });
      expect(
        td('row', [
          { type: 'invalid type' },
          'a',
          { type: 'cell', value: 'b' },
          { type: 'invalid type' },
          'c',
        ]),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'cell', value: 'a' },
          { type: 'cell', value: 'b' },
          { type: 'cell', value: 'c' },
        ],
      });
    });
  });

  describe('table', () => {
    it('creates table node with whitelisted properties (data, position)', () => {
      expect(
        td('table', {
          badProperty: 'a',
          children: ['a', 'b'],
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
      expect(td('table', ['a', 'b'])).toEqual({
        type: 'table',
        children: [],
      });
      expect(
        td('table', [
          { type: 'row', children: [] },
          { type: 'invalid type' },
          { type: 'row', children: ['a', 'b'] },
        ]),
      ).toEqual({
        type: 'table',
        children: [
          { type: 'row', index: 0, children: [] },
          {
            type: 'row',
            index: 1,
            children: [
              { type: 'cell', value: 'a' },
              { type: 'cell', value: 'b' },
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
            badProperty: 'a',
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
            badProperty: 'a',
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
            badProperty: 'a',
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
                value: 'row1-cell0',
              },
              {
                type: 'cell',
                value: 2,
              },
              {
                type: 'cell',
                value: 3,
                data: { fieldA: 'valueA', fieldB: true },
                position: { start: {}, end: {} },
              },
              {
                type: 'cell',
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
                value: 'row2-cell0',
              },
              {
                type: 'cell',
                value: 2,
              },
              {
                type: 'cell',
                value: 'row2-cell3',
              },
              {
                type: 'cell',
                value: null,
              },
            ],
          },
        ],
      });
    });
  });
});
