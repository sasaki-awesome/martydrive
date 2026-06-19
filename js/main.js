/* =========================================
   MARTY DRIVE Wholesale Portal – Shared JS
   ========================================= */

const ACCOUNT = "oweners";
const PASS    = "marty2025";

const CAT = {
  apparel:    "アパレル",
  goods:      "雑貨・小物",
  stationery: "文具・ノベルティ",
  other:      "その他"
};

const products = [
  {
    id:1, cat:"apparel", e1:"👕", e2:"🎨",
    name:"Marty Drive Tシャツ",
    colors:"キャラはオーナー様によって変わります。カラーも自由に選択いただけます。",
    retail:"なし", price:"1,200円", lot:30, lead:"約30日",
    material:"コットン100%", size:"S / M / L / XL / XXL",
    desc:"Marty DriveのメインキャラクターをフロントにプリントしたオリジナルTシャツ。企業ロゴの追加プリントも可能です。",
    isnew:false
  },
  {
    id:2, cat:"apparel", e1:"🧥", e2:"✨",
    name:"Marty Drive パーカー",
    colors:"キャラはオーナー様によって変わります。カラーはブラック・ネイビー・グレーからお選びいただけます。",
    retail:"なし", price:"2,800円", lot:30, lead:"約35日",
    material:"コットン80% ポリエステル20%", size:"S / M / L / XL / XXL",
    desc:"裏起毛で暖かいプルオーバーパーカー。バックプリントと胸元の刺繍ロゴを組み合わせた高品質な仕上がり。",
    isnew:true
  },
  {
    id:3, cat:"apparel", e1:"🧢", e2:"🎩",
    name:"Marty Drive キャップ",
    colors:"ブラック・ホワイトからお選びいただけます。",
    retail:"なし", price:"1,500円", lot:50, lead:"約30日",
    material:"コットン100%", size:"フリーサイズ（調整可）",
    desc:"フロントにマーティー刺繍、バックにブランドロゴ入りのストラップバックキャップ。",
    isnew:false
  },
  {
    id:4, cat:"goods", e1:"🔑", e2:"💎",
    name:"アクリルキーホルダー",
    colors:"キャラはオーナー様によって変わります。カラーも自由に選択いただけます。",
    retail:"なし", price:"300円", lot:100, lead:"約20日",
    material:"アクリル", size:"幅40mm × 高さ40mm × 厚み5mm",
    desc:"フルカラーUV印刷のアクリルキーホルダー。Martyキャラクターを鮮やかに表現。ノベルティに最適。商品画像はイメージになります。",
    isnew:false
  },
  {
    id:5, cat:"goods", e1:"🎒", e2:"👜",
    name:"トートバッグ",
    colors:"ナチュラル・ブラックからお選びいただけます。",
    retail:"なし", price:"600円", lot:50, lead:"約25日",
    material:"キャンバス（8oz）", size:"W380 × H420 × D100mm",
    desc:"マチ付きの使いやすいキャンバストートバッグ。Marty Driveのイラストをシルクスクリーン印刷。",
    isnew:false
  },
  {
    id:6, cat:"goods", e1:"🪆", e2:"🤖",
    name:"フィギュア（ミニ）",
    colors:"成形色＋塗装。カラーはご相談ください。",
    retail:"なし", price:"1,800円", lot:100, lead:"約60日",
    material:"PVC", size:"高さ約80mm",
    desc:"Marty Driveの世界観を立体化したコレクタブルフィギュア。企業ノベルティとして高い訴求力。商品画像はイメージになります。",
    isnew:true
  },
  {
    id:7, cat:"goods", e1:"🖼️", e2:"🚗",
    name:"ステッカーパック（5枚組）",
    colors:"フルカラー印刷。キャラはオーナー様によって変わります。",
    retail:"なし", price:"250円", lot:200, lead:"約15日",
    material:"ビニール防水素材", size:"各50〜80mm",
    desc:"防水・耐UV加工済みのビニールステッカー5枚セット。車やPCにも貼れる高品質素材。",
    isnew:false
  },
  {
    id:8, cat:"stationery", e1:"📓", e2:"📖",
    name:"ノートブック A5",
    colors:"表紙フルカラー印刷。キャラはオーナー様によって変わります。",
    retail:"なし", price:"500円", lot:50, lead:"約25日",
    material:"用紙80g/m²", size:"A5（148 × 210mm）80枚",
    desc:"Marty Driveデザインの表紙を採用したA5ノート。企業名・ロゴを裏表紙に入れることも可能。",
    isnew:false
  },
  {
    id:9, cat:"stationery", e1:"✏️", e2:"🖊️",
    name:"ボールペン",
    colors:"ブラック軸・ホワイト軸からお選びいただけます。",
    retail:"なし", price:"180円", lot:100, lead:"約20日",
    material:"プラスチック軸", size:"全長148mm",
    desc:"ワンポイントのMartyロゴ入りボールペン。ビジネスシーンでも使えるシンプルなデザイン。",
    isnew:false
  },
  {
    id:10, cat:"stationery", e1:"🗒️", e2:"📋",
    name:"付箋セット",
    colors:"3色アソート。カラーはご相談ください。",
    retail:"なし", price:"350円", lot:100, lead:"約20日",
    material:"上質紙", size:"75×75mm × 50枚 × 3冊",
    desc:"Martyキャラクター柄の付箋3冊セット。デスク周りを彩るオフィスノベルティに。",
    isnew:false
  },
  {
    id:11, cat:"other", e1:"🧲", e2:"📌",
    name:"缶バッジセット（3個）",
    colors:"フルカラー印刷。キャラはオーナー様によって変わります。",
    retail:"なし", price:"300円", lot:200, lead:"約15日",
    material:"ブリキ缶", size:"直径57mm",
    desc:"Marty Driveキャラクターの缶バッジ3個セット。イベント配布・限定グッズとして人気。",
    isnew:true
  },
  {
    id:12, cat:"other", e1:"📦", e2:"🎁",
    name:"ギフトボックスセット",
    colors:"内容に合わせてご相談ください。",
    retail:"なし", price:"3,500円〜", lot:30, lead:"約45日",
    material:"各種", size:"W210 × H60 × D297mm 程度",
    desc:"Tシャツ・ステッカー・缶バッジを詰め合わせたギフトセット。取引先への贈答品や周年記念に。",
    isnew:false
  }
];

/* ---------- auth helpers ---------- */
function checkAuth() {
  if (sessionStorage.getItem("mc_auth") !== "1") {
    window.location.href = "index.html";
  }
}
function doLogout() {
  sessionStorage.removeItem("mc_auth");
  window.location.href = "index.html";
}

/* ---------- nav active ---------- */
function setActiveNav(id) {
  document.querySelectorAll(".n-tab").forEach(t => t.classList.remove("on"));
  const el = document.getElementById(id);
  if (el) el.classList.add("on");
}

/* ---------- modal ---------- */
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  document.getElementById("m-imgs").innerHTML = `
    <div class="m-img-main">${p.e1}</div>
    <div class="m-img-sub">${p.e2}</div>
  `;
  document.getElementById("m-info").innerHTML = `
    <div class="m-cat">${CAT[p.cat]}</div>
    <div class="m-title">${p.name}</div>
    <div class="m-tags">
      <span class="m-tag t1">税込表示</span>
      <span class="m-tag t2">最低ロット ${p.lot}</span>
      ${p.isnew ? '<span class="m-tag tnew">NEW</span>' : ""}
    </div>
    <p class="m-desc">${p.desc}</p>
    <p class="m-note">商品画像はイメージになります。</p>
    <div class="m-price-row">
      <div class="m-pb"><div class="m-pb-lbl">定価</div><div class="m-pb-val">${p.retail}</div></div>
      <div class="m-pb"><div class="m-pb-lbl">卸値</div><div class="m-pb-val whl">${p.price}</div></div>
      <div class="m-pb"><div class="m-pb-lbl">最低ロット</div><div class="m-pb-val lot">${p.lot}</div></div>
    </div>
    <div class="m-section">
      <div class="m-section-ttl">カラー</div>
      <div class="m-color-box">${p.colors}</div>
    </div>
    <div class="m-section">
      <div class="m-section-ttl">素材・サイズ</div>
      <div class="m-spec-row">素材：${p.material}</div>
      <div class="m-spec-row">サイズ：${p.size}</div>
      <div class="m-spec-row">納期目安：${p.lead}</div>
    </div>
  `;
  document.getElementById("modal").classList.add("on");
}
function closeModal() {
  document.getElementById("modal").classList.remove("on");
}
