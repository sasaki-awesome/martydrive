/* =========================================
   MARTY DRIVE Wholesale Portal – Admin JS
   ========================================= */

const EMOJIS = ["👕","🧥","🧢","🔑","🎒","🪆","🖼️","📓","✏️","🗒️","🧲","📦","🎽","👟","🧣","🚗","🛸","🚀","🤖","💎","🎁","📌","🎨","✨"];

let editingId  = null;
let deleteId   = null;
let selectedEmoji = "📦";
let uploadedImg   = null;

/* ---- INIT ---- */
(function init() {
  checkAuth();

  /* セッションに保存済みの商品データがあれば復元 */
  const saved = sessionStorage.getItem("mc_products");
  if (saved) {
    try { Object.assign(products, JSON.parse(saved)); products.length = JSON.parse(saved).length; products.splice(0); JSON.parse(saved).forEach(p => products.push(p)); } catch(e){}
  }

  renderTable();
})();

/* ---- PERSIST ---- */
function saveToSession() {
  sessionStorage.setItem("mc_products", JSON.stringify(products));
}

/* ---- TABLE ---- */
function renderTable() {
  const q  = document.getElementById("sq").value.toLowerCase();
  const cf = document.getElementById("cat-filter").value;

  const list = products.filter(p => {
    const cok = cf === "all" || p.cat === cf;
    const qok = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
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
          ${p.img ? `<img src="${p.img}" alt="">` : p.e1}
        </div>
      </td>
      <td>
        <div class="td-name">${p.name}</div>
        <div class="td-desc">${p.desc}</div>
      </td>
      <td><span class="td-cat">${CAT[p.cat]}</span></td>
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

/* ---- EMOJI ---- */
function buildEmojiRow() {
  const row = document.getElementById("emoji-row");
  row.innerHTML = EMOJIS.map(e => `
    <span class="emoji-opt${e === selectedEmoji ? " sel" : ""}"
          onclick="selectEmoji('${e}')">${e}</span>
  `).join("");
}

function selectEmoji(e) {
  selectedEmoji = e;
  uploadedImg   = null;
  showPreviewEmoji(e);
  buildEmojiRow();
}

/* ---- IMAGE UPLOAD ---- */
function handleImgUpload(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = r => {
    uploadedImg = r.result;
    showPreviewImg(uploadedImg);
  };
  reader.readAsDataURL(file);
}

/* ---- DRAWER ---- */
function resetPreview() {
  /* 既存のプレビュー画像を完全にクリア */
  const oldImg = document.getElementById("preview-img-el");
  if (oldImg) oldImg.remove();
  /* ファイル入力もリセット */
  const fi = document.getElementById("img-file");
  if (fi) fi.value = "";
  uploadedImg = null;
}

function showPreviewImg(src) {
  /* 画像プレビューを表示し絵文字を隠す */
  document.getElementById("preview-emoji").style.display = "none";
  let img = document.getElementById("preview-img-el");
  if (!img) {
    img = document.createElement("img");
    img.id = "preview-img-el";
    img.className = "img-preview";
    img.style.cssText = "width:80px;height:80px;border-radius:8px;object-fit:cover;margin:0 auto 8px;display:block;";
    document.getElementById("img-preview-wrap").prepend(img);
  }
  img.src = src;
}

function showPreviewEmoji(e) {
  /* 絵文字プレビューを表示し画像を隠す */
  const old = document.getElementById("preview-img-el");
  if (old) old.remove();
  const emojiEl = document.getElementById("preview-emoji");
  emojiEl.textContent = e;
  emojiEl.style.display = "block";
}

function openDrawer(id) {
  editingId = id;
  resetPreview();

  if (id === null) {
    /* 新規追加 */
    document.getElementById("drawer-title").textContent = "商品を追加";
    selectedEmoji = "📦";
    showPreviewEmoji("📦");
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

    if (p.img) {
      /* 保存済み画像がある場合 */
      uploadedImg = p.img;
      showPreviewImg(p.img);
    } else {
      /* 絵文字のみの場合 */
      showPreviewEmoji(selectedEmoji);
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
    e1: selectedEmoji,
    e2: "📦",
    img: uploadedImg || null,
  };

  if (editingId === null) {
    data.id = Date.now();
    products.push(data);
    showToast("✅ 商品を追加しました");
  } else {
    const idx = products.findIndex(x => x.id === editingId);
    products[idx] = { ...products[idx], ...data };
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

/* ---- TOAST ---- */
function showToast(msg, color = "var(--green)") {
  const t = document.getElementById("toast");
  t.textContent  = msg;
  t.style.background = color;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}
