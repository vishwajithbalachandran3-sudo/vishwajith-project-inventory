(function(){
  const materials=[
    {name:'304 Stainless Steel Sheet',sku:'RAW-SS304-16',supplier:'Ryerson',location:'Materials Bay A',stock:42,min:20,price:118.50,icon:'SS',category:'Raw Materials'},
    {name:'6061 Aluminum Extrusion',sku:'RAW-AL6061-2M',supplier:'Alro Steel',location:'Materials Bay B',stock:65,min:24,price:34.75,icon:'AL',category:'Raw Materials'},
    {name:'Clear Polycarbonate Sheet',sku:'RAW-PC-6MM',supplier:'SABIC',location:'Materials Bay C',stock:18,min:12,price:89.00,icon:'PC',category:'Raw Materials'},
    {name:'Corrugated Shipping Carton',sku:'PKG-CTN-18X12',supplier:'International Paper',location:'Packaging Zone A',stock:480,min:200,price:1.85,icon:'CT',category:'Packaging'},
    {name:'Protective Poly Liner Bag',sku:'PKG-LINER-30',supplier:'Berry Global',location:'Packaging Zone B',stock:950,min:400,price:0.42,icon:'LB',category:'Packaging'},
    {name:'Industrial Stretch Wrap Film',sku:'PKG-WRAP-20',supplier:'Uline',location:'Packaging Zone C',stock:72,min:30,price:16.90,icon:'SW',category:'Packaging'}
  ];
  materials.forEach(material=>{if(!parts.some(product=>product.sku===material.sku))parts.push(material)});

  const materialSuppliers=[
    ['Ryerson','Stainless steel materials','95%','4.7','$126K'],
    ['Alro Steel','Aluminum and metal stock','94%','4.6','$98K'],
    ['SABIC','Engineered sheet materials','96%','4.8','$84K'],
    ['International Paper','Corrugated packaging','93%','4.6','$72K'],
    ['Berry Global','Protective packaging','95%','4.7','$68K'],
    ['Uline','Packaging supplies','97%','4.8','$54K']
  ];
  materialSuppliers.forEach(supplier=>{if(!suppliers.some(item=>item[0]===supplier[0]))suppliers.push(supplier)});

  const categoryFilter=document.querySelector('#categoryFilter');
  if(categoryFilter){
    ['Raw Materials','Packaging'].forEach(category=>{
      if(![...categoryFilter.options].some(option=>option.value===category))categoryFilter.add(new Option(category,category));
    });
  }
  const categorySelect=document.querySelector('#addPartForm select[name="category"]');
  if(categorySelect){
    ['Raw Materials','Packaging'].forEach(category=>{
      if(![...categorySelect.options].some(option=>option.value===category))categorySelect.add(new Option(category,category));
    });
  }
  if(typeof renderSuppliers==='function')renderSuppliers();
  if(typeof bars==='function')bars('#categoryBars',[['Raw materials',29,90],['Mechanical',24,76],['Electrical',20,63],['Packaging',17,54],['General',10,32]]);
  if(typeof orderSelect!=='undefined'&&orderSelect){orderSelect.innerHTML=parts.map((product,index)=>`<option value="${index}">${product.name} (${product.sku})</option>`).join('');if(typeof syncSupplier==='function')syncSupplier()}
})();
