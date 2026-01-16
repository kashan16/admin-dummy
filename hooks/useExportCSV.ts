"use client";

type CSVValue = string | number | boolean | null | undefined;

type ExportCSVOptions<T> = {
    filename?: string; // default: export.csv
    headers?: Record<string, string>; // optional: { key: "Label" }
    mapRow?: (item: T) => Record<string, CSVValue>; // optional row mapping
};

function escapeCSV(value: CSVValue) {
    const str = String(value ?? "");
    return `"${str.replace(/"/g, '""')}"`;
}

function buildCSVFromRows(rows: Record<string, CSVValue>[], headerLabels?: Record<string, string>) {
    if (!rows.length) return "";
    
    const keys = Object.keys(rows[0]);
    
    const headerRow = keys
        .map((k) => (headerLabels?.[k] ? headerLabels[k] : k))
        .map(escapeCSV)
        .join(",");
        
    const body = rows
        .map((row) => keys.map((k) => escapeCSV(row[k])).join(","))
        .join("\n");

    return `${headerRow}\n${body}`;
}

function downloadFile(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
}

function safeFilename(name: string) {
    // removes weird characters for clean downloads
    return name.replace(/[^\w\-\.]/g, "_");
}

export function useExportCSV() {
    const exportCSV = <T,>(data: T[], options?: ExportCSVOptions<T>) => {
        if (!data || data.length === 0) return;
        const filename = safeFilename(options?.filename ?? "export.csv");
    
        const rows =
            options?.mapRow
            ? data.map(options.mapRow)
            : (data as unknown as Record<string, CSVValue>[]);
        
        const csv = buildCSVFromRows(rows, options?.headers);
        downloadFile(filename, csv);
    };
    
    return { exportCSV };
}
