/* ═══════════════════════════════════════════════════════════════════════════
   Dizzy Toad Woodworks — Admin panel
   ---------------------------------------------------------------------------
   A self-contained, no-backend editor for the catalog. Vic logs in (soft
   password gate), flips pieces available ↔ sold, edits prices and details,
   adds new pieces, and uploads photos (multiple per piece, auto-shrunk and
   embedded right in the data). Edits live in this browser until he hits
   "Publish", which downloads a fresh pieces.js to upload to the host.

   Talks to the page only through window.DT (exposed by index.html).
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

if (!window.DT) { console.warn('[admin] window.DT not found — admin disabled'); return; }
var DT = window.DT;
var ADMIN_FLAG = 'dt_admin';
var adminMode = false;
var dirty = false;
function supa(){ return DT.supa || window.dtSupa || null; }

/* ── tiny DOM helpers ─────────────────────────────────────────────────── */
function h(tag, attrs, kids){
  var e = document.createElement(tag);
  if (attrs) Object.keys(attrs).forEach(function(k){
    if (k==='class') e.className=attrs[k];
    else if (k==='html') e.innerHTML=attrs[k];
    else if (k==='text') e.textContent=attrs[k];
    else if (k.slice(0,2)==='on') e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
    else if (attrs[k]!=null) e.setAttribute(k, attrs[k]);
  });
  (kids||[]).forEach(function(c){ if(c) e.appendChild(typeof c==='string'?document.createTextNode(c):c); });
  return e;
}
function $(sel, root){ return (root||document).querySelector(sel); }

/* ── styles (use the page's theme variables) ─────────────────────────── */
function injectStyles(){
  var css = ''
  + '.dt-trigger{position:fixed;left:10px;bottom:10px;z-index:400;font:600 .72rem Georgia,serif;'
  +   'color:var(--muted);background:var(--card);border:1px solid var(--border);border-radius:100px;'
  +   'padding:.3rem .7rem;cursor:pointer;opacity:.55}'
  + '.dt-trigger:hover{opacity:1}'
  + '.dt-overlay{position:fixed;inset:0;z-index:500;background:rgba(20,12,6,.65);display:flex;'
  +   'align-items:flex-start;justify-content:center;overflow-y:auto;padding:1.5rem 1rem}'
  + '.dt-card{background:var(--surface);color:var(--text);border-radius:16px;max-width:560px;width:100%;'
  +   'padding:1.5rem;box-shadow:0 20px 60px rgba(0,0,0,.4)}'
  + '.dt-card h3{font:800 1.3rem Georgia,serif;margin:0 0 .25rem}'
  + '.dt-card .dt-sub{color:var(--muted);font-size:.9rem;margin-bottom:1.1rem}'
  + '.dt-field{margin-bottom:.85rem}'
  + '.dt-field label{display:block;font:700 .75rem Georgia,serif;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.3rem}'
  + '.dt-field input,.dt-field select,.dt-field textarea{width:100%;font:1rem Georgia,serif;color:var(--text);'
  +   'background:var(--card);border:1.5px solid var(--border);border-radius:9px;padding:.55rem .7rem}'
  + '.dt-field textarea{resize:vertical;min-height:64px}'
  + '.dt-row{display:flex;gap:.7rem}.dt-row>.dt-field{flex:1}'
  + '.dt-photos{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:.3rem}'
  + '.dt-thumb{position:relative;width:80px;height:80px;border-radius:9px;overflow:hidden;border:1.5px solid var(--border);background:var(--wood)}'
  + '.dt-thumb img{width:100%;height:100%;object-fit:cover}'
  + '.dt-thumb .dt-cover{position:absolute;top:2px;left:2px;background:var(--amber);color:#2c1a0e;font:800 .6rem Georgia,serif;'
  +   'border-radius:4px;padding:1px 4px}'
  + '.dt-thumb button{position:absolute;border:none;cursor:pointer;font:800 .7rem Georgia,serif}'
  + '.dt-thumb .dt-x{top:2px;right:2px;width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;line-height:1}'
  + '.dt-thumb .dt-star{bottom:2px;left:2px;background:rgba(0,0,0,.55);color:#fff;border-radius:4px;padding:1px 4px}'
  + '.dt-addphoto{width:80px;height:80px;border:1.5px dashed var(--border);border-radius:9px;background:transparent;'
  +   'color:var(--muted);cursor:pointer;font:700 .72rem Georgia,serif;display:flex;align-items:center;justify-content:center;text-align:center}'
  + '.dt-actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.3rem}'
  + '.dt-btn{font:700 .95rem Georgia,serif;border:none;border-radius:100px;padding:.65rem 1.3rem;cursor:pointer}'
  + '.dt-btn-primary{background:var(--amber);color:#2c1a0e}'
  + '.dt-btn-ghost{background:transparent;color:var(--text);border:1.5px solid var(--border)}'
  + '.dt-btn-danger{background:transparent;color:#c0392b;border:1.5px solid #c0392b;margin-left:auto}'
  + '.dt-err{color:#c0392b;font-size:.85rem;margin-top:.4rem;min-height:1rem}'
  + '.dt-toolbar{position:fixed;left:0;right:0;bottom:0;z-index:420;background:var(--walnut-deep);color:var(--cream);'
  +   'display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;padding:.6rem .9rem;box-shadow:0 -6px 24px rgba(0,0,0,.3)}'
  + '.dt-toolbar .dt-tlabel{font:700 .85rem Georgia,serif;margin-right:auto;display:flex;align-items:center;gap:.5rem}'
  + '.dt-toolbar .dt-dot{width:8px;height:8px;border-radius:50%;background:#9c9;display:inline-block}'
  + '.dt-toolbar .dt-dot.on{background:var(--amber)}'
  + '.dt-tbtn{font:700 .85rem Georgia,serif;border:none;border-radius:100px;padding:.45rem 1rem;cursor:pointer;background:rgba(244,236,221,.15);color:var(--cream)}'
  + '.dt-tbtn.go{background:var(--amber);color:#2c1a0e}'
  + 'body.dt-on{padding-bottom:64px}'
  + '.dt-edit-btn{position:absolute;top:8px;left:8px;z-index:5;background:var(--amber);color:#2c1a0e;border:none;'
  +   'border-radius:100px;font:800 .72rem Georgia,serif;padding:.3rem .7rem;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)}'
  + '.dt-quick{position:absolute;top:8px;right:8px;z-index:5;display:flex;gap:.3rem}'
  + '.dt-quick button{background:rgba(0,0,0,.6);color:#fff;border:none;border-radius:100px;font:700 .68rem Georgia,serif;padding:.28rem .6rem;cursor:pointer}';
  document.head.appendChild(h('style',{html:css}));
}

/* ── overlay/modal plumbing ──────────────────────────────────────────── */
var openOverlay=null;
function modal(node){
  closeModal();
  var ov=h('div',{class:'dt-overlay', onclick:function(e){ if(e.target===ov) closeModal(); }},[node]);
  document.body.appendChild(ov); openOverlay=ov;
  document.addEventListener('keydown', escClose);
  return ov;
}
function closeModal(){ if(openOverlay){ openOverlay.remove(); openOverlay=null; document.removeEventListener('keydown', escClose);} }
function escClose(e){ if(e.key==='Escape') closeModal(); }

/* ── login (Supabase email + password) ───────────────────────────────── */
function openLogin(){
  var email=h('input',{type:'email', placeholder:'you@example.com', autocomplete:'username'});
  var pass=h('input',{type:'password', placeholder:'Password', autocomplete:'current-password',
    onkeydown:function(e){ if(e.key==='Enter') tryLogin(); }});
  var err=h('div',{class:'dt-err'});
  var btn;
  function tryLogin(){
    var s=supa();
    if(!s){ err.textContent='Sign-in is offline right now — try again in a moment.'; return; }
    err.textContent='Signing in…'; if(btn) btn.disabled=true;
    s.auth.signInWithPassword({ email:(email.value||'').trim(), password:pass.value })
      .then(function(res){
        if(btn) btn.disabled=false;
        if(res.error){ err.textContent=res.error.message||'That didn’t work — check your email and password.'; pass.value=''; pass.focus(); return; }
        closeModal(); enterAdmin();
      })
      .catch(function(){ if(btn) btn.disabled=false; err.textContent='Sign-in failed — check your connection.'; });
  }
  btn=h('button',{class:'dt-btn dt-btn-primary', onclick:tryLogin, text:'Sign in'});
  var card=h('div',{class:'dt-card'},[
    h('h3',{text:'Admin sign-in'}),
    h('div',{class:'dt-sub',text:'Sign in to manage your pieces. Changes go live instantly — no extra steps.'}),
    field('Email', email),
    field('Password', pass),
    err,
    h('div',{class:'dt-actions'},[ btn,
      h('button',{class:'dt-btn dt-btn-ghost', onclick:closeModal, text:'Cancel'})
    ])
  ]);
  modal(card);
  setTimeout(function(){ email.focus(); }, 30);
}

function enterAdmin(){
  try{ localStorage.setItem(ADMIN_FLAG,'1'); }catch(e){}
  adminMode=true;
  document.body.classList.add('dt-on');
  buildToolbar();
  decorateCards();
}
function exitAdmin(){
  var s=supa(); if(s){ try{ s.auth.signOut(); }catch(e){} }
  try{ localStorage.removeItem(ADMIN_FLAG); }catch(e){}
  adminMode=false;
  document.body.classList.remove('dt-on');
  var tb=$('.dt-toolbar'); if(tb) tb.remove();
  document.querySelectorAll('.dt-edit-btn,.dt-quick').forEach(function(n){ n.remove(); });
}

/* ── toolbar ─────────────────────────────────────────────────────────── */
function buildToolbar(){
  if($('.dt-toolbar')) return;
  var dot=h('span',{class:'dt-dot on'});
  var label=h('span',{class:'dt-tlabel'},[dot, h('span',{text:'Editing — changes save live'})]);
  var tb=h('div',{class:'dt-toolbar'},[
    label,
    h('button',{class:'dt-tbtn go', onclick:addPiece, text:'+ Add piece'}),
    h('button',{class:'dt-tbtn', onclick:exitAdmin, text:'Log out'})
  ]);
  document.body.appendChild(tb);
}
function markDirty(){ dirty=true; var d=$('.dt-toolbar .dt-dot'); if(d) d.classList.add('on'); }

function confirmDiscard(){
  var card=h('div',{class:'dt-card'},[
    h('h3',{text:'Discard local edits?'}),
    h('div',{class:'dt-sub',text:'This throws away changes saved on this device and reloads the published catalog. Anything you already Published stays.'}),
    h('div',{class:'dt-actions'},[
      h('button',{class:'dt-btn dt-btn-ghost', onclick:closeModal, text:'Keep editing'}),
      h('button',{class:'dt-btn dt-btn-danger', onclick:function(){ DT.discardLocalEdits(); dirty=false; DT.rerender(); closeModal(); }, text:'Discard'})
    ])
  ]);
  modal(card);
}

/* ── decorate gallery cards with edit controls ───────────────────────── */
function pieceById(id){ return DT.getPieces().filter(function(p){ return String(p.id)===String(id); })[0]; }

function decorateCards(){
  if(!adminMode) return;
  document.querySelectorAll('#gallery .piece-card').forEach(function(card){
    if(card.querySelector('.dt-edit-btn')) return;
    var id=card.dataset.pieceId;
    var edit=h('button',{class:'dt-edit-btn', text:'✏ Edit', onclick:function(e){ e.stopPropagation(); var p=pieceById(id); if(p) openEditor(p,false); }});
    card.appendChild(edit);
    // quick status toggle
    var p=pieceById(id);
    var quick=h('div',{class:'dt-quick'},[
      h('button',{text: p && p.status==='available' ? 'Mark sold' : 'Mark available',
        onclick:function(e){ e.stopPropagation(); quickToggle(id); }})
    ]);
    card.appendChild(quick);
  });
}
function quickToggle(id){
  var p=pieceById(id); if(!p) return;
  var s=supa(); if(!s){ alert('You appear to be offline — try again in a moment.'); return; }
  var next = (p.status==='available') ? 'sold' : 'available';
  s.from('pieces').update({status:next}).eq('id', p.id).then(function(res){
    if(res.error){ alert('Could not update: '+res.error.message); return; }
    DT.refresh();   // re-pull from cloud + re-render (observer re-decorates)
  });
}

/* ── editor ──────────────────────────────────────────────────────────── */
function field(label, control){ return h('div',{class:'dt-field'},[ h('label',{text:label}), control ]); }

function openEditor(piece, isNew){
  var draft = JSON.parse(JSON.stringify(piece));
  if(!Array.isArray(draft.photos)) draft.photos=[];

  var fName=h('input',{type:'text', value:draft.name||''});
  var fSpecies=h('input',{type:'text', value:draft.species||''});
  var fDims=h('input',{type:'text', value:draft.dimensions||'', placeholder:'e.g. 10" × 4"'});
  var fPrice=h('input',{type:'number', value:(draft.price||0), min:'0', step:'1'});
  var fCat=h('select');
  Object.keys(DT.CAT).forEach(function(key){
    fCat.appendChild(h('option',{value:key, text:DT.CAT[key].label, selected: draft.category===key ? 'selected' : null}));
  });
  var fStatus=h('select');
  [['available','Available'],['reserved','Reserved'],['sold','Sold']].forEach(function(o){
    fStatus.appendChild(h('option',{value:o[0], text:o[1], selected: (draft.status||'available')===o[0] ? 'selected':null}));
  });
  var fDesc=h('textarea',{}); fDesc.value=draft.description||'';
  var fCare=h('textarea',{}); fCare.value=draft.care||'';

  var photoWrap=h('div',{class:'dt-photos'});
  var fileInput=h('input',{type:'file', accept:'image/*', multiple:'true', style:'display:none',
    onchange:function(){ addFiles(this.files); this.value=''; }});

  function renderPhotos(){
    photoWrap.innerHTML='';
    draft.photos.forEach(function(src, idx){
      var t=h('div',{class:'dt-thumb'},[ h('img',{src:src, alt:''}) ]);
      if(idx===0) t.appendChild(h('span',{class:'dt-cover',text:'COVER'}));
      t.appendChild(h('button',{class:'dt-x', title:'Remove', text:'✕',
        onclick:function(){ draft.photos.splice(idx,1); renderPhotos(); }}));
      if(idx>0) t.appendChild(h('button',{class:'dt-star', title:'Make cover photo', text:'★ cover',
        onclick:function(){ var s=draft.photos.splice(idx,1)[0]; draft.photos.unshift(s); renderPhotos(); }}));
      photoWrap.appendChild(t);
    });
    photoWrap.appendChild(h('button',{class:'dt-addphoto', onclick:function(){ fileInput.click(); }, text:'+ Add photos'}));
    photoWrap.appendChild(fileInput);
  }
  function addFiles(files){
    var arr=Array.prototype.slice.call(files||[]);
    if(!arr.length) return;
    if(!supa()){ alert('You appear to be offline — try again in a moment.'); return; }
    var note=h('div',{class:'dt-sub',text:'Uploading photo'+(arr.length>1?'s':'')+'…'});
    photoWrap.appendChild(note);
    Promise.all(arr.map(uploadPhoto)).then(function(urls){
      urls.forEach(function(u){ if(u) draft.photos.push(u); });
      renderPhotos();
    }).catch(function(){ if(note.parentNode) note.remove(); alert('Sorry — a photo failed to upload. Try again.'); });
  }
  renderPhotos();

  function save(){
    var s=supa(); if(!s){ alert('You appear to be offline — try again in a moment.'); return; }
    draft.name=fName.value.trim()||'Untitled piece';
    draft.species=fSpecies.value.trim();
    draft.dimensions=fDims.value.trim();
    draft.price=Math.max(0, parseFloat(fPrice.value)||0);
    draft.category=fCat.value;
    draft.status=fStatus.value;
    draft.description=fDesc.value.trim();
    draft.care=fCare.value.trim();
    if(isNew && draft.sort==null){
      var sorts=DT.getPieces().map(function(p){ return Number(p.sort)||0; });
      draft.sort=(sorts.length?Math.max.apply(null,sorts):0)+1;
    }
    var row={ id:draft.id, name:draft.name, category:draft.category, species:draft.species,
      dimensions:draft.dimensions, price:draft.price, status:draft.status,
      photos:draft.photos||[], description:draft.description, care:draft.care, sort:draft.sort||0 };
    saveBtn.disabled=true; saveBtn.textContent='Saving…';
    s.from('pieces').upsert(row).then(function(res){
      saveBtn.disabled=false; saveBtn.textContent=isNew?'Add piece':'Save changes';
      if(res.error){ alert('Could not save: '+res.error.message); return; }
      DT.refresh().then(function(){ closeModal(); });
    });
  }
  function del(){
    var s=supa(); if(!s){ alert('You appear to be offline — try again in a moment.'); return; }
    if(!confirm('Delete "'+(draft.name||'this piece')+'" from the catalog? This is permanent.')) return;
    s.from('pieces').delete().eq('id', draft.id).then(function(res){
      if(res.error){ alert('Could not delete: '+res.error.message); return; }
      DT.refresh().then(function(){ closeModal(); });
    });
  }

  var saveBtn=h('button',{class:'dt-btn dt-btn-primary', onclick:save, text: isNew?'Add piece':'Save changes'});
  var card=h('div',{class:'dt-card'},[
    h('h3',{text: isNew?'Add a piece':'Edit piece'}),
    h('div',{class:'dt-sub',text:'Changes go live on the website instantly when you save.'}),
    field('Name', fName),
    h('div',{class:'dt-row'},[ field('Type', fCat), field('Status', fStatus) ]),
    h('div',{class:'dt-row'},[ field('Wood / species', fSpecies), field('Size', fDims) ]),
    field('Price ($) — leave 0 for "Ask at the booth"', fPrice),
    field('Description (your words)', fDesc),
    field('Care instructions', fCare),
    h('div',{class:'dt-field'},[ h('label',{text:'Photos — first one is the cover'}), photoWrap ]),
    h('div',{class:'dt-actions'},[ saveBtn,
      h('button',{class:'dt-btn dt-btn-ghost', onclick:closeModal, text:'Cancel'}),
      isNew? null : h('button',{class:'dt-btn dt-btn-danger', onclick:del, text:'Delete'})
    ])
  ]);
  modal(card);
}

function addPiece(){
  var ids=DT.getPieces().map(function(p){ return Number(p.id)||0; });
  var nextId=(ids.length?Math.max.apply(null,ids):0)+1;
  openEditor({ id:nextId, name:'', category:'bowl', species:'', dimensions:'', price:0,
    status:'available', photos:[], description:'', care:'' }, true);
}

/* ── photo upload (downscale → Supabase Storage → public URL) ────────── */
function downscaleToBlob(file, maxDim, quality){
  return new Promise(function(resolve,reject){
    if(!file || !/^image\//.test(file.type)){ resolve(null); return; }
    var img=new Image();
    img.onload=function(){
      var w=img.width, hh=img.height;
      if(w>hh && w>maxDim){ hh=Math.round(hh*maxDim/w); w=maxDim; }
      else if(hh>=w && hh>maxDim){ w=Math.round(w*maxDim/hh); hh=maxDim; }
      var c=document.createElement('canvas'); c.width=w; c.height=hh;
      c.getContext('2d').drawImage(img,0,0,w,hh);
      c.toBlob(function(b){ b?resolve(b):reject(new Error('encode failed')); }, 'image/jpeg', quality||0.82);
    };
    img.onerror=reject;
    var r=new FileReader();
    r.onload=function(){ img.src=r.result; };
    r.onerror=reject;
    r.readAsDataURL(file);
  });
}
function uploadPhoto(file){
  var s=supa(); if(!s) return Promise.reject(new Error('offline'));
  return downscaleToBlob(file,1200,0.82).then(function(blob){
    if(!blob) return null;
    var path='p'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.jpg';
    return s.storage.from('photos').upload(path, blob, {contentType:'image/jpeg', cacheControl:'31536000', upsert:false})
      .then(function(res){
        if(res.error) throw res.error;
        return s.storage.from('photos').getPublicUrl(path).data.publicUrl;
      });
  });
}

/* ── legacy photo → data-URL (kept for reference; no longer used) ─────── */
function fileToDataUrl(file, maxDim, quality){
  return new Promise(function(resolve,reject){
    if(!file || !/^image\//.test(file.type)){ resolve(null); return; }
    var img=new Image();
    img.onload=function(){
      var w=img.width, hh=img.height;
      if(w>hh && w>maxDim){ hh=Math.round(hh*maxDim/w); w=maxDim; }
      else if(hh>=w && hh>maxDim){ w=Math.round(w*maxDim/hh); hh=maxDim; }
      var c=document.createElement('canvas'); c.width=w; c.height=hh;
      c.getContext('2d').drawImage(img,0,0,w,hh);
      try{ resolve(c.toDataURL('image/jpeg', quality)); }catch(e){ reject(e); }
    };
    img.onerror=reject;
    var r=new FileReader();
    r.onload=function(){ img.src=r.result; };
    r.onerror=reject;
    r.readAsDataURL(file);
  });
}

/* ── publish ─────────────────────────────────────────────────────────── */
function publish(){
  var stamp=new Date().toLocaleString();
  var header=''
    + '// Dizzy Toad Woodworks — pieces.js\n'
    + '// Generated by the admin panel on '+stamp+'.\n'
    + '// To update the live site: upload this file to your web host, replacing the old pieces.js.\n'
    + '// (Photos you added are embedded right in this file, so this is the only file you need to upload.)\n\n';
  var body='window.PIECES = '+JSON.stringify(DT.getPieces(), null, 2)+';\n';
  var blob=new Blob([header+body], {type:'application/javascript'});
  var url=URL.createObjectURL(blob);
  var a=h('a',{href:url, download:'pieces.js'}); document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 5000);
  dirty=false; var d=$('.dt-toolbar .dt-dot'); if(d) d.classList.remove('on');

  var card=h('div',{class:'dt-card'},[
    h('h3',{text:'Published ✓'}),
    h('div',{class:'dt-sub',html:'Your <b>pieces.js</b> just downloaded. To make these changes go live for everyone, upload that one file to your website host, replacing the old <b>pieces.js</b>.'}),
    h('div',{class:'dt-sub',html:'Not sure how? Send the file to whoever set up the site and they’ll drop it in — it’s a 10-second job.'}),
    h('div',{class:'dt-actions'},[ h('button',{class:'dt-btn dt-btn-primary', onclick:closeModal, text:'Got it'}) ])
  ]);
  modal(card);
}

/* ── observe gallery so edit buttons survive re-renders ──────────────── */
function watchGallery(){
  var g=document.getElementById('gallery'); if(!g) return;
  new MutationObserver(function(){ if(adminMode) decorateCards(); }).observe(g, {childList:true});
}

/* ── public init ─────────────────────────────────────────────────────── */
function init(){
  injectStyles();
  document.body.appendChild(h('button',{class:'dt-trigger', onclick:function(){ adminMode?openManage():openLogin(); }, text:'🐸 Admin'}));
  watchGallery();
  // resume an existing Supabase session (supabase-js persists it in localStorage)
  var s=supa();
  if(s){
    s.auth.getSession().then(function(res){
      if(res && res.data && res.data.session && !adminMode) enterAdmin();
    }).catch(function(){});
  }
  // allow #admin to open the login
  if((location.hash||'').toLowerCase()==='#admin' && !adminMode) openLogin();
}
function openManage(){ /* trigger when already in admin → quick add */ addPiece(); }

window.DizzyToadAdmin={ init:init };
init();   // self-init (this script loads after the page is set up)

})();
