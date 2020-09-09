export const CELL = 'cell';
export const COLUMN = 'column';
export const ROW = 'row';
export const TABLE = 'table';

function create(type, props) {
  const node = { ...props, type };
  const { data, position } = props;
  if (data instanceof Object) {
    node.data = data;
  }

  if (position instanceof Object) {
    node.position = position;
  }

  return node;
}

export function cell(value, props = {}) {
  const { data, position } = props;
  return create(CELL, { data, position, value });
}

export function column(value, props = {}) {
  const { data, dataType, index, label, position } = props;
  return create(COLUMN, { data, dataType, index, label, position, value });
}

export function row(props = {}, children = []) {
  const { data, index, position } = props;
  let firstChildType;
  const updatedChildren = children
    .map((child) => {
      const isNode = child?.type;
      if (!firstChildType) {
        if (isNode) {
          if ([CELL, COLUMN].includes(child.type)) {
            firstChildType = child.type;
          }
        } else {
          firstChildType = CELL;
        }
      }
      if (!isNode) {
        return cell(child);
      }
      if (isNode && firstChildType === child.type) {
        return child;
      }
      return null;
    })
    .filter((child) => child)
    .map((child, index) => {
      return child.type === COLUMN ? { ...child, index } : child;
    });
  return create(ROW, { children: updatedChildren, data, index, position });
}

export function table(props = {}, children = []) {
  const { data, position } = props;
  const updatedChildren = children
    .map((child) => {
      const isRowNode = child?.type === ROW;
      if (isRowNode) {
        return row(child, child.children);
      }
      return null;
    })
    .filter((child) => child)
    .map((child, index) => ({ ...child, index }));
  return create(TABLE, { children: updatedChildren, data, position });
}
