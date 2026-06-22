/* =========================================
   MARTY DRIVE Wholesale Portal – Admin JS
   ========================================= */

const EMOJIS = ["👕","🧥","🧢","🔑","🎒","🪆","🖼️","📓","✏️","🗒️","🧲","📦","🎽","👟","🧣","🚗","🛸","🚀","🤖","💎","🎁","📌","🎨","✨"];

let editingId   = null;
let deleteId    = null;
let selectedEmoji = "📦";
let uploadedImg   = null;   /* base64 or null */

/* ---- INIT ---- */
(function init() {
  /* 認証はadmin.htmlのadminAuthCheck()が担当 */
  const saved = localStorage.getItem("md_products");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      products.splice(0, products.length, ...parsed);
    } catch(e) { console.warn("restore failed", e); }
  }
  renderTable();
})();

/* ---- SESSION PERSIST ---- */
function saveToSession() {
  localStorage.setItem("md_products", JSON.stringify(products));
}

/* =========================================
   PREVIEW HELPERS
   img タグは最初から HTML に存在し、
   JS は src と display だけ切り替える
   ========================================= */
function previewShowEmoji(e) {
  document.getElementById("prev-emoji").textContent  = e;
  document.getElementById("prev-emoji").style.display = "block";
  document.getElementById("prev-img").style.display   = "none";
  document.getElementById("prev-img").src             = "";
}

function previewShowImage(src) {
  document.getElementById("prev-emoji").style.display = "none";
  document.getElementById("prev-img").src             = src;
  document.getElementById("prev-img").style.display   = "block";
}

function previewReset() {
  uploadedImg = null;
  document.getElementById("img-file").value = "";
  previewShowEmoji(selectedEmoji);
}

/* ---- EMOJI PICKER ---- */
function buildEmojiRow() {
  document.getElementById("emoji-row").innerHTML = EMOJIS.map(e =>
    `<span class="emoji-opt${e === selectedEmoji ? " sel" : ""}"
           onclick="selectEmoji('${e}')">${e}</span>`
  ).join("");
}

function selectEmoji(e) {
  selectedEmoji = e;
  uploadedImg   = null;
  document.getElementById("img-file").value = "";
  previewShowEmoji(e);
  buildEmojiRow();
}

/* ---- IMAGE UPLOAD ---- */
function triggerFileSelect() {
  document.getElementById("img-file").click();
}

function handleImgUpload(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  /* サイズ上限 5MB */
  if (file.size > 5 * 1024 * 1024) {
    alert("画像サイズは5MB以下にしてください");
    ev.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = function(r) {
    uploadedImg = r.target.result;
    previewShowImage(uploadedImg);
  };
  reader.onerror = function() {
    alert("画像の読み込みに失敗しました");
    ev.target.value = "";
  };
  reader.readAsDataURL(file);
}

/* ---- TABLE ---- */
function renderTable() {
  const q  = document.getElementById("sq").value.toLowerCase();
  const cf = document.getElementById("cat-filter").value;

  const list = products.filter(p => {
    const cok = cf === "all" || p.cat === cf;
    const qok = !q || p.name.toLowerCase().includes(q) || (p.desc||"").toLowerCase().includes(q);
    return cok && qok;
  });

  document.getElementById("count-label").textContent = `${list.length} / ${products.length} 件`;

  const tb = document.getElementById("tbody");
  if (!list.length) {
    tb.innerHTML = '<tr class="empty-row"><td colspan="7">該当する商品が見つかりませんでした</td></tr>';
    return;
  }

  tb.innerHTML = list.map(p => `
    <tr>
      <td>
        <div class="td-img">
          ${p.img
            ? `<img src="${p.img}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`
            : `<span style="font-size:26px;">${p.e1 || "📦"}</span>`
          }
        </div>
      </td>
      <td>
        <div class="td-name">${p.name}</div>
        <div class="td-desc">${p.desc || ""}</div>
      </td>
      <td><span class="td-cat">${CAT[p.cat] || p.cat}</span></td>
      <td><span class="td-price">${p.price}</span></td>
      <td><span class="td-lot">${p.lot}個〜</span></td>
      <td>${p.isnew ? '<span class="td-new">NEW</span>' : "—"}</td>
      <td>
        <div class="act-btns">
          <button class="btn-edit" onclick="openDrawer(${p.id})">編集</button>
          <button class="btn-del"  onclick="openConfirm(${p.id})">削除</button>
        </div>
      </td>
    </tr>
  `).join("");
}

/* ---- DRAWER OPEN ---- */
function openDrawer(id) {
  editingId = id;

  if (id === null) {
    /* 新規 */
    document.getElementById("drawer-title").textContent = "商品を追加";
    selectedEmoji = "📦";
    uploadedImg   = null;
    previewShowEmoji("📦");

    document.getElementById("f-name").value     = "";
    document.getElementById("f-desc").value     = "";
    document.getElementById("f-cat").value      = "apparel";
    document.getElementById("f-retail").value   = "なし";
    document.getElementById("f-price").value    = "";
    document.getElementById("f-lot").value      = "";
    document.getElementById("f-lead").value     = "";
    document.getElementById("f-material").value = "";
    document.getElementById("f-size").value     = "";
    document.getElementById("f-colors").value   = "";
    document.getElementById("f-new").checked    = false;
  } else {
    /* 編集 */
    const p = products.find(x => x.id === id);
    if (!p) return;

    document.getElementById("drawer-title").textContent = "商品を編集";
    selectedEmoji = p.e1 || "📦";
    uploadedImg   = p.img || null;

    /* プレビュー：画像があれば画像、なければ絵文字 */
    if (p.img) {
      previewShowImage(p.img);
    } else {
      previewShowEmoji(selectedEmoji);
    }

    document.getElementById("f-name").value     = p.name     || "";
    document.getElementById("f-desc").value     = p.desc     || "";
    document.getElementById("f-cat").value      = p.cat      || "apparel";
    document.getElementById("f-retail").value   = p.retail   || "なし";
    document.getElementById("f-price").value    = p.price    || "";
    document.getElementById("f-lot").value      = p.lot      || "";
    document.getElementById("f-lead").value     = p.lead     || "";
    document.getElementById("f-material").value = p.material || "";
    document.getElementById("f-size").value     = p.size     || "";
    document.getElementById("f-colors").value   = p.colors   || "";
    document.getElementById("f-new").checked    = p.isnew    || false;
  }

  document.getElementById("img-file").value = "";
  buildEmojiRow();
  document.getElementById("drawer-back").classList.add("on");
}

function closeDrawer() {
  document.getElementById("drawer-back").classList.remove("on");
}

/* ---- SAVE ---- */
function saveProduct() {
  const name  = document.getElementById("f-name").value.trim();
  const price = document.getElementById("f-price").value.trim();
  const lot   = parseInt(document.getElementById("f-lot").value) || 0;

  if (!name || !price || !lot) {
    showToast("⚠️ 商品名・卸値・最低ロットは必須です", "#f5c842");
    return;
  }

  const data = {
    name,
    desc:     document.getElementById("f-desc").value.trim(),
    cat:      document.getElementById("f-cat").value,
    retail:   document.getElementById("f-retail").value.trim() || "なし",
    price, lot,
    lead:     document.getElementById("f-lead").value.trim(),
    material: document.getElementById("f-material").value.trim(),
    size:     document.getElementById("f-size").value.trim(),
    colors:   document.getElementById("f-colors").value.trim(),
    isnew:    document.getElementById("f-new").checked,
    e1:       selectedEmoji,
    e2:       "📦",
    img:      uploadedImg || null,
  };

  if (editingId === null) {
    data.id = Date.now();
    products.push(data);
    showToast("✅ 商品を追加しました");
  } else {
    const idx = products.findIndex(x => x.id === editingId);
    if (idx !== -1) products[idx] = { ...products[idx], ...data };
    showToast("✅ 商品を更新しました");
  }

  saveToSession();
  closeDrawer();
  renderTable();
}

/* ---- DELETE ---- */
function openConfirm(id) {
  deleteId = id;
  const p  = products.find(x => x.id === id);
  document.getElementById("del-msg").textContent =
    `「${p.name}」を削除します。この操作は元に戻せません。`;
  document.getElementById("del-back").classList.add("on");
}

function closeConfirm() {
  document.getElementById("del-back").classList.remove("on");
}

function confirmDelete() {
  const idx = products.findIndex(x => x.id === deleteId);
  if (idx !== -1) products.splice(idx, 1);
  saveToSession();
  closeConfirm();
  renderTable();
  showToast("🗑️ 商品を削除しました", "#f07070");
}

/* ---- EXPORT JSON ---- */
function exportJSON() {
  const data = JSON.stringify(products, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "marty_products.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("💾 JSONをエクスポートしました");
}

/* =========================================
   CSV EXPORT
   ========================================= */
const CSV_COLS = [
  { key:"id",       label:"ID" },
  { key:"name",     label:"商品名" },
  { key:"cat",      label:"カテゴリ" },
  { key:"desc",     label:"商品説明" },
  { key:"retail",   label:"定価" },
  { key:"price",    label:"卸値" },
  { key:"lot",      label:"最低ロット" },
  { key:"lead",     label:"納期目安" },
  { key:"material", label:"素材" },
  { key:"size",     label:"サイズ" },
  { key:"colors",   label:"カラー展開" },
  { key:"isnew",    label:"NEWバッジ" },
  { key:"e1",       label:"絵文字" },
];

function csvEscape(val) {
  const s = String(val == null ? "" : val);
  /* ダブルクォート・カンマ・改行を含む場合はクォートで囲む */
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function exportCSV() {
  const header = CSV_COLS.map(c => csvEscape(c.label)).join(",");
  const rows   = products.map(p =>
    CSV_COLS.map(c => {
      const v = p[c.key];
      if (c.key === "isnew") return v ? "TRUE" : "FALSE";
      return csvEscape(v);
    }).join(",")
  );
  const bom  = "\uFEFF"; /* Excel用BOM */
  const csv  = bom + [header, ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "marty_products.csv";
  a.click();
  URL.revokeObjectURL(url);
  showToast("📄 CSVをエクスポートしました");
}

/* =========================================
   CSV IMPORT
   ========================================= */
let _csvParsed = []; /* インポート確認前の一時保存 */

function importCSV(ev) {
  const file = ev.target.files[0];
  ev.target.value = ""; /* 同じファイルを再選択できるようリセット */
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const text = e.target.result
        .replace(/^\uFEFF/, "")   /* BOM除去 */
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");

      const lines  = splitCSVLines(text);
      if (lines.length < 2) { showToast("⚠️ データが空です", "#f5c842"); return; }

      const header = parseCSVRow(lines[0]).map(h => h.trim());
      const rows   = lines.slice(1).filter(l => l.trim() !== "");

      _csvParsed = rows.map((row, i) => {
        const vals = parseCSVRow(row);
        const obj  = {};
        header.forEach((h, idx) => { obj[h] = (vals[idx] || "").trim(); });

        /* CSV列名→内部キーのマッピング */
        const colMap = {};
        CSV_COLS.forEach(c => { colMap[c.label] = c.key; });

        const p = {};
        Object.keys(obj).forEach(h => {
          const key = colMap[h] || h;
          p[key] = obj[h];
        });

        /* 型変換 */
        p.id     = p.id ? Number(p.id) : Date.now() + i;
        p.lot    = parseInt(p.lot) || 0;
        p.isnew  = String(p.isnew).toUpperCase() === "TRUE";
        p.img    = p.img || null;
        p.e1     = p.e1 || "📦";
        p.e2     = p.e2 || "📦";
        if (!p.retail) p.retail = "なし";

        return p;
      }).filter(p => p.name); /* 商品名のない行は除外 */

      if (!_csvParsed.length) { showToast("⚠️ 有効なデータが見つかりません", "#f5c842"); return; }

      /* 確認モーダル表示 */
      document.getElementById("csv-confirm-msg").textContent =
        `${_csvParsed.length} 件の商品データを読み込みました。どちらのモードで取り込みますか？`;
      document.getElementById("csv-confirm-back").classList.add("on");

    } catch(err) {
      console.error(err);
      showToast("⚠️ CSV読み込みエラー：形式を確認してください", "#f07070");
    }
  };
  reader.readAsText(file, "UTF-8");
}

function executeCsvImport(mode) {
  if (mode === "overwrite") {
    products.splice(0, products.length, ..._csvParsed);
    showToast(`✅ ${_csvParsed.length}件で上書きしました`);
  } else {
    /* IDが重複する場合は既存を上書き、新規はpush */
    _csvParsed.forEach(np => {
      const idx = products.findIndex(p => p.id === np.id);
      if (idx !== -1) products[idx] = { ...products[idx], ...np };
      else products.push(np);
    });
    showToast(`✅ ${_csvParsed.length}件を追加しました`);
  }
  _csvParsed = [];
  saveToSession();
  closeCsvConfirm();
  renderTable();
}

function closeCsvConfirm() {
  document.getElementById("csv-confirm-back").classList.remove("on");
  _csvParsed = [];
}

/* CSV行を正しくパースする（クォート内のカンマ・改行対応） */
function splitCSVLines(text) {
  const lines = [];
  let cur = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { inQ = !inQ; cur += c; }
    else if (c === '\n' && !inQ) { lines.push(cur); cur = ""; }
    else { cur += c; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function parseCSVRow(line) {
  const fields = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i+1] === '"') { cur += '"'; i++; }
      else { inQ = !inQ; }
    } else if (c === ',' && !inQ) {
      fields.push(cur); cur = "";
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

/* ---- TOAST ---- */
function showToast(msg, color = "var(--green)") {
  const t = document.getElementById("toast");
  t.textContent      = msg;
  t.style.background = color;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}
