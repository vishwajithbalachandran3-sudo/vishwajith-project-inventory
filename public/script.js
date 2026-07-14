const parts=[
 {name:'Hydraulic Solenoid Valve',sku:'HSV-PK-240',supplier:'Parker Hannifin',location:'Rack B · Shelf 3',stock:3,min:10,price:52.00,icon:'⌘'},
 {name:'SKF Deep Groove Bearing',sku:'SKF-6204-2RS',supplier:'SKF',location:'Rack A · Bin 12',stock:5,min:15,price:18.40,icon:'◉'},
 {name:'Siemens Proximity Sensor',sku:'SIE-3RG4012',supplier:'Siemens',location:'Rack D · Shelf 2',stock:0,min:8,price:84.75,icon:'◈'},
 {name:'Gates V-Belt A42',sku:'GT-A42-13',supplier:'Gates Industrial',location:'Rack C · Bin 07',stock:12,min:12,price:22.30,icon:'⬡'},
 {name:'ABB Contactor 24V',sku:'ABB-AF26-30',supplier:'ABB',location:'Rack E · Shelf 4',stock:28,min:10,price:96.20,icon:'▣'},
 {name:'Festo Pneumatic Cylinder',sku:'FES-DSBC-40',supplier:'Festo',location:'Rack B · Shelf 8',stock:17,min:6,price:142.00,icon:'⇥'},
 {name:'Grundfos Circulation Pump',sku:'GRU-UPS25-60',supplier:'Grundfos',location:'Floor Zone 2',stock:6,min:4,price:318.50,icon:'◒'},
 {name:'Allen-Bradley PLC Module',sku:'AB-1769-IQ16',supplier:'Rockwell',location:'Secure Cage · 04',stock:9,min:3,price:684.00,icon:'▦'}
];
const orders=[
 ['PO-2048','SKF','Jul 08, 2026','Jul 16, 2026','4','\u0024 12,840','transit','In transit'],['PO-2047','Parker Hannifin','Jul 07, 2026','Jul 19, 2026','2','\u0024 8,260','pending','Pending approval'],['PO-2046','Siemens','Jul 03, 2026','Jul 14, 2026','7','\u0024 31,440','transit','In transit'],['PO-2045','Gates Industrial','Jul 01, 2026','Jul 12, 2026','3','\u0024 4,180','pending','Pending approval']
];
const suppliers=[['SKF','Bearings & seals','96%','4.8','\u0024184K'],['Siemens','Automation & controls','94%','4.7','\u0024312K'],['Parker','Hydraulics & pneumatics','91%','4.6','\u0024228K'],['ABB','Electrical equipment','97%','4.9','\u0024196K'],['Festo','Pneumatic systems','93%','4.7','\u0024142K'],['Gates','Belts & power transmission','89%','4.4','\u002486K']];
const activities=[
 {type:'out',title:'Issued 5 × SKF Deep Groove Bearing',meta:'WO-4832 · Hydraulic Press 02',user:'Mike Torres',time:'18 min ago',qty:'−5'},
 {type:'in',title:'Received 40 × Gates V-Belt A42',meta:'PO-2039 · Dock receipt #984',user:'Sarah Chen',time:'1 hr ago',qty:'+40'},
 {type:'out',title:'Issued 2 × ABB Contactor 24V',meta:'WO-4829 · Conveyor Line 06',user:'David Okafor',time:'3 hrs ago',qty:'−2'},
 {type:'in',title:'Received 12 × Festo Pneumatic Cylinder',meta:'PO-2037 · Dock receipt #981',user:'Sarah Chen',time:'Yesterday',qty:'+12'},
 {type:'out',title:'Issued 1 × Grundfos Circulation Pump',meta:'WO-4822 · Cooling Loop 03',user:'Ana Ruiz',time:'Yesterday',qty:'−1'}
];
function status(p){return p.stock===0?'critical':p.stock<=p.min?'low':'healthy'}
function statusText(s){return s==='critical'?'Critical':s==='low'?'Low stock':'Healthy'}
function partCell(p){return `<div class="part-cell"><span class="part-img">${p.icon}</span><div><strong>${p.name}</strong><small>${p.sku}</small></div></div>`}
function renderAttention(){document.querySelector('#attentionTable').innerHTML=parts.filter(p=>status(p)!=='healthy').slice(0,4).map(p=>{let s=status(p),pct=Math.min(100,p.stock/p.min*60);return `<tr><td>${partCell(p)}</td><td>${p.location}</td><td><div class="stock-level"><strong>${p.stock} / ${p.min} min</strong><div><i style="width:${pct}%;background:${s==='critical'?'#d85650':'#e0a03a'}"></i></div></div></td><td><span class="status ${s}">${statusText(s)}</span></td><td><button class="row-menu">•••</button></td></tr>`}).join('')}
function renderParts(query='',filter='all'){document.querySelector('#partsTable').innerHTML=parts.filter(p=>(p.name+p.sku+p.supplier).toLowerCase().includes(query.toLowerCase())&&(filter==='all'||status(p)===filter)).map(p=>`<tr><td>${partCell(p)}</td><td>${p.sku}</td><td>${p.supplier}</td><td>${p.location}</td><td><strong>${p.stock}</strong></td><td>${p.min}</td><td>\u0024${p.price.toFixed(2)}</td><td><span class="status ${status(p)}">${statusText(status(p))}</span></td><td><button class="row-menu">•••</button></td></tr>`).join('')||'<tr><td colspan="9">No matching parts found.</td></tr>'}
function renderActivity(){let html=activities.slice(0,3).map(a=>`<div class="activity-item"><span class="activity-symbol ${a.type}">${a.type==='in'?'↓':'↑'}</span><div class="activity-copy"><strong>${a.title}</strong><small>${a.meta} · by ${a.user}</small></div><div class="activity-qty"><strong style="color:${a.type==='in'?'#307454':'#b9672a'}">${a.qty}</strong><small>${a.time}</small></div></div>`).join('');document.querySelector('#recentActivity').innerHTML=html;document.querySelector('#activityFeed').innerHTML=activities.map(a=>`<div class="activity-item"><span class="activity-symbol ${a.type}">${a.type==='in'?'↓':'↑'}</span><div class="activity-copy"><strong>${a.title}</strong><small>${a.meta} · Recorded by ${a.user}</small></div><div class="activity-qty"><strong style="color:${a.type==='in'?'#307454':'#b9672a'}">${a.qty} units</strong><small>${a.time}</small></div></div>`).join('')}
function renderMaintenance(){let data=[['14','Hydraulic Press 02','WO-4838 · 4 parts required','Ready','ready'],['16','CNC Mill 07','WO-4841 · 6 parts required','1 part at risk','risk'],['21','Air Compressor 03','WO-4846 · 3 parts required','Ready','ready']];document.querySelector('#maintenanceList').innerHTML=data.map(x=>`<div class="maintenance-item"><div class="date-block"><small>JUL</small><strong>${x[0]}</strong></div><div class="maintenance-copy"><strong>${x[1]}</strong><small>${x[2]}</small></div><span class="readiness ${x[4]}">${x[3]}</span></div>`).join('')}
function renderChart(){let vals=[[76,54],[92,62],[64,78],[88,68],[106,75],[95,58]],months=['FEB','MAR','APR','MAY','JUN','JUL'];document.querySelector('#movementChart').innerHTML=months.map((m,i)=>`<div class="bar-month"><div class="bars"><i style="height:${vals[i][0]}px"></i><i style="height:${vals[i][1]}px"></i></div>${m}</div>`).join('')}
function renderOrders(){document.querySelector('#ordersTable').innerHTML=orders.map(o=>`<tr><td><strong>${o[0]}</strong></td><td>${o[1]}</td><td>${o[2]}</td><td>${o[3]}</td><td>${o[4]}</td><td><strong>${o[5]}</strong></td><td><span class="status ${o[6]}">${o[7]}</span></td></tr>`).join('')}
function renderSuppliers(){document.querySelector('#supplierGrid').innerHTML=suppliers.map(s=>`<article class="card supplier-card"><div class="supplier-logo">${s[0].slice(0,3).toUpperCase()}</div><h3>${s[0]}</h3><p>${s[1]}</p><div class="supplier-stats"><div><small>ON-TIME</small><strong>${s[2]}</strong></div><div><small>RATING</small><strong>★ ${s[3]}</strong></div><div><small>YTD SPEND</small><strong>${s[4]}</strong></div></div></article>`).join('')}
function bars(id,data){document.querySelector(id).innerHTML=data.map(x=>`<div class="progress-row"><div class="progress-label"><span>${x[0]}</span><strong>${x[1]}${typeof x[1]==='number'?'%':''}</strong></div><div class="progress-track"><i style="width:${x[2]}%"></i></div></div>`).join('')}
function navigate(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.page===id));document.querySelector('.sidebar').classList.remove('open');window.scrollTo(0,0)}
document.querySelectorAll('[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigate(a.dataset.page)}));document.querySelectorAll('[data-goto]').forEach(a=>a.addEventListener('click',()=>navigate(a.dataset.goto)));
document.querySelector('.mobile-menu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');
const modal=document.querySelector('#modal');function openModal(){modal.classList.add('open')}function closeModal(){modal.classList.remove('open')}document.querySelector('#newOrderBtn').onclick=openModal;document.querySelectorAll('.new-order').forEach(b=>b.onclick=openModal);document.querySelector('.modal-close').onclick=closeModal;document.querySelector('.cancel-modal').onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};
const orderSelect=document.querySelector('#orderPart');orderSelect.innerHTML=parts.map((p,i)=>`<option value="${i}">${p.name} (${p.sku})</option>`).join('');function syncSupplier(){document.querySelector('#orderSupplier').value=parts[+orderSelect.value].supplier}orderSelect.onchange=syncSupplier;syncSupplier();
document.querySelector('#orderForm').onsubmit=e=>{e.preventDefault();closeModal();let toast=document.querySelector('#toast');toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)};
document.querySelector('#partSearch').oninput=e=>renderParts(e.target.value,document.querySelector('#statusFilter').value);document.querySelector('#statusFilter').onchange=e=>renderParts(document.querySelector('#partSearch').value,e.target.value);
document.querySelector('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){navigate('inventory');document.querySelector('#partSearch').value=e.target.value;renderParts(e.target.value,'all')}});document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();document.querySelector('#globalSearch').focus()}if(e.key==='Escape')closeModal()});
document.querySelector('#exportBtn').onclick=()=>{let blob=new Blob(['Metric,Value\nInventory Value,1428650\nLow Stock Parts,24\nOpen Purchase Orders,7\nActive Suppliers,18'],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='vish-project-inventory-summary.csv';a.click();URL.revokeObjectURL(a.href)};
document.querySelector('#addPartBtn').onclick=()=>{let t=document.querySelector('#toast');t.querySelector('strong').textContent='Part form ready';t.querySelector('small').textContent='Connect this prototype to your ERP to save new parts.';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500)};
renderAttention();renderParts();renderActivity();renderMaintenance();renderChart();renderOrders();renderSuppliers();bars('#categoryBars',[['Automation',32,90],['Mechanical',26,74],['Electrical',22,62],['Hydraulics',20,56]]);bars('#usageBars',[['SKF 6204 Bearing','284 units',95],['Gates A42 V-Belt','218 units',73],['Parker Solenoid Valve','164 units',55],['ABB Contactor','128 units',43]]);

// Interactive prototype enhancements
(function(){
  function showToast(title,message){const t=document.querySelector('#toast');t.querySelector('strong').textContent=title;t.querySelector('small').textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3200)}
  function showDialog(title,html){let d=document.querySelector('#quickDialog');if(!d){d=document.createElement('div');d.id='quickDialog';d.className='modal-backdrop';d.innerHTML='<div class="modal"><button class="modal-close">×</button><p class="eyebrow">VISH PROJECT</p><h2></h2><div class="dialog-body"></div><div class="modal-actions"><button class="primary dialog-done">Done</button></div></div>';document.body.appendChild(d);d.addEventListener('click',e=>{if(e.target===d||e.target.closest('.modal-close')||e.target.closest('.dialog-done'))d.classList.remove('open')})}d.querySelector('h2').textContent=title;d.querySelector('.dialog-body').innerHTML=html;d.classList.add('open')}
  document.addEventListener('click',function(e){
    const menu=e.target.closest('.row-menu');if(menu){const row=menu.closest('tr'),name=row.querySelector('.part-cell strong')?.textContent;if(name){const i=parts.findIndex(p=>p.name===name);showDialog(name,`<p style="color:#6c756f">Choose a warehouse action for this part.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button class="secondary stock-action" data-i="${i}" data-type="issue">↑ Issue parts</button><button class="primary stock-action" data-i="${i}" data-type="receive">↓ Receive stock</button></div>`)}else showDialog('Record details','<p>This record is active and available for review.</p>');return}
    const action=e.target.closest('.stock-action');if(action){const p=parts[+action.dataset.i],receiving=action.dataset.type==='receive',answer=prompt(`${receiving?'Receive':'Issue'} how many units of ${p.name}?`,'1');const qty=Number(answer);if(Number.isFinite(qty)&&qty>0){if(!receiving&&qty>p.stock){showToast('Not enough stock',`Only ${p.stock} units are currently available.`);return}p.stock+=receiving?qty:-qty;renderParts(document.querySelector('#partSearch').value,document.querySelector('#statusFilter').value);renderAttention();document.querySelector('#quickDialog').classList.remove('open');showToast('Inventory updated',`${p.name} now has ${p.stock} units available.`)}return}
    const supplier=e.target.closest('.supplier-card');if(supplier){const name=supplier.querySelector('h3').textContent;showDialog(name,`<p style="color:#6c756f">Approved supplier · Active relationship</p><div class="supplier-stats"><div><small>CONTACT</small><strong>orders@${name.toLowerCase().replace(/\s/g,'')}.com</strong></div><div><small>LEAD TIME</small><strong>7–14 days</strong></div><div><small>STATUS</small><strong style="color:#357255">Active</strong></div></div>`);return}
  });
  const help=document.querySelector('.help');if(help)help.onclick=()=>showDialog('Vish Project quick guide','<p><strong>Find a part:</strong> use the search bar or Parts inventory page.</p><p><strong>Move stock:</strong> click the ••• button beside a part, then choose Issue or Receive.</p><p><strong>Reorder:</strong> click New purchase order and submit the form.</p>');
  const notify=document.querySelector('.icon-btn');if(notify)notify.onclick=()=>showDialog('Notifications','<p>🔴 8 parts are critically low.</p><p>📦 PO-2048 is expected on July 16.</p><p>⚠ Siemens Proximity Sensor is unavailable for upcoming maintenance.</p>');
  const profile=document.querySelector('.profile');if(profile)profile.onclick=()=>showDialog('Vish','<p>Warehouse Manager<br>Vish Plant</p><p style="color:#6c756f">Permissions: inventory, procurement, reports</p>');
  document.querySelectorAll('#reports .secondary,#activity .secondary').forEach(b=>b.onclick=()=>{document.querySelector('#exportBtn').click();showToast('Report exported','Your CSV file has been downloaded.')});
  const supplierAdd=document.querySelector('#suppliers .page-heading .primary');if(supplierAdd)supplierAdd.onclick=()=>showDialog('Add supplier','<p>This prototype is ready to connect to your ERP supplier master.</p><label>Supplier name<input style="width:100%;height:42px;border:1px solid #dce1dc;border-radius:6px;margin-top:6px;padding:10px" placeholder="Enter company name"></label>');
  document.querySelectorAll('.metric').forEach((m,i)=>{m.style.cursor=i===0?'default':'pointer';if(i>0)m.onclick=()=>navigate(i===1?'inventory':i===2?'orders':'suppliers')});
  document.querySelectorAll('.maintenance-item').forEach(item=>item.style.cursor='pointer');
  document.querySelector('#maintenanceList')?.addEventListener('click',e=>{const item=e.target.closest('.maintenance-item');if(item)showDialog(item.querySelector('strong').textContent,`<p>${item.querySelector('small').textContent}</p><p><strong>Readiness:</strong> ${item.querySelector('.readiness').textContent}</p>`)});
})();

// Mechanical, Electrical, and General inventory categories.
(function setupPartCategories(){
  const categoriesByPartNumber={
    'HSV-PK-240':'Mechanical','SKF-6204-2RS':'Mechanical','SIE-3RG4012':'Electrical',
    'GT-A42-13':'Mechanical','ABB-AF26-30':'Electrical','FES-DSBC-40':'Mechanical',
    'GRU-UPS25-60':'Mechanical','AB-1769-IQ16':'Electrical'
  };
  parts.forEach(p=>p.category=p.category||categoriesByPartNumber[p.sku]||'General');

  const statusFilter=document.querySelector('#statusFilter');
  const categoryFilter=document.createElement('select');
  categoryFilter.id='categoryFilter';
  categoryFilter.innerHTML='<option value="all">All categories</option><option value="Mechanical">Mechanical</option><option value="Electrical">Electrical</option><option value="General">General</option>';
  statusFilter.insertAdjacentElement('afterend',categoryFilter);

  const headerRow=document.querySelector('#partsTable').closest('table').querySelector('thead tr');
  const categoryHeading=document.createElement('th');
  categoryHeading.textContent='CATEGORY';
  headerRow.children[1].insertAdjacentElement('afterend',categoryHeading);

  const categoryClass=c=>c==='Mechanical'?'transit':c==='Electrical'?'pending':'healthy';
  renderParts=function(query='',filter='all'){
    const selectedCategory=categoryFilter.value;
    document.querySelector('#partsTable').innerHTML=parts.map((p,index)=>({p,index})).filter(({p})=>
      (p.name+p.sku+p.supplier+p.category).toLowerCase().includes(query.toLowerCase())&&
      (filter==='all'||status(p)===filter)&&(selectedCategory==='all'||p.category===selectedCategory)
    ).map(({p,index})=>`<tr><td>${partCell(p)}</td><td>${p.sku}</td><td><span class="status ${categoryClass(p.category)}">${p.category}</span></td><td><div style="display:flex;gap:5px;min-width:190px"><input class="part-supplier-input" data-part-index="${index}" value="${p.supplier.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" style="min-width:0;width:145px;height:31px;border:1px solid #dce1dc;border-radius:5px;padding:0 7px;font:11px 'DM Sans'"><button class="primary" onclick="return savePartSupplier(${index},event)" style="padding:6px 8px">Save</button></div></td><td>${p.location}</td><td><strong>${p.stock}</strong></td><td>${p.min}</td><td>$${p.price.toFixed(2)}</td><td><span class="status ${status(p)}">${statusText(status(p))}</span></td><td><button class="row-menu">•••</button></td></tr>`).join('')||'<tr><td colspan="10">No matching parts found.</td></tr>';
  };
  categoryFilter.addEventListener('change',()=>renderParts(document.querySelector('#partSearch').value,statusFilter.value));

  const addForm=document.querySelector('#addPartForm');
  if(addForm){
    const categoryLabel=document.createElement('label');
    categoryLabel.innerHTML='Category<select name="category"><option>Mechanical</option><option>Electrical</option><option>General</option></select>';
    addForm.querySelector('.modal-actions').insertAdjacentElement('beforebegin',categoryLabel);
    addForm.addEventListener('submit',()=>setTimeout(()=>{if(parts[0]&&!parts[0].category){parts[0].category=addForm.elements.category.value||'General';renderParts()}},0));
  }
  renderParts();
})();

// Keep categories active after the editable-supplier renderer is installed.
(function finalizePartCategories(){
  const categoryFilter=document.querySelector('#categoryFilter');
  const statusFilter=document.querySelector('#statusFilter');
  const categoryClass=c=>c==='Mechanical'?'transit':c==='Electrical'?'pending':'healthy';
  renderParts=function(query='',filter='all'){
    const selectedCategory=categoryFilter.value;
    document.querySelector('#partsTable').innerHTML=parts.map((p,index)=>({p,index})).filter(({p})=>
      (p.name+p.sku+p.supplier+p.category).toLowerCase().includes(query.toLowerCase())&&
      (filter==='all'||status(p)===filter)&&(selectedCategory==='all'||p.category===selectedCategory)
    ).map(({p,index})=>`<tr><td>${partCell(p)}</td><td>${p.sku}</td><td><span class="status ${categoryClass(p.category)}">${p.category}</span></td><td><div style="display:flex;gap:5px;min-width:190px"><input class="part-supplier-input" data-part-index="${index}" value="${p.supplier.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" style="min-width:0;width:145px;height:31px;border:1px solid #dce1dc;border-radius:5px;padding:0 7px;font:11px 'DM Sans'"><button class="primary" onclick="return savePartSupplier(${index},event)" style="padding:6px 8px">Save</button></div></td><td>${p.location}</td><td><strong>${p.stock}</strong></td><td>${p.min}</td><td>$${p.price.toFixed(2)}</td><td><span class="status ${status(p)}">${statusText(status(p))}</span></td><td><button class="row-menu">•••</button></td></tr>`).join('')||'<tr><td colspan="10">No matching parts found.</td></tr>';
  };
  categoryFilter.onchange=()=>renderParts(document.querySelector('#partSearch').value,statusFilter.value);
  const addForm=document.querySelector('#addPartForm');
  if(addForm&&!addForm.elements.category){
    const label=document.createElement('label');
    label.innerHTML='Category<select name="category"><option>Mechanical</option><option>Electrical</option><option>General</option></select>';
    addForm.querySelector('.modal-actions').insertAdjacentElement('beforebegin',label);
    addForm.addEventListener('submit',()=>{
      const chosen=addForm.elements.category.value;
      setTimeout(()=>{if(parts[0]&&!parts[0].category){parts[0].category=chosen;renderParts()}},0);
    },true);
  }
  renderParts();
})();
// Functional add-part form
(function(){
  const addButton=document.querySelector('#addPartBtn');
  if(!addButton)return;
  let modal=document.querySelector('#addPartModal');
  if(!modal){
    modal=document.createElement('div');modal.id='addPartModal';modal.className='modal-backdrop';
    modal.innerHTML=`<div class="modal"><button type="button" class="modal-close add-part-close">×</button><p class="eyebrow">PARTS MASTER</p><h2>Add a new part</h2><p>Enter the warehouse and replenishment details.</p><form id="addPartForm"><label>Part name<input name="name" placeholder="e.g. Hydraulic Filter" required></label><div class="form-row"><label>Part Number<input name="sku" placeholder="e.g. HYD-FLT-100" required></label><label>Supplier<input name="supplier" placeholder="e.g. Parker Hannifin" required></label></div><div class="form-row"><label>Warehouse location<input name="location" placeholder="e.g. Rack B · Shelf 4" required></label><label>Unit price ($)<input name="price" type="number" min="0" step="0.01" value="0" required></label></div><div class="form-row"><label>Current stock<input name="stock" type="number" min="0" value="0" required></label><label>Minimum stock<input name="min" type="number" min="0" value="5" required></label></div><div class="modal-actions"><button type="button" class="secondary add-part-close">Cancel</button><button type="submit" class="primary">Add part to inventory</button></div></form></div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.add-part-close'))modal.classList.remove('open')});
    modal.querySelector('#addPartForm').addEventListener('submit',e=>{
      e.preventDefault();const data=new FormData(e.currentTarget);const sku=String(data.get('sku')).trim();
      if(parts.some(p=>p.sku.toLowerCase()===sku.toLowerCase())){alert('A part with this part number already exists. Please use a unique part number.');return}
      const newPart={name:String(data.get('name')).trim(),sku,supplier:String(data.get('supplier')).trim(),location:String(data.get('location')).trim(),stock:Number(data.get('stock')),min:Number(data.get('min')),price:Number(data.get('price')),icon:'⚙'};
      parts.unshift(newPart);renderParts(document.querySelector('#partSearch').value,document.querySelector('#statusFilter').value);renderAttention();orderSelect.innerHTML=parts.map((p,i)=>`<option value="${i}">${p.name} (${p.sku})</option>`).join('');syncSupplier();modal.classList.remove('open');e.currentTarget.reset();showAddPartToast(newPart.name);
    });
  }
  function showAddPartToast(name){const t=document.querySelector('#toast');t.querySelector('strong').textContent='Part added successfully';t.querySelector('small').textContent=`${name} is now in the inventory.`;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500)}
  addButton.onclick=()=>modal.classList.add('open');
})();
// Editable supplier names
(function(){
  renderSuppliers=function(){document.querySelector('#supplierGrid').innerHTML=suppliers.map((s,i)=>`<article class="card supplier-card"><div class="supplier-logo">${s[0].slice(0,3).toUpperCase()}</div><h3>${s[0]}</h3><p>${s[1]}</p><div class="supplier-stats"><div><small>ON-TIME</small><strong>${s[2]}</strong></div><div><small>RATING</small><strong>★ ${s[3]}</strong></div><div><small>YTD SPEND</small><strong>${s[4]}</strong></div></div><button class="secondary edit-supplier" data-index="${i}" style="width:100%;margin-top:16px">Edit supplier</button></article>`).join('')};
  renderSuppliers();
  document.addEventListener('click',function(e){
    const button=e.target.closest('.edit-supplier');if(!button)return;
    e.preventDefault();e.stopImmediatePropagation();
    const supplier=suppliers[Number(button.dataset.index)],oldName=supplier[0];
    const newName=prompt('Enter the new supplier name:',oldName);
    if(!newName||!newName.trim()||newName.trim()===oldName)return;
    supplier[0]=newName.trim();
    parts.forEach(p=>{if(p.supplier===oldName)p.supplier=supplier[0]});
    orders.forEach(o=>{if(o[1]===oldName)o[1]=supplier[0]});
    renderSuppliers();renderParts(document.querySelector('#partSearch').value,document.querySelector('#statusFilter').value);renderAttention();renderOrders();
    orderSelect.innerHTML=parts.map((p,i)=>`<option value="${i}">${p.name} (${p.sku})</option>`).join('');syncSupplier();
    const t=document.querySelector('#toast');t.querySelector('strong').textContent='Supplier updated';t.querySelector('small').textContent=`${oldName} is now ${supplier[0]}.`;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);
  },true);
})();
// Direct, persistent supplier editor
(function(){
  try{const saved=JSON.parse(localStorage.getItem('vish-project-suppliers')||'null');if(Array.isArray(saved))saved.forEach((name,i)=>{if(suppliers[i]&&name)suppliers[i][0]=name})}catch(e){}
  window.saveSupplierName=function(index,event){
    if(event){event.preventDefault();event.stopPropagation()}
    const input=document.querySelector(`.supplier-name-input[data-index="${index}"]`);if(!input)return false;
    const next=input.value.trim(),old=suppliers[index][0];if(!next){input.focus();return false}
    suppliers[index][0]=next;parts.forEach(p=>{if(p.supplier===old)p.supplier=next});orders.forEach(o=>{if(o[1]===old)o[1]=next});
    localStorage.setItem('vish-project-suppliers',JSON.stringify(suppliers.map(s=>s[0])));
    renderParts(document.querySelector('#partSearch').value,document.querySelector('#statusFilter').value);renderAttention();renderOrders();
    orderSelect.innerHTML=parts.map((p,i)=>`<option value="${i}">${p.name} (${p.sku})</option>`).join('');syncSupplier();
    const t=document.querySelector('#toast');t.querySelector('strong').textContent='Supplier name saved';t.querySelector('small').textContent=`${old} is now ${next}.`;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);return false;
  };
  renderSuppliers=function(){document.querySelector('#supplierGrid').innerHTML=suppliers.map((s,i)=>`<article class="card supplier-card"><div class="supplier-logo">${s[0].slice(0,3).toUpperCase()}</div><label style="display:block;font-size:9px;color:#7d867f;font-weight:700;margin-bottom:5px">SUPPLIER NAME</label><input class="supplier-name-input" data-index="${i}" value="${s[0].replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" onclick="event.stopPropagation()" style="width:100%;height:38px;border:1px solid #dce1dc;border-radius:6px;padding:0 10px;font:700 14px Manrope;margin-bottom:5px"><p>${s[1]}</p><div class="supplier-stats"><div><small>ON-TIME</small><strong>${s[2]}</strong></div><div><small>RATING</small><strong>★ ${s[3]}</strong></div><div><small>YTD SPEND</small><strong>${s[4]}</strong></div></div><button class="primary" onclick="return saveSupplierName(${i},event)" style="width:100%;margin-top:16px">Save name</button></article>`).join('')};
  renderSuppliers();
})();
// Direct supplier editing in the parts inventory table
(function(){
  window.savePartSupplier=function(index,event){
    if(event){event.preventDefault();event.stopPropagation()}
    const input=document.querySelector(`.part-supplier-input[data-part-index="${index}"]`);if(!input)return false;
    const value=input.value.trim();if(!value){input.focus();return false}parts[index].supplier=value;
    try{localStorage.setItem('vish-project-part-suppliers',JSON.stringify(parts.map(p=>({sku:p.sku,supplier:p.supplier}))))}catch(e){}
    syncSupplier();const t=document.querySelector('#toast');t.querySelector('strong').textContent='Part supplier saved';t.querySelector('small').textContent=`${parts[index].name} now uses ${value}.`;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);return false;
  };
  try{const saved=JSON.parse(localStorage.getItem('vish-project-part-suppliers')||'[]');saved.forEach(x=>{const p=parts.find(item=>item.sku===x.sku);if(p&&x.supplier)p.supplier=x.supplier})}catch(e){}
  renderParts=function(query='',filter='all'){document.querySelector('#partsTable').innerHTML=parts.map((p,index)=>({p,index})).filter(x=>(x.p.name+x.p.sku+x.p.supplier).toLowerCase().includes(query.toLowerCase())&&(filter==='all'||status(x.p)===filter)).map(({p,index})=>`<tr><td>${partCell(p)}</td><td>${p.sku}</td><td><div style="display:flex;gap:5px;min-width:190px"><input class="part-supplier-input" data-part-index="${index}" value="${p.supplier.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" style="min-width:0;width:145px;height:31px;border:1px solid #dce1dc;border-radius:5px;padding:0 7px;font:11px 'DM Sans'"><button class="primary" onclick="return savePartSupplier(${index},event)" style="padding:6px 8px">Save</button></div></td><td>${p.location}</td><td><strong>${p.stock}</strong></td><td>${p.min}</td><td>$${p.price.toFixed(2)}</td><td><span class="status ${status(p)}">${statusText(status(p))}</span></td><td><button class="row-menu">•••</button></td></tr>`).join('')||'<tr><td colspan="9">No matching parts found.</td></tr>'};
  renderParts();
})();
