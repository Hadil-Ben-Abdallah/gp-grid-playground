import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

import {
  Grid,
  createClientDataSource,
  createServerDataSource,
  createRowGrouping,
  createPivotSource,
  buildPivotSchema,
  useGridData,
  type CellRendererParams,
  type EditRendererParams,
  type ColumnDefinition,
} from '@gp-grid/react';

import Select from 'react-select';

type Status = 'active' | 'inactive' | 'pending';

interface Person {
  id: number;
  name: string;
  age: number;
  email: string;
  status: Status;
  salary: number;
  tags: string[];
  department: string;
  score: number;
}

type DemoId =
  | 'virtual'
  | 'sorting'
  | 'editing'
  | 'styling'
  | 'live'
  | 'layout'
  | 'analytics';

const DEMOS: { id: DemoId; number: string; title: string; description: string }[] = [
  {
    id: 'virtual',
    number: '01',
    title: 'Virtual scrolling',
    description: 'Large datasets and slot-based row rendering',
  },
  {
    id: 'sorting',
    number: '02',
    title: 'Sorting & filtering',
    description: 'Multi-column sorting and interactive filters',
  },
  {
    id: 'editing',
    number: '03',
    title: 'Selection & editing',
    description: 'Keyboard navigation, editing, and fill handle',
  },
  {
    id: 'styling',
    number: '04',
    title: 'Renderers & styling',
    description: 'Custom cells, highlighting, and dark mode',
  },
  {
    id: 'live',
    number: '05',
    title: 'Live & server data',
    description: 'Streaming updates and paginated data loading',
  },
  {
    id: 'layout',
    number: '06',
    title: 'Flexible column layout',
    description: 'Drag, resize, pin, freeze, and organize columns',
  },
  {
    id: 'analytics',
    number: '07',
    title: 'Grouping & pivoting',
    description: 'Department summaries and pivot-style analysis',
  },
];

const departments = ['Engineering', 'Marketing', 'Sales', 'Product', 'Support'];

const names = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Davis',
  'Dexter Wilson',
  'Frank Miller',
  'Grace Taylor',
  'Hannah Brown',
  'James Anderson',
  'Lily Thomas',
  'Noah Martin',
  'Olivia White',
  'Ryan Moore',
];

const tagOptions = [
  { value: 'VIP', label: 'VIP' },
  { value: 'New', label: 'New' },
  { value: 'Priority', label: 'Priority' },
  { value: 'Archived', label: 'Archived' },
  { value: 'Verified', label: 'Verified' },
];

function generateRowData(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => {
    const name = names[Math.floor(Math.random() * names.length)];
    const department =
      departments[Math.floor(Math.random() * departments.length)];

    const statuses: Status[] = ['active', 'inactive', 'pending'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const tags = tagOptions
      .filter(() => Math.random() > 0.72)
      .map((tag) => tag.value);

    return {
      id: index + 1,
      name,
      age: 21 + Math.floor(Math.random() * 42),
      email: `${name.toLowerCase().replaceAll(' ', '.')}@example.com`,
      status,
      salary: 35000 + Math.floor(Math.random() * 95000),
      tags,
      department,
      score: 50 + Math.floor(Math.random() * 51),
    };
  });
}

function CurrencyRenderer({ value }: CellRendererParams) {
  const amount = Number(value ?? 0);

  return (
    <span className="currency-cell">
      {amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      })}
    </span>
  );
}

function StatusRenderer({ value }: CellRendererParams) {
  const status = String(value ?? 'pending').toLowerCase();

  return (
    <span className={`status-badge status-${status}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function BoldRenderer({ value }: CellRendererParams) {
  return <strong className="id-cell">{String(value ?? '')}</strong>;
}

function TagsRenderer({ value }: CellRendererParams) {
  const tags = Array.isArray(value) ? value : [];

  return (
    <div className="tag-list">
      {tags.length ? (
        tags.map((tag) => (
          <span className={`tag tag-${String(tag).toLowerCase()}`} key={tag}>
            {tag}
          </span>
        ))
      ) : (
        <span className="muted-cell">—</span>
      )}
    </div>
  );
}

function ScoreRenderer({ value }: CellRendererParams) {
  const score = Number(value ?? 0);

  return (
    <div className="score-cell">
      <div className="score-track">
        <div
          className={`score-fill ${
            score >= 85 ? 'score-high' : score < 65 ? 'score-low' : ''
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span>{score}</span>
    </div>
  );
}

function MultiSelectEditor({ params }: { params: EditRendererParams }) {
  const selected = Array.isArray(params.value)
    ? params.value.map((tag: string) => ({
        value: tag,
        label: tag,
      }))
    : [];

  return (
    <div className="tag-editor">
      <Select
        isMulti
        autoFocus
        menuIsOpen
        options={tagOptions}
        defaultValue={selected}
        menuPortalTarget={
          typeof document !== 'undefined' ? document.body : undefined
        }
        styles={{
          container: (base) => ({
            ...base,
            minWidth: 210,
            fontSize: 12,
          }),
          control: (base) => ({
            ...base,
            minHeight: 32,
            backgroundColor: '#151c2c',
            borderColor: '#52627d',
            boxShadow: 'none',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#151c2c',
            zIndex: 9999,
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#293954' : '#151c2c',
            color: '#f3f6fc',
            cursor: 'pointer',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#293954',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#f3f6fc',
          }),
          input: (base) => ({ ...base, color: '#f3f6fc' }),
          singleValue: (base) => ({ ...base, color: '#f3f6fc' }),
        }}
        onChange={(next) => {
          params.onValueChange(next.map((item) => item.value));
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            params.onCommit();
          }

          if (event.key === 'Escape') {
            event.preventDefault();
            params.onCancel();
          }
        }}
      />
    </div>
  );
}

const cellRenderers = {
  currency: CurrencyRenderer,
  statusBadge: StatusRenderer,
  bold: BoldRenderer,
  tags: TagsRenderer,
  score: ScoreRenderer,
};

const editRenderers = {
  multiSelect: (params: EditRendererParams) => (
    <MultiSelectEditor params={params} />
  ),
};

function makeColumns(options?: {
  editable?: boolean;
  showDepartment?: boolean;
  showScore?: boolean;
}): ColumnDefinition[] {
  const editable = options?.editable ?? true;

  const columns: ColumnDefinition[] = [
    {
      field: 'id',
      headerName: 'ID',
      cellDataType: 'number',
      width: 84,
      movable: false,
      cellRenderer: 'bold',
    },
    {
      field: 'name',
      headerName: 'Name',
      cellDataType: 'text',
      width: 170,
      editable,
    },
    {
      field: 'age',
      headerName: 'Age',
      cellDataType: 'number',
      width: 88,
      editable,
    },
    {
      field: 'email',
      headerName: 'Email',
      cellDataType: 'text',
      width: 255,
      editable,
    },
    {
      field: 'department',
      headerName: 'Department',
      cellDataType: 'text',
      width: 145,
      editable,
    },
    {
      field: 'status',
      headerName: 'Status',
      cellDataType: 'text',
      width: 125,
      cellRenderer: 'statusBadge',
      editable,
    },
    {
      field: 'salary',
      headerName: 'Annual salary',
      cellDataType: 'number',
      width: 155,
      cellRenderer: 'currency',
      editable,
    },
    {
      field: 'score',
      headerName: 'Score',
      cellDataType: 'number',
      width: 125,
      cellRenderer: 'score',
      editable,
    },
    {
      field: 'tags',
      headerName: 'Tags',
      cellDataType: 'object',
      width: 220,
      cellRenderer: 'tags',
      editRenderer: editRenderers.multiSelect,
      editable,
    },
  ];

  if (!options?.showDepartment) {
    // Department stays available in the data for the analytics demo.
    // The field is hidden from the default column list.
    const departmentColumn = columns.find(
      (column) => column.field === 'department',
    );
    if (departmentColumn) departmentColumn.hidden = true;
  }

  if (!options?.showScore) {
    const scoreColumn = columns.find((column) => column.field === 'score');
    if (scoreColumn) scoreColumn.hidden = true;
  }

  return columns;
}

// Native pivot configuration for Demo 7.
const pivotConfig = {
  rows: [{ field: 'department' }],
  pivots: [{ field: 'status' }],
  measures: [
    {
      field: 'salary',
      aggregate: 'sum' as const,
      column: { headerName: 'Salary' },
    },
    {
      field: 'score',
      aggregate: 'avg' as const,
      column: { headerName: 'Average score' },
    },
  ],
  rowTotals: true,
  grandTotal: 'top' as const,
  defaultExpandedDepth: 1,
};

function App() {
  const [demo, setDemo] = useState<DemoId>('virtual');
  const [darkMode, setDarkMode] = useState(true);
  const [rowLimit, setRowLimit] = useState(15000);
  const [streaming, setStreaming] = useState(false);
  const [streamRate, setStreamRate] = useState(1);
  const [showLayoutPanel, setShowLayoutPanel] = useState(false);
  const [pinnedField, setPinnedField] = useState('id');
  const [frozenRows, setFrozenRows] = useState(false);
  const [analyticsMode, setAnalyticsMode] = useState<'grouping' | 'pivot'>(
    'grouping',
  );
  const [columnOrder, setColumnOrder] = useState<ColumnDefinition[]>(() =>
    makeColumns(),
  );
  const [streamCount, setStreamCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState('Waiting for updates');

  // Stable base data: toggling the theme does not regenerate the dataset.
  const baseRows = useMemo(() => generateRowData(15000), []);

  // Generate the million-row dataset only when that demo is selected.
  const millionRows = useMemo(
    () =>
      demo === 'virtual' && rowLimit === 1000000
        ? generateRowData(1000000)
        : [],
    [demo, rowLimit],
  );

  const activeRows = useMemo(() => {
    if (demo === 'virtual' && rowLimit === 1000000) return millionRows;
    if (demo === 'virtual') return baseRows.slice(0, rowLimit);
    if (demo === 'analytics') return baseRows;
    return baseRows;
  }, [demo, rowLimit, millionRows, baseRows]);

  const liveData = useGridData(baseRows, {
    getRowId: (row: Person) => row.id,
    debounceMs: 80,
  });

  const liveRowsSource = liveData.dataSource;

  const clientDataSource = useMemo(
    () => createClientDataSource(activeRows),
    [activeRows],
  );

  // This demonstrates the grid's paginated DataSource contract using an
  // asynchronous in-memory API. Replace this query with fetch('/api/grid-data')
  // when your demo environment has a real backend endpoint.
  const serverDataSource = useMemo(
    () =>
      createServerDataSource(async (request) => {
        await new Promise((resolve) => setTimeout(resolve, 120));

        const start = request.range.startRow;
        const end = request.range.endRow;

        return {
          rows: baseRows.slice(start, end),
          totalRows: baseRows.length,
        };
      }),
    [baseRows],
  );

  // Native row grouping with employee count, total salary, and average score.
  const grouping = useMemo(
    () =>
      createRowGrouping({
        dimensions: [{ field: 'department' }],
        measures: [
          { field: 'id', aggregate: 'count' },
          { field: 'salary', aggregate: 'sum' },
          { field: 'score', aggregate: 'avg' },
        ],
        grandTotal: 'top',
        defaultExpandedDepth: 1,
      }),
    [],
  );

  // Native pivot source: department rows, status columns, salary and score measures.
  const pivotSource = useMemo(
    () => createPivotSource(createClientDataSource(baseRows), pivotConfig),
    [baseRows],
  );

  const [pivotSchema, setPivotSchema] = useState(
    () => pivotSource.getSchema() ?? buildPivotSchema([], pivotConfig),
  );

  useEffect(() => {
    const currentSchema = pivotSource.getSchema();

    if (currentSchema) {
      setPivotSchema(currentSchema);
    }

    const unsubscribe = pivotSource.subscribeSchema(setPivotSchema);

    return () => {
      unsubscribe();
      pivotSource.destroy?.();
    };
  }, [pivotSource]);

  useEffect(() => {
    if (!streaming || demo !== 'live') return;

    const interval = window.setInterval(() => {
      const nextId = 100000 + (Date.now() % 100000000);

      const newRow = generateRowData(1)[0];
      newRow.id = nextId;

      liveData.addRows([newRow]);
      setStreamCount((count) => count + 1);
      setLastUpdate(new Date().toLocaleTimeString());
    }, Math.max(250, 1500 / streamRate));

    return () => window.clearInterval(interval);
  }, [streaming, demo, streamRate, liveData]);

  useEffect(() => {
    return () => {
      clientDataSource.destroy?.();
      serverDataSource.destroy?.();
    };
  }, [clientDataSource, serverDataSource]);

  const resetLayout = useCallback(() => {
    setColumnOrder(makeColumns());
    setPinnedField('id');
    setFrozenRows(false);
  }, []);

  const handleColumnMoved = useCallback(
    (fromIndex: number, toIndex: number) => {
      setColumnOrder((previous) => {
        const next = [...previous];
        const [moved] = next.splice(fromIndex, 1);
        if (!moved) return previous;
        next.splice(toIndex, 0, moved);
        return next;
      });
    },
    [],
  );

  const columns = useMemo(() => {
    const next = columnOrder.map((column) => ({ ...column }));

    if (demo === 'analytics') {
      return makeColumns({
        editable: false,
        showDepartment: true,
        showScore: true,
      }).map((column) =>
        column.field === 'id'
          ? { ...column, headerName: 'Employee count' }
          : column,
      );
    }

    if (demo === 'layout') {
      return next.map((column) => {
        if (column.field === pinnedField) {
          return { ...column, pinned: 'start' } as ColumnDefinition;
        }

        return { ...column, pinned: undefined } as ColumnDefinition;
      });
    }

    if (demo === 'virtual' || demo === 'sorting') {
      return next.map((column) => ({ ...column, editable: false }));
    }

    return next;
  }, [columnOrder, demo, pinnedField]);

  const isAnalytics = demo === 'analytics';
  const isLive = demo === 'live';
  const isServerView = isLive && !streaming;
  const currentDemo = DEMOS.find((item) => item.id === demo)!;

  let gridRows = activeRows;

  if (demo === 'layout') {
    gridRows = baseRows.slice(0, 250);
  }

  return (
    <main className={`demo-app ${darkMode ? 'theme-dark' : 'theme-light'}`}>
      <header className="topbar">
        <div className="topbar-actions">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((value) => !value)}
            type="button"
          >
            <span>{darkMode ? '☀' : '☾'}</span>
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </header>

      <section className="demo-selector-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">INTERACTIVE PLAYGROUND</span>
            <h2>Choose a feature to explore</h2>
          </div>
          <span className="demo-count">7 DEMOS</span>
        </div>

        <div className="demo-selector">
          {DEMOS.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`demo-option ${demo === item.id ? 'selected' : ''}`}
              onClick={() => {
                setDemo(item.id);
                setStreaming(false);
                setShowLayoutPanel(false);
              }}
            >
              <span className="demo-option-number">{item.number}</span>
              <span className="demo-option-text">
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <span className="demo-option-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid-section">
        <div className="grid-heading">
          <div>
            <span className="section-kicker">DEMO {currentDemo.number}</span>
            <h2>{currentDemo.title}</h2>
            <p>{currentDemo.description}</p>
          </div>

          <div className="grid-heading-actions">
            {demo === 'virtual' && (
              <label className="control-label">
                Dataset
                <select
                  value={rowLimit}
                  onChange={(event) => setRowLimit(Number(event.target.value))}
                >
                  <option value={15000}>15,000 rows</option>
                  <option value={100000}>100,000 rows</option>
                  <option value={1000000}>1,000,000 rows</option>
                </select>
              </label>
            )}

            {demo === 'layout' && (
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowLayoutPanel((value) => !value)}
              >
                Layout controls
              </button>
            )}

            {demo === 'live' && (
              <>
                <label className="control-label">
                  Update rate
                  <select
                    value={streamRate}
                    onChange={(event) => setStreamRate(Number(event.target.value))}
                  >
                    <option value={1}>Normal</option>
                    <option value={2}>Fast</option>
                    <option value={4}>Very fast</option>
                  </select>
                </label>

                <button
                  className={streaming ? 'danger-button' : 'primary-button'}
                  type="button"
                  onClick={() => setStreaming((value) => !value)}
                >
                  {streaming ? 'Ⅱ Pause stream' : '▶ Start stream'}
                </button>
              </>
            )}
          </div>
        </div>

        {demo === 'layout' && showLayoutPanel && (
          <div className="layout-panel">
            <div className="layout-control">
              <label htmlFor="pin-column">Pin column</label>
              <select
                id="pin-column"
                value={pinnedField}
                onChange={(event) => setPinnedField(event.target.value)}
              >
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="department">Department</option>
                <option value="status">Status</option>
              </select>
            </div>

            <label className="check-control">
              <input
                type="checkbox"
                checked={frozenRows}
                onChange={(event) => setFrozenRows(event.target.checked)}
              />
              Freeze the first two rows
            </label>

            <button
              className="secondary-button"
              type="button"
              onClick={resetLayout}
            >
              Reset layout
            </button>

            <span className="layout-hint">
              Drag column headers to reorder and drag their edges to resize.
            </span>
          </div>
        )}

        {demo === 'live' && (
          <div className="live-status-bar">
            <span className={`live-indicator ${streaming ? 'is-live' : ''}`} />
            <strong>{streaming ? 'Live stream running' : 'Stream paused'}</strong>
            <span className="live-status-divider" />
            <span>{streamCount.toLocaleString()} new rows received</span>
            <span className="live-status-divider" />
            <span>Last update: {lastUpdate}</span>
          </div>
        )}

        {demo === 'sorting' && (
          <div className="feature-tip">
            <span className="tip-icon">↕</span>
            Click a column header to sort. Hold <kbd>Shift</kbd> while clicking
            another header to add a secondary sort. Use the header filter controls
            to narrow the results.
          </div>
        )}

        {demo === 'editing' && (
          <div className="feature-tip">
            <span className="tip-icon">⌘</span>
            Double-click a cell, press <kbd>Enter</kbd> or <kbd>F2</kbd> to edit.
            Try selecting a range of cells and using the fill handle to copy values.
            The Tags column uses a multi-select editor.
          </div>
        )}

        {demo === 'styling' && (
          <div className="feature-tip">
            <span className="tip-icon">✦</span>
            Explore the salary, status, score, and tag renderers. Use the theme
            switch at the top of the page to compare light and dark appearances.
          </div>
        )}

        {demo === 'virtual' && (
          <div className="feature-tip">
            <span className="tip-icon">⚡</span>
            Scroll through the dataset. Try one million rows to demonstrate
            virtual scrolling while keeping the rendered viewport compact.
          </div>
        )}

        {demo === 'layout' && (
          <div className="feature-tip">
            <span className="tip-icon">⤧</span>
            Reorder columns by dragging headers and resize them from their edges.
            Use Layout controls to explore the pinning and frozen-row settings.
          </div>
        )}

        {isAnalytics && (
          <div className="analytics-tabs">
            <button
              type="button"
              className={
                analyticsMode === 'grouping'
                  ? 'primary-button'
                  : 'secondary-button'
              }
              onClick={() => setAnalyticsMode('grouping')}
            >
              Row grouping &amp; aggregation
            </button>

            <button
              type="button"
              className={
                analyticsMode === 'pivot'
                  ? 'primary-button'
                  : 'secondary-button'
              }
              onClick={() => setAnalyticsMode('pivot')}
            >
              Pivot by status
            </button>
          </div>
        )}

        <div className={`grid-frame ${darkMode ? 'grid-frame-dark' : ''}`}>
          <div className="grid-toolbar">
            <div className="grid-toolbar-left">
              <span className="grid-live-dot" />
              <strong>
                {demo === 'analytics'
                  ? 'Workforce analytics'
                  : demo === 'live'
                    ? 'Live employee feed'
                    : 'Employee directory'}
              </strong>
              <span className="toolbar-separator" />
              <span className="row-count">
                {demo === 'analytics'
                  ? analyticsMode === 'grouping'
                    ? 'Native department grouping'
                    : 'Native department/status pivot'
                  : demo === 'layout'
                    ? '250 rows · Layout preview'
                    : demo === 'live'
                      ? 'Streaming data source'
                      : `${gridRows.length.toLocaleString()} rows`}
              </span>
            </div>

            <div className="grid-toolbar-right">
              <span className="toolbar-chip">Sortable</span>
              <span className="toolbar-chip">Virtualized</span>
              {demo === 'editing' && (
                <span className="toolbar-chip toolbar-chip-accent">Editable</span>
              )}
            </div>
          </div>

          <div className="grid-viewport">
            {demo === 'live' ? (
              <Grid
                columns={columns}
                dataSource={liveRowsSource}
                rowHeight={36}
                headerHeight={40}
                darkMode={darkMode}
                cellRenderers={cellRenderers}
                editRenderers={editRenderers}
                overscan={8}
                getRowId={(row: Person) => row.id}
              />
            ) : isServerView ? (
              <Grid
                columns={columns}
                dataSource={serverDataSource}
                rowHeight={36}
                headerHeight={40}
                darkMode={darkMode}
                cellRenderers={cellRenderers}
                editRenderers={editRenderers}
                overscan={6}
              />
            ) : isAnalytics && analyticsMode === 'pivot' ? (
              <Grid
                columns={pivotSchema.columns}
                columnGroups={pivotSchema.columnGroups}
                dataSource={pivotSource}
                rowHeight={36}
                headerHeight={40}
                darkMode={darkMode}
                overscan={6}
                groupLabelColumn="gp-pivot-label"
              />
            ) : isAnalytics ? (
              <Grid
                columns={columns}
                rowData={baseRows}
                rowHeight={36}
                headerHeight={40}
                darkMode={darkMode}
                cellRenderers={cellRenderers}
                overscan={6}
                getRowId={(row: Person) => row.id}
                rowGrouping={grouping}
                groupLabelColumn="department"
              />
            ) : (
              <Grid
                columns={columns}
                rowData={gridRows}
                rowHeight={36}
                headerHeight={40}
                darkMode={darkMode}
                cellRenderers={cellRenderers}
                editRenderers={editRenderers}
                overscan={demo === 'virtual' ? 10 : 6}
                wheelDampening={demo === 'virtual' ? 0.2 : undefined}
                onColumnMoved={handleColumnMoved}
                freezeRows={
                  demo === 'layout' && frozenRows ? { count: 2 } : undefined
                }
              />
            )}
          </div>

          <footer className="grid-footer">
            <span>
              <span className="footer-status-dot" />
              Ready
            </span>
            <span>
              {demo === 'virtual'
                ? 'Virtual scrolling enabled'
                : demo === 'sorting'
                  ? 'Sorting and filtering enabled'
                  : demo === 'editing'
                    ? 'Cell editing enabled'
                    : demo === 'styling'
                      ? 'Custom renderers enabled'
                      : demo === 'live'
                        ? 'Data source connected'
                        : demo === 'layout'
                          ? frozenRows
                            ? 'First two rows frozen'
                            : 'Column layout demo'
                          : analyticsMode === 'grouping'
                            ? 'Native grouping and aggregation enabled'
                            : 'Native pivot view enabled'}
            </span>
          </footer>
        </div>

        {demo === 'live' && (
          <p className="implementation-note">
            The stream inserts new records through the mutable client data source.
            The paginated example uses an asynchronous data-source query over the
            same demo dataset. Connect that query to your backend when you want to
            record a true server-backed example.
          </p>
        )}

        {demo === 'analytics' && (
          <p className="implementation-note">
            {analyticsMode === 'grouping'
              ? 'This view uses gp-grid native row grouping by department, with employee counts, salary totals, average scores, and a grand-total row.'
              : 'This view uses gp-grid native pivoting with departments as rows, employee statuses as pivot columns, and salary and score aggregations.'}
          </p>
        )}
      </section>

      <footer className="page-footer">
        <a href="https://gp-grid.io/" target="_blank" rel="noreferrer">
          Explore gp-grid ↗
        </a>
      </footer>
    </main>
  );
}

export default App;