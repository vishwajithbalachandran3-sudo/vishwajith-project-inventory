(function(){
  const storageKey='vish-project-created-purchase-orders';
  const form=document.querySelector('#orderForm');
  const requiredInput=document.querySelector('#orderRequiredBy');
  const quantityInput=document.querySelector('#orderQuantity');
  if(!form||!requiredInput||!quantityInput)return;

  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const isoDate=date=>{const copy=new Date(date);copy.setMinutes(copy.getMinutes()-copy.getTimezoneOffset());return copy.toISOString().slice(0,10)};
  const displayDate=value=>new Date(`${value}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'});
  const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
  const today=new Date();today.setHours(12,0,0,0);
  const suggested=new Date(today);suggested.setDate(suggested.getDate()+7);
  requiredInput.min=isoDate(today);requiredInput.value=isoDate(suggested);

  let createdOrders=[];
  try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))createdOrders=saved}catch(e){}
  let savedStatuses={};
  try{savedStatuses=JSON.parse(localStorage.getItem('vish-project-order-statuses')||'{}')}catch(e){}
  createdOrders.forEach(record=>{
    if(orders.some(order=>order[0]===record.poNumber))return;
    const status=savedStatuses[record.poNumber]||{value:'pending',label:'Pending approval'};
    orders.unshift([record.poNumber,record.supplier,record.created,record.requiredBy,'1',money(record.total),status.value,status.label,record.product]);
  });
  if(createdOrders.length&&typeof renderOrders==='function')renderOrders();

  let downloadModal=document.querySelector('#poDownloadModal');
  if(!downloadModal){
    downloadModal=document.createElement('div');
    downloadModal.id='poDownloadModal';
    downloadModal.className='modal-backdrop';
    downloadModal.innerHTML='<div class="modal"><button type="button" class="modal-close po-download-close" aria-label="Close">&times;</button><p class="eyebrow">PURCHASE ORDER DOWNLOADED</p><h2></h2><div class="dialog-body"></div><div class="modal-actions"><button type="button" class="secondary po-download-close">Done</button><button type="button" class="primary" id="downloadPoBtn">Download again</button></div></div>';
    document.body.appendChild(downloadModal);
    downloadModal.addEventListener('click',event=>{if(event.target===downloadModal||event.target.closest('.po-download-close'))downloadModal.classList.remove('open')});
  }

  function documentHtml(po){
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(po.poNumber)} Purchase Order</title><style>body{font-family:Arial,sans-serif;color:#18211c;margin:0;background:#f3f5f3}.sheet{max-width:820px;margin:32px auto;background:white;padding:48px;box-shadow:0 3px 20px #0002}.top{display:flex;justify-content:space-between;border-bottom:3px solid #174d3a;padding-bottom:22px}.brand{font-size:22px;font-weight:800;color:#174d3a}.title{text-align:right}.title h1{margin:0;font-size:28px}.title p{margin:5px 0 0;color:#66716a}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:30px 0}.box{border:1px solid #dce2dd;border-radius:8px;padding:16px}.box small{display:block;color:#708078;text-transform:uppercase;letter-spacing:1px;font-size:10px;margin-bottom:6px}.box strong{font-size:14px}table{width:100%;border-collapse:collapse;margin:26px 0}th{background:#174d3a;color:white;text-align:left;padding:12px;font-size:11px}td{padding:14px 12px;border-bottom:1px solid #dfe5e0;font-size:13px}.right{text-align:right}.total{display:flex;justify-content:flex-end}.total div{width:270px}.total p{display:flex;justify-content:space-between;font-size:15px}.total .grand{border-top:2px solid #174d3a;padding-top:12px;font-size:19px;font-weight:700}.terms{margin-top:36px;padding-top:18px;border-top:1px solid #dfe5e0;color:#68756e;font-size:11px;line-height:1.6}.print{margin-top:28px;text-align:center}.print button{background:#174d3a;color:white;border:0;border-radius:6px;padding:11px 18px;font-weight:700;cursor:pointer}@media print{body{background:white}.sheet{box-shadow:none;margin:0;max-width:none}.print{display:none}}</style></head><body><main class="sheet"><div class="top"><div><div class="brand">INVENTORY AUTOMATION</div><p>Vish Plant</p></div><div class="title"><h1>PURCHASE ORDER</h1><p>${escapeHtml(po.poNumber)}</p></div></div><div class="grid"><div class="box"><small>Supplier</small><strong>${escapeHtml(po.supplier)}</strong></div><div class="box"><small>Ship to</small><strong>Vish Plant</strong></div><div class="box"><small>Order date</small><strong>${escapeHtml(po.created)}</strong></div><div class="box"><small>Required by</small><strong>${escapeHtml(po.requiredBy)}</strong></div></div><table><thead><tr><th>Product</th><th>Part number</th><th class="right">Quantity</th><th class="right">Unit price</th><th class="right">Total</th></tr></thead><tbody><tr><td>${escapeHtml(po.product)}</td><td>${escapeHtml(po.sku)}</td><td class="right">${po.quantity}</td><td class="right">${money(po.unitPrice)}</td><td class="right">${money(po.total)}</td></tr></tbody></table><div class="total"><div><p class="grand"><span>Order total</span><span>${money(po.total)}</span></p></div></div><div class="terms"><strong>Supplier instructions:</strong> Please confirm price, availability, and delivery date. Contact the buyer before shipment regarding any quantity, quality, or delivery discrepancy.<br><strong>Requested by:</strong> Vishwajith</div><div class="print"><button onclick="window.print()">Print or Save as PDF</button></div></main></body></html>`;
  }

  function download(po){
    const blob=new Blob([documentHtml(po)],{type:'text/html;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download=`${po.poNumber}-purchase-order.html`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  form.onsubmit=event=>{
    event.preventDefault();
    const product=parts[Number(orderSelect.value)];
    const quantity=Number(quantityInput.value);
    if(!product||!Number.isFinite(quantity)||quantity<1)return;
    const poNumber=`PO-${String(today.getFullYear()).slice(-2)}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-${String(Date.now()).slice(-4)}`;
    const po={poNumber,product:product.name,sku:product.sku,supplier:product.supplier,quantity,unitPrice:product.price,total:quantity*product.price,created:today.toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}),requiredBy:displayDate(requiredInput.value)};
    createdOrders.unshift(po);localStorage.setItem(storageKey,JSON.stringify(createdOrders));
    orders.unshift([po.poNumber,po.supplier,po.created,po.requiredBy,'1',money(po.total),'pending','Pending approval',po.product]);
    if(typeof renderOrders==='function')renderOrders();
    closeModal();
    downloadModal.querySelector('h2').textContent=po.poNumber;
    downloadModal.querySelector('.dialog-body').innerHTML=`<p><strong>${escapeHtml(po.product)}</strong> - ${po.quantity} units</p><p>Supplier: ${escapeHtml(po.supplier)}</p><p>Order total: <strong>${money(po.total)}</strong></p><p style="color:#7d867f">Download the supplier-ready document, then attach it to your email.</p>`;
    downloadModal.querySelector('#downloadPoBtn').onclick=()=>download(po);
    downloadModal.classList.add('open');
    download(po);
    form.reset();quantityInput.value='25';requiredInput.value=isoDate(suggested);syncSupplier();
  };
})();
