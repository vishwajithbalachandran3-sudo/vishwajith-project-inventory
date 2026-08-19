(function(){
  const namesKey='vish-project-suppliers';
  const ratingsKey='vish-project-supplier-ratings-v2';
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  try{
    const savedNames=JSON.parse(localStorage.getItem(namesKey)||'[]');
    if(Array.isArray(savedNames))savedNames.forEach((name,index)=>{
      if(!suppliers[index]||!name)return;
      const oldName=suppliers[index][0];
      suppliers[index][0]=name;
      parts.forEach(product=>{if(product.supplier===oldName)product.supplier=name});
      orders.forEach(order=>{if(order[1]===oldName)order[1]=name});
    });
    const savedRatings=JSON.parse(localStorage.getItem(ratingsKey)||'[]');
    if(Array.isArray(savedRatings))savedRatings.forEach((rating,index)=>{if(suppliers[index]&&Number.isFinite(Number(rating)))suppliers[index][3]=Number(rating).toFixed(1)});
  }catch(e){}

  renderSuppliers=function(){
    document.querySelector('#supplierGrid').innerHTML=suppliers.map((supplier,index)=>`<article class="card supplier-card"><div class="supplier-logo">${escapeHtml(supplier[0].slice(0,3).toUpperCase())}</div><label style="display:block;font-size:9px;color:#7d867f;font-weight:700;margin-bottom:5px">SUPPLIER NAME</label><input class="supplier-name-input" data-index="${index}" value="${escapeHtml(supplier[0])}" onclick="event.stopPropagation()" style="width:100%;height:38px;border:1px solid #dce1dc;border-radius:6px;padding:0 10px;font:700 14px 'IBM Plex Sans';margin-bottom:5px"><p>${escapeHtml(supplier[1])}</p><div class="supplier-stats"><div><small>ON-TIME</small><strong>${escapeHtml(supplier[2])}</strong></div><div><small>RATING / 5</small><input class="supplier-rating-input" data-index="${index}" type="number" min="1" max="5" step="0.1" value="${escapeHtml(supplier[3])}" onclick="event.stopPropagation()" style="width:62px;height:28px;border:1px solid #dce1dc;border-radius:5px;padding:0 7px;font-weight:700"></div><div><small>YTD SPEND</small><strong>${escapeHtml(supplier[4])}</strong></div></div><button class="primary" onclick="return saveSupplierDetails(${index},event)" style="width:100%;margin-top:16px">Save supplier</button></article>`).join('');
  };

  window.saveSupplierDetails=function(index,event){
    if(event){event.preventDefault();event.stopPropagation()}
    const nameInput=document.querySelector(`.supplier-name-input[data-index="${index}"]`);
    const ratingInput=document.querySelector(`.supplier-rating-input[data-index="${index}"]`);
    if(!nameInput||!ratingInput)return false;
    const nextName=nameInput.value.trim();
    const rating=Math.round(Number(ratingInput.value)*10)/10;
    if(!nextName){nameInput.focus();return false}
    if(!Number.isFinite(rating)||rating<1||rating>5){ratingInput.focus();return false}
    const oldName=suppliers[index][0];
    suppliers[index][0]=nextName;
    suppliers[index][3]=rating.toFixed(1);
    parts.forEach(product=>{if(product.supplier===oldName)product.supplier=nextName});
    orders.forEach(order=>{if(order[1]===oldName)order[1]=nextName});
    localStorage.setItem(namesKey,JSON.stringify(suppliers.map(supplier=>supplier[0])));
    localStorage.setItem(ratingsKey,JSON.stringify(suppliers.map(supplier=>supplier[3])));
    renderSuppliers();
    if(typeof renderParts==='function')renderParts(document.querySelector('#partSearch').value,document.querySelector('#statusFilter').value);
    if(typeof renderAttention==='function')renderAttention();
    if(typeof renderOrders==='function')renderOrders();
    if(typeof orderSelect!=='undefined'&&orderSelect){orderSelect.innerHTML=parts.map((product,i)=>`<option value="${i}">${escapeHtml(product.name)} (${escapeHtml(product.sku)})</option>`).join('');if(typeof syncSupplier==='function')syncSupplier()}
    const toast=document.querySelector('#toast');
    if(toast){toast.querySelector('strong').textContent='Supplier saved';toast.querySelector('small').textContent=`${nextName} now has a ${rating.toFixed(1)} / 5 rating.`;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}
    return false;
  };

  renderSuppliers();
})();
