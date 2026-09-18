import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

/**
 * DocTable 컴포넌트
 *
 * 스토리북 문서용 범용 표. 열 정의와 행 데이터만 주면 렌더한다.
 * 셀 커스텀이 필요하면 renderCell 로 넘겨받는다.
 *
 * Props:
 * @param {object[]} columns - { key, label, width? } 목록 [Required]
 * @param {object[]} rows - 행 데이터 목록 [Required]
 * @param {function} renderCell - (row, column) => ReactNode. 없으면 row[column.key] 를 그대로 표시 [Optional]
 *
 * Example usage:
 * <DocTable
 *   columns={ [{ key: 'stage', label: '단계' }, { key: 'decided', label: '결정' }] }
 *   rows={ [{ stage: '기획', decided: '한 줄 요약' }] }
 * />
 */
export function DocTable({ columns, rows, renderCell }) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            { columns.map((column) => (
              <TableCell key={ column.key } sx={ column.width ? { width: column.width } : undefined }>
                { column.label }
              </TableCell>
            )) }
          </TableRow>
        </TableHead>
        <TableBody>
          { rows.map((row, rowIndex) => (
            <TableRow key={ row.id ?? row.key ?? rowIndex }>
              { columns.map((column) => (
                <TableCell key={ column.key }>
                  { renderCell ? renderCell(row, column) : row[column.key] }
                </TableCell>
              )) }
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
