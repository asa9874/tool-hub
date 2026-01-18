import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';

interface GridArea {
  id: string;
  name: string;
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
  color: string;
}

export default function CssGridGenerator() {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';

  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [gap, setGap] = useState(10);
  const [rowSizes, setRowSizes] = useState<string[]>(['1fr', '1fr', '1fr']);
  const [colSizes, setColSizes] = useState<string[]>(['1fr', '1fr', '1fr']);
  const [areas, setAreas] = useState<GridArea[]>([]);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ row: number; col: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const colors = [
    '#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a',
    '#a8edea', '#ffecd2', '#fcb69f', '#a1c4fd', '#c2e9fb',
  ];

  const updateGridSize = (newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);
    
    // 행 크기 조정
    const newRowSizes = [...rowSizes];
    while (newRowSizes.length < newRows) newRowSizes.push('1fr');
    while (newRowSizes.length > newRows) newRowSizes.pop();
    setRowSizes(newRowSizes);
    
    // 열 크기 조정
    const newColSizes = [...colSizes];
    while (newColSizes.length < newCols) newColSizes.push('1fr');
    while (newColSizes.length > newCols) newColSizes.pop();
    setColSizes(newColSizes);

    // 범위를 벗어난 영역 제거
    setAreas(areas.filter(area => 
      area.startRow <= newRows && area.startCol <= newCols
    ));
  };

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleCellMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setDragStart({ row, col });
    setSelectedCells(new Set([getCellKey(row, col)]));
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isDragging || !dragStart) return;

    const minRow = Math.min(dragStart.row, row);
    const maxRow = Math.max(dragStart.row, row);
    const minCol = Math.min(dragStart.col, col);
    const maxCol = Math.max(dragStart.col, col);

    const newSelected = new Set<string>();
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        newSelected.add(getCellKey(r, c));
      }
    }
    setSelectedCells(newSelected);
  };

  const handleCellMouseUp = () => {
    if (!isDragging || !dragStart || selectedCells.size === 0) {
      setIsDragging(false);
      setDragStart(null);
      return;
    }

    // 선택된 셀에서 영역 계산
    const selectedArray = Array.from(selectedCells).map(key => {
      const [r, c] = key.split('-').map(Number);
      return { row: r, col: c };
    });

    const startRow = Math.min(...selectedArray.map(s => s.row));
    const endRow = Math.max(...selectedArray.map(s => s.row));
    const startCol = Math.min(...selectedArray.map(s => s.col));
    const endCol = Math.max(...selectedArray.map(s => s.col));

    // 겹치는 영역 제거
    const filteredAreas = areas.filter(area => {
      const overlaps = !(
        area.endRow < startRow ||
        area.startRow > endRow ||
        area.endCol < startCol ||
        area.startCol > endCol
      );
      return !overlaps;
    });

    // 새 영역 추가
    const newArea: GridArea = {
      id: Date.now().toString(),
      name: `area${filteredAreas.length + 1}`,
      startRow,
      endRow,
      startCol,
      endCol,
      color: colors[filteredAreas.length % colors.length],
    };

    setAreas([...filteredAreas, newArea]);
    setIsDragging(false);
    setDragStart(null);
    setSelectedCells(new Set());
  };

  const removeArea = (id: string) => {
    setAreas(areas.filter(a => a.id !== id));
  };

  const updateAreaName = (id: string, name: string) => {
    setAreas(areas.map(a => a.id === id ? { ...a, name } : a));
  };

  const getCellArea = useCallback((row: number, col: number) => {
    return areas.find(area =>
      row >= area.startRow && row <= area.endRow &&
      col >= area.startCol && col <= area.endCol
    );
  }, [areas]);

  const generateCSS = () => {
    const gridTemplateAreas = [];
    for (let r = 1; r <= rows; r++) {
      const rowAreas = [];
      for (let c = 1; c <= cols; c++) {
        const area = getCellArea(r, c);
        rowAreas.push(area ? area.name : '.');
      }
      gridTemplateAreas.push(`"${rowAreas.join(' ')}"`);
    }

    return `.grid-container {
  display: grid;
  grid-template-columns: ${colSizes.join(' ')};
  grid-template-rows: ${rowSizes.join(' ')};
  grid-template-areas:
    ${gridTemplateAreas.join('\n    ')};
  gap: ${gap}px;
}

${areas.map(area => `.${area.name} {
  grid-area: ${area.name};
}`).join('\n\n')}`;
  };

  const generateHTML = () => {
    return `<div class="grid-container">
${areas.map(area => `  <div class="${area.name}">${area.name}</div>`).join('\n')}
</div>`;
  };

  const cssCode = generateCSS();
  const htmlCode = generateHTML();

  const copyCSS = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setAreas([]);
  };

  return (
    <>
      <SEO
        title={isKorean ? 'CSS 그리드 생성기' : 'CSS Grid Generator'}
        description={isKorean 
          ? '드래그로 CSS Grid 레이아웃을 만들고 코드를 생성하세요.'
          : 'Create CSS Grid layouts by dragging and generate code.'
        }
        keywords={isKorean
          ? ['CSS 그리드', '그리드 레이아웃', 'CSS Grid', '레이아웃 생성기']
          : ['CSS Grid', 'grid layout', 'CSS Grid generator', 'layout generator']
        }
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📐 {isKorean ? 'CSS 그리드 생성기' : 'CSS Grid Generator'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isKorean 
            ? '마우스 드래그로 영역을 지정하고 CSS Grid 코드를 생성하세요.'
            : 'Drag to define areas and generate CSS Grid code.'
          }
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 설정 패널 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{isKorean ? '그리드 설정' : 'Grid Settings'}</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKorean ? '행' : 'Rows'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={rows}
                    onChange={(e) => updateGridSize(Number(e.target.value), cols)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isKorean ? '열' : 'Columns'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={cols}
                    onChange={(e) => updateGridSize(rows, Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gap: {gap}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* 열 크기 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '열 크기' : 'Column Sizes'}
                </label>
                <div className="space-y-2">
                  {colSizes.map((size, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-6">C{i + 1}</span>
                      <input
                        type="text"
                        value={size}
                        onChange={(e) => {
                          const newSizes = [...colSizes];
                          newSizes[i] = e.target.value;
                          setColSizes(newSizes);
                        }}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        placeholder="1fr, 100px, auto..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 행 크기 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '행 크기' : 'Row Sizes'}
                </label>
                <div className="space-y-2">
                  {rowSizes.map((size, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-6">R{i + 1}</span>
                      <input
                        type="text"
                        value={size}
                        onChange={(e) => {
                          const newSizes = [...rowSizes];
                          newSizes[i] = e.target.value;
                          setRowSizes(newSizes);
                        }}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        placeholder="1fr, 100px, auto..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={clearAll}
                className="w-full py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                {isKorean ? '모두 지우기' : 'Clear All'}
              </button>
            </div>

            {/* 영역 목록 */}
            {areas.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '정의된 영역' : 'Defined Areas'}
                </h3>
                <div className="space-y-2">
                  {areas.map((area) => (
                    <div key={area.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: area.color }}
                      />
                      <input
                        type="text"
                        value={area.name}
                        onChange={(e) => updateAreaName(area.id, e.target.value.replace(/\s/g, '-'))}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => removeArea(area.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 그리드 에디터 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {isKorean ? '그리드 에디터' : 'Grid Editor'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {isKorean 
                ? '드래그하여 영역을 지정하세요'
                : 'Drag to define areas'
              }
            </p>

            <div
              className="grid bg-gray-100 rounded-lg p-2 select-none"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: `${gap}px`,
                minHeight: '300px',
              }}
              onMouseLeave={() => {
                if (isDragging) {
                  handleCellMouseUp();
                }
              }}
            >
              {Array.from({ length: rows }, (_, r) =>
                Array.from({ length: cols }, (_, c) => {
                  const row = r + 1;
                  const col = c + 1;
                  const key = getCellKey(row, col);
                  const area = getCellArea(row, col);
                  const isSelected = selectedCells.has(key);

                  return (
                    <div
                      key={key}
                      className={`rounded border-2 border-dashed flex items-center justify-center cursor-crosshair transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-100'
                          : area
                          ? 'border-transparent'
                          : 'border-gray-300 bg-white hover:border-blue-300'
                      }`}
                      style={{
                        backgroundColor: area && !isSelected ? area.color : undefined,
                        minHeight: '60px',
                      }}
                      onMouseDown={() => handleCellMouseDown(row, col)}
                      onMouseEnter={() => handleCellMouseEnter(row, col)}
                      onMouseUp={handleCellMouseUp}
                    >
                      {area && (
                        <span className="text-xs text-white font-medium drop-shadow">
                          {area.name}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 코드 출력 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{isKorean ? '생성된 코드' : 'Generated Code'}</h2>

            {/* CSS */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">CSS</span>
                <button
                  onClick={copyCSS}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isKorean ? '복사' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto">
                <pre className="text-green-400 text-xs whitespace-pre-wrap">
                  {cssCode}
                </pre>
              </div>
            </div>

            {/* HTML */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">HTML</span>
                <button
                  onClick={copyHTML}
                  className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  {isKorean ? '복사' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 max-h-32 overflow-y-auto">
                <pre className="text-blue-400 text-xs whitespace-pre-wrap">
                  {htmlCode}
                </pre>
              </div>
            </div>

            {/* 미리보기 */}
            {areas.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {isKorean ? '미리보기' : 'Preview'}
                </h3>
                <div
                  className="grid rounded-lg overflow-hidden border"
                  style={{
                    gridTemplateColumns: colSizes.join(' '),
                    gridTemplateRows: rowSizes.join(' '),
                    gap: `${gap}px`,
                    minHeight: '150px',
                  }}
                >
                  {areas.map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        backgroundColor: area.color,
                        gridRow: `${area.startRow} / ${area.endRow + 1}`,
                        gridColumn: `${area.startCol} / ${area.endCol + 1}`,
                      }}
                    >
                      {area.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
