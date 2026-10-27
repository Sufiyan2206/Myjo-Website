// MYJO Smart Schooling — shared site behaviour
(function(){
  // Mobile menu
  const menuBtn=document.getElementById('menuBtn'), menu=document.getElementById('menu');
  if(menuBtn&&menu){
    menuBtn.addEventListener('click',()=>{
      const o=menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',o);
      menuBtn.setAttribute('aria-label',o?'Close menu':'Open menu');
    });
  }

  // Dropdowns: click/tap and keyboard; hover on desktop
  const drops=[...document.querySelectorAll('.menu > li.has-drop')];
  const closeAll=except=>drops.forEach(li=>{if(li!==except){li.classList.remove('open');li.querySelector('button').setAttribute('aria-expanded','false')}});
  drops.forEach(li=>{
    const btn=li.querySelector('button');
    const desktop=()=>matchMedia('(min-width:1101px)').matches;
    let hovered=false; // a click right after hover-open should keep the menu open
    btn.addEventListener('click',e=>{e.stopPropagation();const o=hovered?true:!li.classList.contains('open');hovered=false;closeAll(li);li.classList.toggle('open',o);btn.setAttribute('aria-expanded',o)});
    li.addEventListener('mouseenter',()=>{if(desktop()){closeAll(li);li.classList.add('open');btn.setAttribute('aria-expanded','true');hovered=true}});
    li.addEventListener('mouseleave',()=>{if(desktop()){li.classList.remove('open');btn.setAttribute('aria-expanded','false');hovered=false}});
    li.querySelector('.dropdown').addEventListener('click',e=>e.stopPropagation());
  });
  document.addEventListener('click',()=>closeAll());
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});

  // Generic accessible tabs: [role=tablist] with [role=tab] controlling [role=tabpanel]
  document.querySelectorAll('[role="tablist"]').forEach(list=>{
    const tabs=[...list.querySelectorAll('[role="tab"]')];
    const select=t=>tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on});
    tabs.forEach((t,i)=>{
      t.addEventListener('click',()=>select(t));
      t.addEventListener('keydown',e=>{let n=null;
        if(['ArrowDown','ArrowRight'].includes(e.key))n=tabs[(i+1)%tabs.length];
        if(['ArrowUp','ArrowLeft'].includes(e.key))n=tabs[(i-1+tabs.length)%tabs.length];
        if(n){e.preventDefault();select(n);n.focus()}});
    });
  });

  // Enquiry form: validates, then opens the visitor's email app addressed to MYJO.
  // When going live, replace with a POST to your server or a form service.
  const form=document.getElementById('enquiry');
  if(form){
    const msg=document.getElementById('formMsg');
    const params=new URLSearchParams(location.search);
    if(params.get('program')){const sel=form.querySelector('[name=program]');[...sel.options].forEach(o=>{if(o.value===params.get('program'))sel.value=o.value})}
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const d=Object.fromEntries(new FormData(form)),miss=[];
      if(!d.name.trim())miss.push('full name');
      if(!d.phone.trim())miss.push('phone number');
      if(!/^\S+@\S+\.\S+$/.test(d.email.trim()))miss.push('a valid email');
      if(miss.length){msg.className='form-msg err';msg.textContent='Please add your '+miss.join(', ')+'.';return}
      const body=`Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\nProgram: ${d.program}\nChild's age: ${d.age}\n\n${d.message}`;
      location.href='mailto:info@myjoschool.com?subject='+encodeURIComponent('MYJO enquiry from '+d.name)+'&body='+encodeURIComponent(body);
      msg.className='form-msg ok';msg.textContent='Your email app is opening with your enquiry ready to send.';
    });
  }
  const yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
})();

// ===== Curriculum filter =====
(function(){
  const grid=document.getElementById('seriesGrid'); if(!grid) return;
  const buttons=[...document.querySelectorAll('.filter')], empty=document.getElementById('filterEmpty');
  buttons.forEach(b=>b.addEventListener('click',()=>{
    const g=b.dataset.filter; let shown=0;
    buttons.forEach(x=>x.setAttribute('aria-pressed',x===b));
    grid.querySelectorAll('.series-card').forEach(c=>{const on=g==='all'||c.dataset.group===g;c.hidden=!on;if(on)shown++});
    if(empty) empty.hidden=shown>0;
  }));
})();
