import React from 'react';

import TableHeader from '../../components/Table/TableHeader';
import TableRows from './TableRows';


interface TableProps {
  data: string[][];
  header?: string[];
}

const Table: React.FC<TableProps> = (props) => {
  return (
    <table>
      {props.header ? <TableHeader columns={props.header}/> : null}
      <TableRows data={props.data}/>
    </table>
  )

}

export default Table;