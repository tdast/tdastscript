import { cell, column, row, table } from '../lib/node';

describe('node', () => {
  describe(cell, () => {
    it('should create cell nodes with the correct values', () => {
      expect(cell('value1')).toEqual({
        type: 'cell',
        value: 'value1',
      });
      expect(cell(null)).toEqual({
        type: 'cell',
        value: null,
      });
      expect(cell([1, 'two', true, false])).toEqual({
        type: 'cell',
        value: [1, 'two', true, false],
      });
    });

    it('should create cell nodes with only whitelisted properties (data, position)', () => {
      expect(
        cell('value1', {
          badProperty: 'a',
          children: ['a', 'b'],
          data: { fieldA: 'valueA', fieldB: true },
          position: { start: {}, end: {} },
        }),
      ).toEqual({
        type: 'cell',
        data: { fieldA: 'valueA', fieldB: true },
        position: { start: {}, end: {} },
        value: 'value1',
      });
    });
  });

  describe(column, () => {
    it('should create column nodes with the correct values', () => {
      expect(column('value1')).toEqual({
        type: 'column',
        value: 'value1',
      });
      expect(column(null)).toEqual({
        type: 'column',
        value: null,
      });
      expect(column([1, 'two', true, false])).toEqual({
        type: 'column',
        value: [1, 'two', true, false],
      });
    });

    it('should create column nodes with only whitelisted properties (data, dataType, index, label, position)', () => {
      expect(
        column('value1', {
          badProperty: 'a',
          children: ['a', 'b'],
          data: { fieldA: 'valueA', fieldB: true },
          dataType: 'percentage',
          index: 5,
          label: 'Percentage',
          position: { start: {}, end: {} },
        }),
      ).toEqual({
        type: 'column',
        data: { fieldA: 'valueA', fieldB: true },
        dataType: 'percentage',
        index: 5,
        label: 'Percentage',
        position: { start: {}, end: {} },
        value: 'value1',
      });
    });
  });

  describe(row, () => {
    it('should create row nodes with no arguments', () => {
      expect(row()).toEqual({
        type: 'row',
        children: [],
      });
    });

    it('should create row nodes with only whitelisted properties (data, index, position)', () => {
      expect(
        row({
          badProperty: 'a',
          children: ['a', 'b'],
          data: { fieldA: 'valueA', fieldB: true },
          dataType: 'percentage',
          index: 5,
          label: 'Percentage',
          position: { start: {}, end: {} },
        }),
      ).toEqual({
        type: 'row',
        children: [],
        data: { fieldA: 'valueA', fieldB: true },
        index: 5,
        position: { start: {}, end: {} },
      });
    });

    it('should create row nodes with only cell/column child nodes (based on first child type) and apply index to column child nodes', () => {
      expect(
        row({}, [
          { type: 'cell', value: 'cell1' },
          { type: 'cell', value: 'cell2' },
          { type: 'column', value: 'column1' },
        ]),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'cell', value: 'cell1' },
          { type: 'cell', value: 'cell2' },
        ],
      });
      expect(
        row({}, [
          { type: 'column', value: 'column1' },
          { type: 'column', value: 'column2' },
          { type: 'cell', value: 'cell1' },
        ]),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'column', index: 0, value: 'column1' },
          { type: 'column', index: 1, value: 'column2' },
        ],
      });
      expect(
        row({}, [
          { type: 'invalid type' },
          { type: 'column', value: 'column1' },
          { type: 'column', value: 'column2' },
          { type: 'cell', value: 'cell1' },
        ]),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'column', index: 0, value: 'column1' },
          { type: 'column', index: 1, value: 'column2' },
        ],
      });
    });

    it('should create cell nodes if children is specified as primitive value', () => {
      expect(
        row({}, ['cell1', { type: 'cell', value: 'cell2' }, 'cell3']),
      ).toEqual({
        type: 'row',
        children: [
          { type: 'cell', value: 'cell1' },
          { type: 'cell', value: 'cell2' },
          { type: 'cell', value: 'cell3' },
        ],
      });
    });
  });

  describe(table, () => {
    it('should create table node with no arguments', () => {
      expect(table()).toEqual({
        type: 'table',
        children: [],
      });
    });

    it('should create table node with only whitelisted properties (data, position)', () => {
      expect(
        table({
          badProperty: 'a',
          children: ['a', 'b'],
          data: { fieldA: 'valueA', fieldB: true },
          dataType: 'percentage',
          index: 5,
          label: 'Percentage',
          position: { start: {}, end: {} },
        }),
      ).toEqual({
        type: 'table',
        children: [],
        data: { fieldA: 'valueA', fieldB: true },
        position: { start: {}, end: {} },
      });
    });

    it('should create table node with only row child nodes and apply row index', () => {
      expect(
        table({}, [
          { type: 'invalid type' },
          { type: 'row', children: [] },
          { type: 'column', value: 'column2' },
          { type: 'cell', value: 'cell1' },
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
});
