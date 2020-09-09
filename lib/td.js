import { CELL, COLUMN, ROW, TABLE, cell, column, row, table } from './node';

function fromArgs(...args) {
  const [type, arg2, arg3] = args;
  let children = [];
  let props = {};

  if (Array.isArray(arg2)) {
    children = arg2;
  } else {
    children = arg3;
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
      return table(props, children);
    }
    case ROW: {
      return row(props, children);
    }
    case CELL: {
      const { value, ...restProps } = props;
      return cell(value, restProps);
    }
    case COLUMN: {
      const { value, ...restProps } = props;
      return column(value, restProps);
    }
    default: {
      return table();
    }
  }
}
