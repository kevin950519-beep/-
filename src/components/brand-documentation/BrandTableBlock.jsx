import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { BrandBlockFrame } from './BrandBlockFrame.jsx';
import { BrandDocumentValue } from './BrandDocumentValue.jsx';

/**
 * Render structured report data as a responsive MUI table.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - Table block with `columns`, `rows`, and optional `caption`.
 */
export function BrandTableBlock({ block }) {
  const rows = Array.isArray(block.rows) ? block.rows : [];
  const declaredColumns = Array.isArray(block.columns) ? block.columns : [];
  const columns = declaredColumns.length > 0
    ? declaredColumns.map((column) => (
      typeof column === 'string' ? { key: column, label: column } : column
    ))
    : Object.keys(rows[0] ?? {}).map((key) => ({ key, label: key }));

  return (
    <BrandBlockFrame title={ block.title } description={ block.description }>
      <TableContainer
        sx={ {
          width: '100%',
          minWidth: 0,
          overflowX: 'visible',
          border: '1px solid',
          borderColor: 'divider',
        } }
      >
        <Table
          size="small"
          aria-label={ block.title ?? block.caption ?? 'Brand report table' }
          sx={ { width: '100%', tableLayout: 'fixed' } }
        >
          { block.caption && (
            <caption>
              <Typography component="span" variant="caption" color="text.secondary">
                { block.caption }
              </Typography>
            </caption>
          ) }
          <TableHead>
            <TableRow sx={ { backgroundColor: 'action.hover' } }>
              { columns.map((column) => (
                <TableCell
                  key={ column.key }
                  align={ column.align ?? 'left' }
                  sx={ {
                    width: column.width,
                    minWidth: 0,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.02em',
                    verticalAlign: 'bottom',
                    whiteSpace: 'normal',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  } }
                >
                  { column.label ?? column.key }
                </TableCell>
              )) }
            </TableRow>
          </TableHead>
          <TableBody>
            { rows.map((row, rowIndex) => (
              <TableRow key={ row.id ?? rowIndex } sx={ { '&:last-child td': { borderBottom: 0 } } }>
                { columns.map((column) => (
                  <TableCell
                    key={ column.key }
                    align={ column.align ?? 'left' }
                    sx={ {
                      verticalAlign: 'top',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.6,
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                      fontVariantNumeric: column.numeric ? 'tabular-nums' : undefined,
                      fontFamily: column.monospace ? 'monospace' : undefined,
                    } }
                  >
                    <BrandDocumentValue value={ row[column.key] } />
                  </TableCell>
                )) }
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
    </BrandBlockFrame>
  );
}
