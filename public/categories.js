(function(){
  const categoryFilter=document.querySelector('#categoryFilter');
  const statusFilter=document.querySelector('#statusFilter');
  if(!categoryFilter||!statusFilter)return;
  const categoryClass=c=>c==='Electrical'?'pending':c==='Packaging'?'received':c==='General'?'healthy':'transit';

  categoryFilter.style.display='none';
  const tabs=document.createElement('div');
  tabs.className='category-tabs';
  tabs.setAttribute('role','tablist');
  tabs.innerHTML=`
    <button class="category-tab active" data-category="all" role="tab">All Products <span>${parts.length}</span></button>
    <button class="category-tab" data-category="Mechanical" role="tab">Mechanical <span>${parts.filter(p=>p.category==='Mechanical').length}</span></button>
    <button class="category-tab" data-category="Electrical" role="tab">Electrical <span>${parts.filter(p=>p.category==='Electrical').length}</span></button>
    <button class="category-tab" data-category="General" role="tab">General <span>${parts.filter(p=>p.category==='General').length}</span></button>
    <button class="category-tab" data-category="Raw Materials" role="tab">Raw Materials <span>${parts.filter(p=>p.category==='Raw Materials').length}</span></button>
    <button class="category-tab" data-category="Packaging" role="tab">Packaging <span>${parts.filter(p=>p.category==='Packaging').length}</span></button>`;
  document.querySelector('#inventory .toolbar').insertAdjacentElement('afterend',tabs);

  renderParts=function(query='',filter='all'){
    const selectedCategory=categoryFilter.value;
    document.querySelector('#partsTable').innerHTML=parts.map((p,index)=>({p,index})).filter(({p})=>
      (p.name+p.sku+p.supplier+p.category).toLowerCase().includes(query.toLowerCase())&&
      (filter==='all'||status(p)===filter)&&(selectedCategory==='all'||p.category===selectedCategory)
    ).map(({p,index})=>`<tr><td>${partCell(p)}</td><td>${p.sku}</td><td><span class="status ${categoryClass(p.category)}">${p.category}</span></td><td>${p.supplier}</td><td><strong>${p.stock}</strong></td><td>${p.min}</td><td>$${p.price.toFixed(2)}</td><td><span class="status ${status(p)}">${statusText(status(p))}</span></td><td><button class="row-menu">•••</button></td></tr>`).join('')||'<tr><td colspan="9">No matching products found.</td></tr>';
  };
  categoryFilter.onchange=()=>renderParts(document.querySelector('#partSearch').value,statusFilter.value);
  tabs.addEventListener('click',e=>{
    const tab=e.target.closest('.category-tab');
    if(!tab)return;
    categoryFilter.value=tab.dataset.category;
    tabs.querySelectorAll('.category-tab').forEach(button=>button.classList.toggle('active',button===tab));
    renderParts(document.querySelector('#partSearch').value,statusFilter.value);
  });

  const addForm=document.querySelector('#addPartForm');
  if(addForm&&!addForm.elements.category){
    const label=document.createElement('label');
    label.innerHTML='Category<select name="category"><option>Mechanical</option><option>Electrical</option><option>General</option><option>Raw Materials</option><option>Packaging</option></select>';
    addForm.querySelector('.modal-actions').insertAdjacentElement('beforebegin',label);
    addForm.addEventListener('submit',()=>{
      const chosen=addForm.elements.category.value;
      setTimeout(()=>{if(parts[0]&&!parts[0].category){parts[0].category=chosen;renderParts()}},0);
    },true);
  }
  renderParts();
})();
