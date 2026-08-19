(function(){
  const savedKey='vish-project-order-statuses';
  try{
    const saved=JSON.parse(localStorage.getItem(savedKey)||'{}');
    orders.forEach(order=>{
      if(saved[order[0]]){
        const stored=saved[order[0]];
        order[6]=stored.value==='waiting'?'pending':stored.value;
        order[7]=stored.value==='waiting'?'Pending approval':stored.label;
      }
    });
  }catch(e){}

  const choices=[
    ['pending','Pending approval'],
    ['transit','In transit'],
    ['received','Received'],
    ['critical','Cancelled']
  ];
  const purchasedParts={
    'PO-2050':['Circuit Breaker','Auxiliary Contact','Overload Relay'],
    'PO-2049':['ABB Contactors','Auxiliary Relays'],
    'PO-2048':['Pneumatic Cylinders','Cylinder Seal Kits'],
    'PO-2047':['V-Belts','Timing Belts'],
    'PO-2046':['Circulation Pumps','Pump Flange Kits'],
    'PO-2045':['Air Filter Regulators','Pressure Gauges']
  };
  const headerRow=document.querySelector('#ordersTable').closest('table').querySelector('thead tr');
  if(!headerRow.querySelector('[data-parts-column]')){
    const heading=document.createElement('th');
    heading.textContent='PARTS PURCHASED';
    heading.dataset.partsColumn='true';
    headerRow.insertBefore(heading,headerRow.children[4]);
  }

  window.changeOrderStatus=function(index,value){
    const choice=choices.find(item=>item[0]===value);
    if(!choice)return;
    orders[index][6]=choice[0];
    orders[index][7]=choice[1];
    const saved={};
    orders.forEach(order=>saved[order[0]]={value:order[6],label:order[7]});
    localStorage.setItem(savedKey,JSON.stringify(saved));
    renderOrders();
    const toast=document.querySelector('#toast');
    toast.querySelector('strong').textContent='Order status updated';
    toast.querySelector('small').textContent=`${orders[index][0]} changed to ${choice[1]}.`;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),3000);
  };

  renderOrders=function(){
    document.querySelector('#ordersTable').innerHTML=orders.map((order,index)=>`<tr>
      <td><strong>${order[0]}</strong>${String(order[0]).startsWith('AUTO-')?'<span class="auto-po-badge">AUTOMATED</span>':''}</td>
      <td>${order[1]}</td>
      <td>${order[2]}</td>
      <td>${order[3]}</td>
      <td><div class="po-parts">${(purchasedParts[order[0]]||(order[8]?[order[8]]:['General products'])).map(part=>`<span>${part}</span>`).join('')}</div></td>
      <td>${order[4]}</td>
      <td><strong>${order[5]}</strong></td>
      <td><div class="order-status-actions"><select class="order-status-select ${order[6]}" onchange="changeOrderStatus(${index},this.value)">
        ${choices.map(choice=>`<option value="${choice[0]}" ${order[6]===choice[0]?'selected':''}>${choice[1]}</option>`).join('')}
      </select><button type="button" class="po-pdf-btn" onclick="downloadPurchaseOrderPdf(${index})">Download PDF</button></div></td>
    </tr>`).join('');
  };
  renderOrders();
})();
