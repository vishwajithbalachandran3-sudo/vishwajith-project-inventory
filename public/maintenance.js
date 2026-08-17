(function(){
  const storageKey='vish-project-maintenance-schedule';
  const list=document.querySelector('#maintenanceList');
  const button=document.querySelector('#scheduleMaintenanceBtn');
  if(!list||!button)return;

  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const localDate=value=>new Date(`${value}T12:00:00`);
  const isoDate=date=>{
    const copy=new Date(date);copy.setMinutes(copy.getMinutes()-copy.getTimezoneOffset());
    return copy.toISOString().slice(0,10);
  };
  const month=date=>date.toLocaleString('en-US',{month:'short'}).toUpperCase();
  const load=()=>{try{const value=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(value)?value:[]}catch(e){return[]}};
  const save=value=>localStorage.setItem(storageKey,JSON.stringify(value));
  let customMaintenance=load();

  function defaults(){
    const today=new Date();today.setHours(12,0,0,0);
    return [
      [3,'Hydraulic Press 02','WO-4838',4,'ready'],
      [7,'CNC Mill 07','WO-4841',6,'risk'],
      [12,'Air Compressor 03','WO-4846',3,'ready']
    ].map(([offset,equipment,workOrder,parts,readiness])=>{
      const date=new Date(today);date.setDate(date.getDate()+offset);
      return{date:isoDate(date),equipment,workOrder,parts,readiness};
    });
  }

  function render(){
    const rows=[...defaults(),...customMaintenance].sort((a,b)=>a.date.localeCompare(b.date));
    const first=localDate(rows[0].date),last=localDate(rows[rows.length-1].date);
    const heading=document.querySelector('#maintenanceMonth');
    if(heading)heading.textContent=first.getMonth()===last.getMonth()?`${month(first)} ${first.getFullYear()}`:`${month(first)}–${month(last)} ${last.getFullYear()}`;
    list.innerHTML=rows.map(item=>{
      const date=localDate(item.date);
      const risk=item.readiness==='risk';
      const readinessText=risk?'1 part at risk':'Ready';
      return `<div class="maintenance-item" style="cursor:pointer"><div class="date-block"><small>${month(date)}</small><strong>${date.getDate()}</strong></div><div class="maintenance-copy"><strong>${escapeHtml(item.equipment)}</strong><small>${escapeHtml(item.workOrder)} · ${Number(item.parts)} parts required</small></div><span class="readiness ${risk?'risk':'ready'}">${readinessText}</span></div>`;
    }).join('');
  }

  let modal=document.querySelector('#maintenanceModal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='maintenanceModal';
    modal.className='modal-backdrop';
    modal.innerHTML=`<div class="modal"><button type="button" class="modal-close maintenance-close">×</button><p class="eyebrow">MAINTENANCE PLANNING</p><h2>Schedule maintenance</h2><p>Add upcoming equipment work to the dashboard.</p><form id="maintenanceForm"><label>Equipment name<input name="equipment" placeholder="e.g. Conveyor Line 04" required></label><div class="form-row"><label>Maintenance date<input name="date" type="date" required></label><label>Work order<input name="workOrder" placeholder="e.g. WO-4901" required></label></div><div class="form-row"><label>Parts required<input name="parts" type="number" min="0" value="1" required></label><label>Readiness<select name="readiness"><option value="ready">Ready</option><option value="risk">Part at risk</option></select></label></div><div class="modal-actions"><button type="button" class="secondary maintenance-close">Cancel</button><button type="submit" class="primary">Create maintenance</button></div></form></div>`;
    document.body.appendChild(modal);
  }

  const form=modal.querySelector('#maintenanceForm');
  const dateInput=form.elements.date;
  const today=new Date();today.setHours(12,0,0,0);
  const suggested=new Date(today);suggested.setDate(suggested.getDate()+5);
  dateInput.min=isoDate(today);dateInput.value=isoDate(suggested);
  button.addEventListener('click',()=>modal.classList.add('open'));
  modal.addEventListener('click',event=>{if(event.target===modal||event.target.closest('.maintenance-close'))modal.classList.remove('open')});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    customMaintenance.push({
      id:Date.now(),
      equipment:String(data.get('equipment')).trim(),
      date:String(data.get('date')),
      workOrder:String(data.get('workOrder')).trim(),
      parts:Number(data.get('parts')),
      readiness:String(data.get('readiness'))
    });
    save(customMaintenance);render();modal.classList.remove('open');form.reset();dateInput.value=isoDate(suggested);
    const toast=document.querySelector('#toast');
    if(toast){toast.querySelector('strong').textContent='Maintenance scheduled';toast.querySelector('small').textContent='The new maintenance item was added to the dashboard.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}
  });

  render();
})();
