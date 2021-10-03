import React from 'react';

import './styles.scss';

interface TableHeaderProps {
  columns: any[];
}

const TableHeader: React.FC<TableHeaderProps> = ({columns}) => {

  const headers = columns.map((column, index) => {


    return (
      <th className="head-cell" key={index}>
        {column}
      </th>
    );
  });

  return (
    <thead>
      <tr>
        {headers}
      </tr>
    </thead>
  )
}

export default TableHeader;