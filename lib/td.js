import u from 'unist-builder';

const CELL = 'cell';
const COLUMN = 'column';
const ROW = 'row';
const TABLE = 'table';

// evaluate optional args into well-defined variables
function fromArgs(properties, childrenOrValue) {
  let children = [];
  let props = {};

  if (Array.isArray(properties)) {
    children = properties;
  } else {
    children = childrenOrValue || [];
    if (properties instanceof Object) {
      props = properties;
    } else {
      props = { value: properties };
    }
  }

  return [props, children];
}

export default function td(type, properties, childrenOrValue) {
  const [props, children] = fromArgs(properties, childrenOrValue);

  switch (type) {
    case TABLE: {
      const { data, position } = props;
      const rows = [];
      let childIndex = 0;
      children.forEach((child) => {
        const childType = child ? child.type : undefined;
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
        const childType = child ? child.type : undefined;
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
