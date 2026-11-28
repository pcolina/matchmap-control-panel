import { describe, expect, it } from 'vitest';
import * as echarts from 'echarts';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableModule } from 'primeng/table';

describe('external libraries', () => {
  it('loads ECharts with an init function', () => {
    expect(typeof echarts.init).toBe('function');
  });

  it('parses CSV text into rows', () => {
    const result = Papa.parse<string[]>('a,b\n1,2', { skipEmptyLines: true });
    expect(result.data).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('creates a PDF document with an autotable plugin', () => {
    const doc = new jsPDF();
    autoTable(doc, { head: [['Name']], body: [['MatchMap']] });
    expect(doc.output('arraybuffer').byteLength).toBeGreaterThan(0);
  });

  it('exposes the PrimeNG table module', () => {
    expect(TableModule).toBeDefined();
  });
});
