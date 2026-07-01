"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle2, AlertTriangle, RefreshCw, Download } from "lucide-react";
import { bulkImportProducts } from "@/lib/actions/product.action";
import { funnel, oleo } from "@/lib/fonts";
import { toast } from "sonner";

type ParsedProduct = {
  name: string;
  slug?: string;
  category?: string;
  images?: string;
  description?: string;
  price: number;
  stock: number;
  author?: string;
  language?: string;
  pages?: number;
  genres?: string;
  kind?: string;
};

type RowPreview = {
  rowNum: number;
  data: ParsedProduct;
  isValid: boolean;
  errors: string[];
};

// Robust CSV parser supporting quotes, commas, and double-quote escapes
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      row.push("");
    } else if ((c === "\r" || c === "\n") && !inQuotes) {
      if (c === "\r" && next === "\n") {
        i++;
      }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  return lines;
}

const CSVImportPage = () => {
  const [fileName, setFileName] = useState("");
  const [previewRows, setPreviewRows] = useState<RowPreview[]>([]);
  const [validProducts, setValidProducts] = useState<ParsedProduct[]>([]);
  const [summary, setSummary] = useState({ total: 0, valid: 0, invalid: 0 });
  const [importResult, setImportResult] = useState<{
    success: boolean;
    createdCount: number;
    updatedCount: number;
    failedCount: number;
    errors: string[];
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleDownloadTemplate = () => {
    const headers = "name,slug,category,images,description,price,stock,author,language,pages,genres,kind\n";
    const exampleRow = '"Curated Stories","curated-stories","Fiction","/images/book1.jpg","An inspiring read.",350,15,"Author Name","English",240,"Drama,Inspire","book"\n';
    const blob = new Blob([headers + exampleRow], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "milestone_products_template.csv");
    a.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const rows = parseCSV(text);
        if (rows.length < 2) {
          toast.error("CSV file is empty or missing data rows");
          return;
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const expectedHeaders = ["name", "slug", "category", "images", "description", "price", "stock", "author", "language", "pages", "genres", "kind"];
        
        // Find index of essential columns
        const nameIdx = headers.indexOf("name");
        const priceIdx = headers.indexOf("price");
        const stockIdx = headers.indexOf("stock");

        if (nameIdx === -1) {
          toast.error("CSV must contain a 'name' column");
          return;
        }

        const parsedPreviews: RowPreview[] = [];
        const validList: ParsedProduct[] = [];
        let validCount = 0;
        let invalidCount = 0;

        for (let i = 1; i < rows.length; i++) {
          const rowData = rows[i];
          // Skip completely empty lines
          if (rowData.length === 1 && rowData[0] === "") continue;

          const rowNum = i + 1;
          const errorsList: string[] = [];

          // Map CSV columns using header positions
          const getVal = (headerName: string) => {
            const idx = headers.indexOf(headerName);
            return idx !== -1 ? rowData[idx] : undefined;
          };

          const name = String(getVal("name") || "").trim();
          const rawPrice = getVal("price");
          const rawStock = getVal("stock");

          if (!name) {
            errorsList.push("Name is required");
          }

          const price = Number(rawPrice || 0);
          if (rawPrice !== undefined && (isNaN(price) || price < 0)) {
            errorsList.push("Price must be a positive number");
          }

          const stock = Number(rawStock || 0);
          if (rawStock !== undefined && (isNaN(stock) || stock < 0)) {
            errorsList.push("Stock must be a positive integer");
          }

          const productObj: ParsedProduct = {
            name,
            slug: getVal("slug") ? String(getVal("slug")).trim() : undefined,
            category: getVal("category") ? String(getVal("category")).trim() : undefined,
            images: getVal("images") ? String(getVal("images")).trim() : undefined,
            description: getVal("description") ? String(getVal("description")).trim() : undefined,
            price,
            stock,
            author: getVal("author") ? String(getVal("author")).trim() : undefined,
            language: getVal("language") ? String(getVal("language")).trim() : undefined,
            pages: getVal("pages") ? Math.floor(Number(getVal("pages"))) : undefined,
            genres: getVal("genres") ? String(getVal("genres")).trim() : undefined,
            kind: getVal("kind") ? String(getVal("kind")).trim() : undefined,
          };

          const isValid = errorsList.length === 0;
          if (isValid) {
            validCount++;
            validList.push(productObj);
          } else {
            invalidCount++;
          }

          parsedPreviews.push({
            rowNum,
            data: productObj,
            isValid,
            errors: errorsList,
          });
        }

        setPreviewRows(parsedPreviews);
        setValidProducts(validList);
        setSummary({ total: parsedPreviews.length, valid: validCount, invalid: invalidCount });
        toast.success(`Successfully parsed ${parsedPreviews.length} rows`);
      } catch (err) {
        toast.error("Failed to parse CSV file. Ensure it is a valid CSV format.");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (validProducts.length === 0) return;

    startTransition(async () => {
      const res = await bulkImportProducts(validProducts);
      if (res.success) {
        setImportResult({
          success: true,
          createdCount: res.createdCount || 0,
          updatedCount: res.updatedCount || 0,
          failedCount: res.failedCount || 0,
          errors: res.errors || [],
        });
        toast.success("Bulk import complete");
      } else {
        toast.error(res.message || "Failed to complete bulk import");
      }
    });
  };

  return (
    <div className="wrapper py-10 min-h-[80vh]">
      <Link
        href="/admin/products"
        className="flex gap-2 items-center text-xs border border-primary-text/30 w-fit p-1.5 px-3 rounded-full hover:bg-primary-border/40 transition-colors mb-6 font-semibold"
      >
        <ArrowLeft size={12} />
        Back to Products
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className={`${oleo.className} text-3xl font-bold text-primary-text`}>
            Bulk Catalog CSV Import
          </h1>
          <p className="text-sm opacity-60 max-w-xl">
            Import, add, or bulk-update your product inventory by uploading a structured CSV spreadsheet.
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="flex gap-2 items-center bg-primary-border/60 hover:bg-primary-border border border-primary-text/10 text-primary-text text-sm font-semibold p-2.5 px-4 rounded-xl transition-colors"
        >
          <Download size={15} />
          Download Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Upload Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border-2 border-dashed border-primary-text/20 rounded-2xl p-6 bg-primary-border/5 text-center space-y-4 hover:border-primary-text/40 transition-colors relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 bg-primary-border/50 rounded-full flex items-center justify-center text-primary-text mx-auto">
              <Upload size={22} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-text">
                {fileName ? fileName : "Upload CSV file"}
              </p>
              <p className="text-xs opacity-60 mt-1">
                Drag and drop or click to choose file
              </p>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-primary-border/10 border border-primary-text/5 p-5 rounded-2xl text-xs space-y-3">
            <h3 className="font-bold text-primary-text">Supported CSV Headers:</h3>
            <ul className="list-disc pl-4 space-y-1.5 opacity-80">
              <li><strong>name</strong> (Required): Product title.</li>
              <li><strong>slug</strong> (Optional): Auto-generated if blank.</li>
              <li><strong>price</strong> (Optional): Price in INR (positive number).</li>
              <li><strong>stock</strong> (Optional): Quantity in inventory.</li>
              <li><strong>category</strong> (Optional): e.g., Fiction, Accessories.</li>
              <li><strong>images</strong> (Optional): Image URLs separated by commas.</li>
              <li><strong>author</strong> (Optional): Name of the writer.</li>
              <li><strong>genres</strong> (Optional): Comma-separated tags.</li>
              <li><strong>kind</strong> (Optional): <code className="bg-white/80 px-1 rounded font-bold">book</code> or <code className="bg-white/80 px-1 rounded font-bold">bookmark</code>.</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Preview & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {summary.total > 0 && !importResult && (
            <div className="bg-primary-border/20 border border-primary-text/10 p-5 rounded-2xl space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="opacity-60 block text-xs font-semibold">Total Rows</span>
                    <span className="font-bold text-lg text-primary-text">{summary.total}</span>
                  </div>
                  <div>
                    <span className="opacity-60 block text-xs font-semibold">Valid Rows</span>
                    <span className="font-bold text-lg text-green-600">{summary.valid}</span>
                  </div>
                  <div>
                    <span className="opacity-60 block text-xs font-semibold">Invalid Rows</span>
                    <span className="font-bold text-lg text-red-600">{summary.invalid}</span>
                  </div>
                </div>

                <button
                  onClick={handleImport}
                  disabled={validProducts.length === 0 || isPending}
                  className="bg-primary-text text-white font-bold text-sm p-3 px-6 rounded-xl flex gap-2 items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      Import {validProducts.length} Products
                    </>
                  )}
                </button>
              </div>

              {/* Preview Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Parsed Preview (First 10 Rows)
                </h3>
                <div className="overflow-x-auto rounded-xl border border-primary-text/10 bg-white">
                  <table className="w-full text-xs">
                    <thead className="bg-primary-border/40 border-b border-primary-text/10">
                      <tr>
                        <th className="px-4 py-2 text-left">Row</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Stock</th>
                        <th className="px-4 py-2 text-left">Author</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-text/10">
                      {previewRows.slice(0, 10).map((row, index) => (
                        <tr key={index} className={row.isValid ? "" : "bg-red-500/5 text-red-700"}>
                          <td className="px-4 py-3 font-semibold">{row.rowNum}</td>
                          <td className="px-4 py-3 font-medium truncate max-w-[120px]">{row.data.name || "(Empty)"}</td>
                          <td className="px-4 py-3">₹{row.data.price}</td>
                          <td className="px-4 py-3">{row.data.stock}</td>
                          <td className="px-4 py-3 truncate max-w-[80px]">{row.data.author || "-"}</td>
                          <td className="px-4 py-3">
                            {row.isValid ? (
                              <span className="text-green-600 font-bold flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Valid
                              </span>
                            ) : (
                              <span className="text-red-600 font-bold flex items-center gap-1" title={row.errors.join(", ")}>
                                <AlertTriangle size={12} />
                                Invalid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Import Complete Summary */}
          {importResult && (
            <div className="bg-primary-border/20 border border-primary-text/10 p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary-text">Bulk Import Complete</h2>
                  <p className="text-xs opacity-60">Products upsert process finished successfully</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white border border-primary-text/10 rounded-xl p-3">
                  <span className="text-xs opacity-60 block">New Created</span>
                  <span className="text-xl font-bold text-green-600">{importResult.createdCount}</span>
                </div>
                <div className="bg-white border border-primary-text/10 rounded-xl p-3">
                  <span className="text-xs opacity-60 block">Existing Updated</span>
                  <span className="text-xl font-bold text-blue-600">{importResult.updatedCount}</span>
                </div>
                <div className="bg-white border border-primary-text/10 rounded-xl p-3">
                  <span className="text-xs opacity-60 block">Failed Rows</span>
                  <span className="text-xl font-bold text-red-600">{importResult.failedCount}</span>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Row Error Logs ({importResult.errors.length})
                  </h3>
                  <div className="bg-red-500/5 border border-red-500/20 text-red-800 text-[11px] rounded-xl p-4 max-h-[200px] overflow-y-scroll space-y-1.5 font-mono">
                    {importResult.errors.map((err, index) => (
                      <p key={index}>{err}</p>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href="/admin/products"
                className="bg-primary-text text-white font-semibold text-center block w-full py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                Go to Products Inventory
              </Link>
            </div>
          )}

          {!fileName && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-primary-text/20 rounded-2xl bg-primary-border/5">
              <Upload className="w-10 h-10 opacity-30 text-primary-text" />
              <div>
                <h3 className="text-sm font-bold text-primary-text">No File Selected</h3>
                <p className="text-xs opacity-60 max-w-xs mt-1">
                  Upload a CSV file containing your product records to preview formatting and validate data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVImportPage;
