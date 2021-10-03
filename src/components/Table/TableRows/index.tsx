import React from 'react';

import './styles.scss';

interface TableRowsProps {
  data: string[][];
}

const TableRows: React.FC<TableRowsProps> = ({data}) => {
  

  const rows = data.map((row: string[], index: number) => {
    return (
      <tr className="row" key={index}>
        {row.map((value, index2) => (
          <td className="cell" key={index2}>
            {value}
          </td>
        ))}
      </tr>
    )
  });

  return (
    <tbody className="table-body">
      {rows}
    </tbody>
  )
}

export default TableRows;