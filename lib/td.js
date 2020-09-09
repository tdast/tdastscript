import u from 'unist-builder';

export const CELL = 'cell';
export const COLUMN = 'column';
export const ROW = 'row';
export const TABLE = 'table';

function fromArgs(...args) {
  const [type, arg2, arg3] = args;
  let children = [];
  let props = {};

  if (Array.isArray(arg2)) {
    children = arg2;
  } else {
    children = arg3 || [];
    if (arg2 instanceof Object) {
      props = arg2;
    } else {
      props = { value: arg2 };
    }
  }

  return { children, props, type };
}

export default function td(...args) {
  const { children, props, type } = fromArgs(...args);

  switch (type) {
    case TABLE: {
      const { data, position } = props;
      const rows = [];
      let childIndex = 0;
      children.forEach((child) => {
        const childType = child?.type;
        switch (childType) {
          case ROW:
            rows.push(td(ROW, { ...child, index: childIndex }, child.children));
            childIndex++;
            break;
          default:
            break;
        }
      });
      return u(TABLE, { data, position }, rows);
    }
    case ROW: {
      const { data, index, position } = props;
      const cells = [];
      const rowIndex = index;
      let columnIndex = 0;
      children.forEach((child) => {
        const childType = child?.type;
        const childProps = child instanceof Object ? child : { value: child };
        switch (childType) {
          case COLUMN:
            cells.push(td(COLUMN, { ...childProps, index: columnIndex }));
            columnIndex++;
            break;
          case CELL:
          case undefined: {
            cells.push(td(CELL, { ...childProps, columnIndex, rowIndex }));
            columnIndex++;
            break;
          }
          default:
            break;
        }
      });
      return u(ROW, { data, index, position }, cells);
    }
    case CELL: {
      const { columnIndex, data, position, rowIndex, value } = props;
      return u(CELL, { columnIndex, data, position, rowIndex, value });
    }
    case COLUMN: {
      const { data, dataType, index, label, position, value } = props;
      return u(COLUMN, { data, dataType, index, label, position, value });
    }
    default: {
      return u(TABLE, []);
    }
  }
}
